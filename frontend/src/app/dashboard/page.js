"use client"
import { Plus, School, ClipboardClock, Clock9, Clock3, Dot, UserRound } from 'lucide-react';
import Link from 'next/link';
import { useFaculty } from '../context/FacultyContext';
export default function DashBoardPage() {
    const { faculty } = useFaculty();
    const today = new Date().toISOString().split("T")[0];
    const allBookings = faculty.faculty.lectureRooms.flatMap(
        (room) => room.bookings || []
    );
    const bookingMadeToday = allBookings.filter(booking => {
        const bookingDate = new Date(booking.createdAt).toISOString().split("T")[0];
        return bookingDate === today
    });
    const bookingsForToday = allBookings.filter((b) => b.date === today);
    const bookingsForTodayStatus = bookingsForToday.filter((b) => b.status === "confirmed");
    // console.log(faculty.faculty)
    return (
        <div className=' pb-[30px]'>
            <h1 className="text-[25px] font-semibold">Faculty Dashboard</h1>
            <p className="text-[#5B5555] text-[15px]">Monitor bookings in your faculty</p>
            <Link href="/dashboard/lecturerooms" className='inline-flex bg-[#5A56EA] text-white p-2 rounded gap-1'><Plus />New booking</Link>
            <div className='flex flex-col md:flex-row lg:flex-row lg:w-full gap-6 mt-[24px]'>
                <div className='bg-white p-[20px] flex flex-col gap-3 rounded w-full hover:bg-[#5b56ea54] transition-all duration-500 ease-in-out'>
                    <div className='flex items-center justify-between font-semibold'>Total Lecture Rooms <School className='text-[#5B5555]' /></div>
                    <div className='text-[20px] font-semibold'>{faculty.faculty.lectureRooms.length}</div>
                </div>
                <div className='bg-white p-[20px] flex flex-col gap-3 rounded w-full hover:bg-[#5b56ea54] transition-all duration-500 ease-in-out'>
                    <div className='flex items-center justify-between font-semibold'>Bookings made today<Clock9 className='text-[#5B5555]' /></div>
                    <div className='text-[20px] font-semibold'>{bookingMadeToday.length === 0 ? (
                        <p>0</p>
                    ) : (<p>{bookingMadeToday.length}</p>)}</div>
                </div>
            </div>
            <div className='flex flex-col md:flex-row lg:flex-row lg:w-full gap-6 mt-[24px]'>
                <div className='bg-white p-[20px] flex flex-col gap-3 rounded w-full hover:bg-[#5b56ea54] transition-all duration-500 ease-in-out'>
                    <div className='flex items-center justify-between font-semibold'>Bookings for today<ClipboardClock className='text-[#5B5555]' /></div>
                    <div className='text-[20px] font-semibold'>{bookingsForTodayStatus.length === 0 ? (
                        <p>0</p>
                    ) : (<p>{bookingsForTodayStatus.length}</p>)}</div>
                </div>
                <div className='bg-white p-[20px] flex flex-col gap-3 rounded w-full hover:bg-[#5b56ea54] transition-all duration-500 ease-in-out'>
                    <div className='flex items-center justify-between font-semibold'>Faculty Hours<Clock3 className='text-[#5B5555]' /></div>
                    <div className='text-[20px] font-semibold'>Start time <span className='text-[#5A56EA]'>: {faculty.faculty.bookingStartTime ?? "--"}</span> End Time <span className='text-[#5A56EA]'>: {faculty.faculty.bookingEndTime ?? "--"}</span></div>
                </div>
            </div>
            {/* Todays bookings */}
            <div className='mt-[36px] bg-[white] px-[20px] rounded py-4'>
                <div>
                    <div className="text-[25px] font-semibold">Todays Bookings Timeline</div>
                    <p className="text-[#5B5555] text-[15px]">Overview of all the bookings made today</p>
                </div>
                {bookingMadeToday.length === 0 ? (
                    <div className='flex h-[300px] items-center justify-center'>
                        <p className=''>No bookings made yet today</p>
                    </div>
                ) : (
                    <ul className='flex flex-row flex-wrap h-[300px] my-3 overflow-y-auto no-scrollbar space-y-4 gap-4'>
                        {bookingMadeToday.map(booking => (
                            <div key={booking._id} className='w-full lg:w-[48%] flex flex-col justify-center gap-2 border border-[#aca5a5] rounded-[10px] p-[10px] h-[130px] hover:bg-[#5b56ea54] transition-all duration-500 ease-in-out'>
                                <div className='text-[15px] font-semibold flex items-center gap-2'>{booking.lectureRoom.roomName}<span className={`p-[5px] rounded-[15px] text-[15px] text-white ${booking.status === "confirmed" ? "bg-green-600" : "bg-red-600"}`}>{booking.status}</span></div>
                                <div className='flex items-center text-[#5B5555]'>({booking.startTime} - {booking.endTime})<Dot /> <span>{booking.purpose}</span></div>
                                <div className='flex items-center text-[#5B5555] gap-2'><UserRound />{booking.user.fullname}</div>
                            </div>
                        ))}
                    </ul>
                )}
            </div>
            {/* confirmed bookings happening today */}
            <div className='mt-[36px] bg-[white] px-[20px] rounded py-4'>
                <div>
                    <div className="text-[25px] font-semibold">Confirmed bookings happening today</div>
                    <p className="text-[#5B5555] text-[15px]">Bookings for {today}</p>
                </div>
                {bookingsForTodayStatus.length === 0 ? (
                    <div className='flex h-[300px] items-center justify-center'>
                        <p className=''>No confirmed bookings today</p>
                    </div>
                ) : (
                    <ul className='flex flex-row flex-wrap h-[300px] my-3 overflow-y-auto no-scrollbar space-y-4 gap-4'>
                        {bookingsForTodayStatus.map(booking => (
                            <div key={booking._id} className="bg-white w-full lg:w-[48%] flex flex-col justify-center gap-2 border border-[#aca5a5] rounded-[10px] p-[10px] h-[130px] hover:bg-[#5b56ea54] transition-all duration-500 ease-in-out">
                                <div className='text-[15px] font-semibold flex items-center gap-2'>{booking.lectureRoom.roomName}</div>
                                <div className='flex items-center text-[#5B5555]'>({booking.startTime} - {booking.endTime})</div>
                                <div>{booking.purpose}</div>
                                <div className='flex items-center text-[#5B5555] gap-2'><UserRound />{booking.user.fullname}</div>
                            </div>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}