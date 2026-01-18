"use client";

import { useFaculty } from "@/app/context/FacultyContext";
import { UserRound } from 'lucide-react';
import { useEffect, useState } from "react";
export default function AllBookingPage() {
    const { faculty } = useFaculty();
    const today = new Date().toISOString().split("T")[0];
    // console.log(today)
    const [selectedDate, setSelectedDate] = useState(today);
    const [activeDate, setActiveDate] = useState(today);
    const [filteredBookings, setFilteredBookings] = useState([]);

    const allBookings = faculty.faculty.lectureRooms.flatMap(
        (room) => room.bookings || []
    );

    useEffect(() => {
        let results = allBookings.filter((b) => b.date === activeDate);
        results.sort((a, b) => new Date(`${a.date}T${a.startTime}`) - new Date(`${b.date}T${b.startTime}`))
        setFilteredBookings(results)
    }, [activeDate])

    if (!faculty.faculty.lectureRooms || faculty.faculty.lectureRooms.length === 0) {
        return <p className="w-full h-screen flex items-center justify-center">No booking has been made in your faculty</p>
    }

    // const allBookings = faculty.faculty.lectureRooms.flatMap(
    //     (room) => room.bookings || []
    // );
    // console.log(allBookings)
    if (allBookings.length === 0) {
        return <p className="w-full h-screen flex items-center justify-center">No bookings available in this faculty</p>
    }

    // useEffect(() => {
    //     let results = allBookings.filter((b) => b.date === activeDate);
    //     results.sort((a, b) => new Date(`${a.date}T${a.startTime}`) - new Date(`${b.date}T${b.startTime}`))
    //     setFilteredBookings(results)
    // }, [activeDate])
    // console.log(filteredBookings)
    return (
        <div className="h-screen">
            <div className="md:flex justify-between items-center">
                <h2>All Bookings in the faculty</h2>
                <div className="flex gap-2">
                    <input
                        type="date"
                        className="border rounded p-2 border-[#5A56EA]"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />
                    <button onClick={() => setActiveDate(selectedDate)}
                        className="bg-[#5A56EA] px-[10px] py-[10px] rounded-md text-white cursor-pointer">Search
                    </button>
                </div>
            </div>
            {filteredBookings.length === 0 ? (
                <p>No bookings found for {activeDate}</p>
            ) : (
                <ul className="flex flex-row flex-wrap gap-4 my-3">
                    {filteredBookings.map(b => (
                        <li key={b._id} className="bg-white w-full lg:w-[48%] flex flex-col justify-center gap-2 border border-[#aca5a5] rounded-[10px] p-[10px] h-[150px] hover:bg-[#5b56ea54] transition-all duration-500 ease-in-out">
                            <div className="flex items-center gap-2">
                                <div className='text-[15px] font-semibold flex items-center gap-2'>{b.lectureRoom.roomName}</div>
                                <div className={`p-[5px] rounded-[15px] text-[15px] text-white ${b.status === "confirmed" ? "bg-green-600" : "bg-red-600"}`}>{b.status}</div>
                            </div>
                            <div className='flex items-center text-[#5B5555]'>({b.startTime} - {b.endTime})</div>
                            <div>{b.purpose}</div>
                            <div className='flex items-center text-[#5B5555] gap-2'><UserRound /> {b.user.fullname}</div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}