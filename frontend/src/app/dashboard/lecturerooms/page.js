"use client"
import BookingModal from "@/app/modal/BookingModal"
import { useFaculty } from "@/app/context/FacultyContext"
import { useState } from "react"
import { BounceLoader } from "react-spinners";
import { MapPinHouse, Users } from 'lucide-react';
// import Image from "next/image";

export default function LectureRoomsPage() {
    const { faculty } = useFaculty();
    // const now = new Date();
    // const hours = now.getHours();
    // const minutes = now.getMinutes();
    // const time = `${hours}:${minutes.toString().padStart(2, '0')}`;
    // console.log(time)
    const [selectedRoom, setSelectedRoom] = useState(null);

    if (faculty.faculty.lectureRooms.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>No lecture room is available</p>
            </div>
        )
    }
    return (
        <div className="h-screen bg-[f8f8f8]">
            <div className="my-4">
                <h1 className="text-[25px] font-medium leading-[1]">Available lecture rooms</h1>
                <p className="text-[15px] text-[#5B5555] leading-[1]">Checkout and book available lecture rooms in your faculty</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {faculty.faculty.lectureRooms.map((room) => (
                    <div onClick={() => setSelectedRoom(room)} key={room._id} className="bg-white border-[#cac8c8ec] rounded-[10px] border-[1px] hover:shadow-lg  flex flex-col">
                        <img
                            src={room.imageUrl}
                            alt={room.roomName}
                            className="object-cover w-full h-[130px] rounded-t-[10px] "
                        />
                        {/* <Image
                            src={room.imageUrl}
                            alt={room.roomName}
                            width={500} // set an appropriate width
                            height={130} // set an appropriate height
                            className="object-cover w-full h-[130px] rounded-t-[10px]"
                        /> */}
                        <div className="p-[10px] flex flex-col gap-3">
                            <div className="flex gap-2 items-center"><MapPinHouse className="w-[25px] h-[25px]" /><p className="text-[23px] font-normal mt-2">{room.roomName}</p></div>
                            <div className=" flex items-center gap-2 text-[#5B5555]"><Users />Capacity: {room.capacity} people</div>
                            <div>
                                <p className="font-semibold">Features:</p>
                                <div className="flex flex-wrap gap-3">{room.facilities.map((facility, index) => (<div key={index} className="bg-[#E1E7EF] px-[8px] py-[3px] rounded-[15px]">{facility}</div>))}</div>
                            </div>
                            <button className="bg-[#5A56EA] w-full py-2 rounded text-white font-medium text-[18px] cursor-pointer">Book This Room</button>
                        </div>
                    </div>
                ))}
            </div>
            {
                selectedRoom && (
                    <BookingModal
                        room={selectedRoom}
                        onClose={() => setSelectedRoom(null)}
                    />
                )
            }
        </div>
    )
}