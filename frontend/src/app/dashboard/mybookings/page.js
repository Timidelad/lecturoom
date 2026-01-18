"use client";

import { useFaculty } from "@/app/context/FacultyContext";
import { useState, useEffect, useMemo } from "react";
import { UserRound } from 'lucide-react';
import { isAfter, parseISO } from "date-fns";
import CancelBookingModal from "@/app/modal/cancelBookingModal";
import EditBookingModal from "@/app/modal/EditBookingModal";
export default function MyBookingsPage() {
    const { faculty } = useFaculty();
    const userId = faculty.userId;
    const today = new Date().toISOString().split("T")[0];
    // console.log(today)
    const [selectedDate, setSelectedDate] = useState(today);
    const [activeDate, setActiveDate] = useState(today);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [editBooking, setEditBooking] = useState(null);
    const allBookings = faculty.faculty.lectureRooms.flatMap(
        (room) => room.bookings || []
    );
    // const myBookings = allBookings.filter(
    //     (b) => b.user._id == userId
    // );
    const myBookings = useMemo(() => {
        return allBookings.filter((b) => b.user._id === userId);
    }, [allBookings, userId]);

    useEffect(() => {
        let results = myBookings.filter((b) => b.date === activeDate);
        results.sort((a, b) => new Date(`${a.date}T${a.startTime}`) - new Date(`${b.date}T${b.startTime}`))
        setFilteredBookings(results)
    }, [activeDate])

    function canCancelBooking(booking) {
        const now = new Date();

        const bookingDateTime = new Date(`${booking.date}T${booking.endTime}`);

        if (isAfter(now, bookingDateTime)) return false;

        const today = new Date();

        today.setHours(0, 0, 0, 0);
        const bookingDate = parseISO(booking.date);
        if (bookingDate < today) return false;

        return true;
    }

    // if (!faculty.faculty.lectureRooms || faculty.faculty.lectureRooms.length === 0) {
    //     return <p>There is no lecture room for booking in your faculty</p>
    // }

    if (myBookings.length === 0) {
        return <p className="w-full h-screen flex items-center justify-center">You have not made any booking</p>
    }
    return (
        <div className="h-screen">
            <div className="md:flex justify-between items-center">
                <h2>All your Bookings</h2>
                <div className="flex gap-2">
                    <input
                        type="date"
                        className="border rounded p-2 border-[#5A56EA]"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />
                    <button onClick={() => setActiveDate(selectedDate)} className="bg-[#5A56EA] px-[10px] py-[10px] rounded-md text-white cursor-pointer">Search</button>
                </div>
            </div>
            {filteredBookings.length === 0 ? (
                <p>You do not have any bookings for {activeDate}</p>
            ) : (
                <ul className="flex flex-row flex-wrap gap-4 my-3">
                    {filteredBookings.map(b => (
                        <li key={b._id} className="bg-white w-full lg:w-[48%] flex flex-col justify-center gap-2 border border-[#aca5a5] rounded-[10px] p-[10px] h-[150px] ">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className='text-[15px] font-semibold flex items-center gap-2'>{b.lectureRoom.roomName}</div>
                                    <div className={`p-[5px] rounded-[15px] text-[15px] text-white ${b.status === "confirmed" ? "bg-green-600" : "bg-red-600"}`}>{b.status}</div>
                                </div>
                                {canCancelBooking(b) && b.status === "confirmed" && (
                                    <button onClick={() => setEditBooking(b)} className="rounded border-[1px] border-[#5A56EA] py-[4px] px-[8px] text-[#5A56EA] cursor-pointer">Edit</button>
                                )}
                            </div>
                            <div className='flex items-center text-[#5B5555]'>({b.startTime} - {b.endTime})</div>
                            <div>{b.purpose}</div>
                            <div className="flex items-center justify-between">
                                <div className='flex items-center text-[#5B5555] gap-2'><UserRound /> {b.user.fullname}</div>
                                {canCancelBooking(b) && b.status === "confirmed" && (
                                    <button onClick={() => setSelectedBooking(b)} className="bg-[#5A56EA] text-white cursor-pointer rounded-[10px] py-[4px] px-[8px]">Cancel booking</button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {
                selectedBooking && (
                    <CancelBookingModal
                        book={selectedBooking}
                        onClose={() => setSelectedBooking(null)}
                    />
                )
            }

            {
                editBooking && (
                    <EditBookingModal
                        edit={editBooking}
                        onClose={() => setEditBooking(null)}
                    />
                )
            }
        </div>
    )
}