"use client"
import AdminRoute from "@/app/routes/AdminRoute"
import { useState } from "react";
import axios from "@/lib/axios";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import UploadModal from "@/app/modal/UploadModal";
import { useFaculty } from "@/app/context/FacultyContext";
import { MapPinHouse, Users } from 'lucide-react';
import DeleteRoomModal from "@/app/modal/DeleteRoomModal";

export default function UploadPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const token = localStorage.getItem("token");
    const [loading, setLoading] = useState(false);
    const { faculty } = useFaculty();
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [deactivate, setDeactivate] = useState(true);

    const handleSetTime = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(
                "/upload/set-hours",
                { startTime, endTime },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            if (response.status === 200) {
                toast.success("Booking time added successfully")
            }
            setLoading(false)
            setEndTime("")
            setStartTime("")
            window.location.reload();
        } catch (error) {
            if (error.response === 400) {
                toast.error("Failed to add booking time")
            } else if (error.status === 401) {
                toast.error("Failed to add booking time")
            } else {
                toast.error("Something went wrong")
            }
            setLoading(false)
            setEndTime("")
            setStartTime("")
        }
    };
    return (
        <AdminRoute>
            <div className="bg-[#f8f8f8] h-screen">
                {!faculty.faculty.bookingStartTime
                    && (
                        <form className="w-full" onSubmit={handleSetTime}>
                            <h1 className="font-medium">Set the booking hours for your faculty</h1>
                            <div className="flex gap-2 w-full flex-col">
                                <div className="w-full flex flex-row gap-3">
                                    <div className="flex flex-col w-full">
                                        <label htmlFor="startTime" className="font-medium" >Start Time</label>
                                        <input
                                            type="time"
                                            placeholder="07:00 AM"
                                            value={startTime}
                                            onChange={(e) => setStartTime(e.target.value)}
                                            className="border rounded p-2 border-[#5A56EA]"
                                            required
                                        />
                                    </div>
                                    <div className="flex flex-col w-full">
                                        <label htmlFor="endTime" className="font-medium">End Time</label>
                                        <input
                                            type="time"
                                            value={endTime}
                                            onChange={(e) => setEndTime(e.target.value)}
                                            className="border rounded p-2 border-[#5A56EA]"
                                            required
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="bg-[#5A56EA] px-[10px] py-[10px] rounded-md text-white cursor-pointer">{loading && <ClipLoader size={20} color="#ffffff" />}Set</button>
                            </div>
                        </form>
                    )}
                <h1 className="text-2xl font-bold my-4 text-center">Upload all the lecture rooms in your faculty</h1>
                <button
                    onClick={() => {
                        if (!faculty?.faculty?.bookingStartTime) {
                            toast.error("Please set the booking hours for your faculty")
                            return;
                        }
                        setIsModalOpen(!isModalOpen);
                    }}
                    className={`flex flex-row gap-1 items-center justify-center w-full my-5 py-2 rounded  ${loading
                        ? "cursor-not-allowed bg-gray-400 text-black"
                        : "cursor-pointer bg-[#5A56EA] text-[#ffffff] hover:bg-[#0B0C44] transition-all duration-500 ease-in-out"}`}>
                    upload
                </button>

                <div className="w-full">
                    {faculty.faculty.lectureRooms.length === 0 ? (
                        <div className="w-full h-[200px] flex items-center justify-center">You have not uploaded any lecture room</div>
                    ) : (<>
                        <div>Lecture Rooms you have uploaded</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {faculty.faculty.lectureRooms.map((room) => (
                                <div key={room._id} className="bg-white border-[#cac8c8ec] rounded-[10px] border-[1px] hover:shadow-lg  flex flex-col">
                                    <img
                                        src={room.imageUrl}
                                        alt={room.roomName}
                                        className="object-cover w-full h-[130px] rounded-t-[10px] "
                                    />
                                    <div className="p-[10px] flex flex-col gap-3">
                                        <div className="flex gap-2 items-center"><MapPinHouse className="w-[25px] h-[25px]" /><p className="text-[23px] font-normal mt-2">{room.roomName}</p></div>
                                        <div className=" flex items-center gap-2 text-[#5B5555]"><Users />Capacity: {room.capacity} people</div>
                                        <div>
                                            <p className="font-semibold">Features:</p>
                                            <div className="flex flex-wrap w-full gap-3">{room.facilities.map((facility, index) => (<div key={index} className="bg-[#E1E7EF] px-[8px] py-[3px] rounded-[15px] ">{facility}</div>))}</div>
                                        </div>
                                        <button onClick={() => setSelectedRoom(room)} className="bg-[#5A56EA] w-full py-2 rounded text-white font-medium text-[18px] cursor-pointer">Delete room</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                    )}
                </div>

                <UploadModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
                {
                    selectedRoom && (
                        <DeleteRoomModal
                            room={selectedRoom}
                            onClose={() => setSelectedRoom(null)}
                        />
                    )
                }
            </div>
        </AdminRoute>
    )
}