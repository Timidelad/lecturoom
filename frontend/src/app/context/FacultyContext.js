"use client"
import { useState, createContext, useContext, useMemo, useRef, useEffect } from "react";
import { io } from "socket.io-client";

const FacultyContext = createContext();

export const FacultyProvider = ({ children }) => {
    const [faculty, setFaculty] = useState(null);
    const socketRef = useRef(null);

    const facultyId = faculty?.faculty?._id;
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    // Setup socket once
    useEffect(() => {
        if (!token) return;

        const socket = io("https://lecturoombackend.onrender.com", {
            auth: { token },
            transports: ["websocket"],
            withCredentials: true,
        });

        // const socket = io("http://localhost:5000", {
        //     auth: { token },
        //     transports: ["websocket"],
        //     withCredentials: true,
        // });

        socketRef.current = socket;

        socket.on("connect", () => {
            console.log("✅ Connected:", socket.id);
        });

        // Listeners
        socket.on("booking:add", (populatedBooking) => {
            setFaculty((prev) => {
                if (!prev?.faculty) return prev;
                const updatedRooms = prev.faculty.lectureRooms.map((room) =>
                    room._id === populatedBooking.lectureRoom
                        ? {
                            ...room,
                            bookings: room.bookings?.some((b) => b._id === populatedBooking._id)
                                ? room.bookings
                                : [...(room.bookings || []), populatedBooking],
                        }
                        : room
                );
                return { ...prev, faculty: { ...prev.faculty, lectureRooms: updatedRooms } };
            });
        });

        socket.on("upload:lectureRoom", (newRoom) => {
            // console.log(newRoom)
            setFaculty((prev) => {
                if (!prev?.faculty) return prev;
                return {
                    ...prev,
                    faculty: {
                        ...prev.faculty,
                        lectureRooms: [
                            ...prev.faculty.lectureRooms.filter((r) => r._id !== newRoom._id),
                            newRoom,
                        ],
                    },
                };
            });
        });

        socket.on("delete:lectureRoom", (lectureRoomId) => {
            // console.log("Deleted room ID:", lectureRoomId);

            setFaculty((prev) => {
                if (!prev?.faculty) return prev;

                return {
                    ...prev,
                    faculty: {
                        ...prev.faculty,
                        lectureRooms: prev.faculty.lectureRooms.filter(
                            (room) => room._id !== lectureRoomId
                        ),
                    },
                };
            });
        });

        socket.on("booking:update", ({ lectureRoomId, booking, action }) => {
            console.log("update booking", booking);
            console.log(lectureRoomId)

            setFaculty((prev) => {
                if (!prev?.faculty?.lectureRooms) return prev;

                return {
                    ...prev,
                    faculty: {
                        ...prev.faculty,
                        lectureRooms: prev.faculty.lectureRooms.map((room) => {
                            if (room._id.toString() !== lectureRoomId.toString()) return room;

                            let updatedBookings = [...(room.bookings || [])]; // ✅ safe copy

                            if (action === "add") {
                                const exists = updatedBookings.some((b) => b._id === booking._id);
                                if (!exists) updatedBookings = [...updatedBookings, booking];
                            }

                            if (action === "update") {
                                updatedBookings = updatedBookings.map((b) =>
                                    b._id.toString() === booking._id.toString() ? booking : b
                                );
                            }

                            return { ...room, bookings: updatedBookings };
                        }),
                    },
                };
            });

        })


        return () => {
            socket.disconnect();
            socketRef.current = null;
        };
    }, [token]);

    // Handle joining a faculty when facultyId changes
    useEffect(() => {
        if (socketRef.current && facultyId) {
            socketRef.current.emit("joinFaculty", facultyId);
        }
    }, [facultyId]);

    const value = useMemo(
        () => ({ faculty, setFaculty, socket: socketRef.current }),
        [faculty]
    );

    return <FacultyContext.Provider value={value}>{children}</FacultyContext.Provider>;
};

export const useFaculty = () => useContext(FacultyContext);
