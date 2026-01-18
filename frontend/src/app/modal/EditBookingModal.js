"use client"

import { useState } from "react"
import { X, Calendar } from "lucide-react";
import axios from "@/lib/axios";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";

export default function EditBookingModal({ edit, onClose }) {
    const [date, setDate] = useState(edit.date);
    const [startTime, setStartTime] = useState(edit.startTime);
    const [endTime, setEndTime] = useState(edit.endTime);
    const [purpose, setPurpose] = useState(edit.purpose);
    const [checkLoading, setCheckLoading] = useState(false);
    const [checkMessageStatus, setCheckMessageStatus] = useState(false);
    const [checkMessage, setCheckMessage] = useState("");
    const [checkErrorStatus, setCheckErrorStatus] = useState(false);
    const [checkError, setCheckError] = useState("");
    const [bookLoading, setLoadingSubmit] = useState(false);
    const today = new Date().toISOString().split("T")[0];
    const token = localStorage.getItem("token");
    if (!edit) return null;
    // console.log(edit._id)

    const bookLectureRoom = async (e) => {
        e.preventDefault();
        setLoadingSubmit(true);
        setCheckMessageStatus(false);
        setCheckErrorStatus(false);

        try {
            const response = await axios.post(
                "/booking/edit-lecture-room",
                {
                    bookingId: edit._id,
                    lectureRoomId: edit.lectureRoom._id,
                    date,
                    startTime,
                    endTime,
                    purpose,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setLoadingSubmit(false);
            const data = response.data;
            if (data.available === true) {
                toast.success(data.message)
                setDate("")
                setStartTime("")
                setEndTime("")
                setPurpose("")
            } else if (data.available === false) {
                setCheckErrorStatus(true);
                setCheckError(data.message)
                setCheckMessageStatus(false);
            }
        } catch (error) {
            console.log(error)
            if (error.status === 500) {
                toast.error("Something went wrong, please try again")
            }
            toast.error("Something went wrong, please try again")
        }
        setLoadingSubmit(false);
    };

    const checkAvailability = async (e) => {
        e.preventDefault();
        setCheckLoading(true);

        try {
            const response = await axios.post(
                "/booking/check-edit-availability",
                {
                    bookingId: edit._id,
                    lectureRoomId: edit.lectureRoom._id,
                    date,
                    startTime,
                    endTime
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setCheckLoading(false)
            const data = response.data;
            if (data.available === true) {
                setCheckMessageStatus(true);
                setCheckErrorStatus(false);
                setCheckMessage(data.message)
            } else if (data.available === false) {
                setCheckErrorStatus(true);
                setCheckError(data.message)
                setCheckMessageStatus(false);
            }
        } catch (error) {
            console.log(error)
            if (error.status === 500) {
                toast.error("Something went wrong, please try again")
            }
            toast.error("Something went wrong, please try again")
        }
        setCheckLoading(false);
    };
    return (
        <div className="fixed  inset-0 bg-[#00000077] flex items-center justify-center z-50">
            <div className="bg-white p-3 rounded w-[300px] md:w-[400px]">
                <div className="flex justify-between items-center">
                    <div className="flex gap-2 items-center"><Calendar /><h1 className="text-[20px] font-medium">Edit your booking</h1></div>
                    <button onClick={onClose} className=""><X className="text-[#5A56EA]" /></button>
                </div>
                <form onSubmit={checkAvailability} className="flex flex-col">
                    <div className="flex flex-col">
                        <label htmlFor="" className="text-[15px] font-medium">Date</label>
                        <input
                            value={date}
                            type="date"
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full border p-2 border-[#bdbdbd] rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#5A56EA]"
                            min={today}
                            required
                        />
                    </div>
                    <div className="flex flex-col mt-2">
                        <label htmlFor="" className="text-[15px] font-medium">Start Time</label>
                        <input
                            value={startTime}
                            type="time"
                            onChange={(e) => setStartTime(e.target.value)}
                            className="w-full border p-2 border-[#bdbdbd] rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#5A56EA]"
                            required
                        />
                    </div>
                    <div className="flex flex-col mt-2">
                        <label htmlFor="" className="text-[15px] font-medium">End Time</label>
                        <input
                            value={endTime}
                            type="time"
                            onChange={(e) => setEndTime(e.target.value)}
                            className="w-full border p-2 border-[#bdbdbd] rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#5A56EA]"
                            required
                        />
                    </div>
                    <div className="flex flex-col mt-2">
                        <label htmlFor="" className="text-[15px] font-medium">Purpose</label>
                        <input
                            value={purpose}
                            type="text"
                            onChange={(e) => setPurpose(e.target.value)}
                            placeholder="CSO 204 Lecture"
                            className="w-full border p-2 border-[#bdbdbd] rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#5A56EA]"
                            required
                        />
                    </div>
                    {checkMessageStatus && <p className="text-green-600 text-center my-2">{checkMessage}</p>}
                    {checkErrorStatus && <p className="text-red-600 text-center my-2">{checkError}</p>}
                    <br></br>
                    <div className="flex flex-row gap-3 justify-center">
                        <button
                            type="submit"
                            disabled={checkLoading}
                            className={`bg-[#5A56EA] p-2 rounded flex flex-row gap-1 items-center justify-center ${checkLoading
                                ? "cursor-not-allowed bg-gray-400 text-white"
                                : "cursor-pointer bg-[#5A56EA] text-[#ffffff] hover:bg-[#0B0C44] transition-all duration-500 ease-in-out"}`}>
                            {checkLoading && <ClipLoader size={20} color="#ffffff" />}Check Availability
                        </button>
                        <button
                            onClick={bookLectureRoom}
                            type="button"
                            disabled={bookLoading}
                            className={`bg-[#5A56EA] p-2 rounded flex flex-row gap-1 items-center justify-center ${bookLoading
                                ? "cursor-not-allowed bg-gray-400 text-white"
                                : "cursor-pointer bg-[#5A56EA] text-[#ffffff] hover:bg-[#0B0C44] transition-all duration-500 ease-in-out"}`}>
                            {bookLoading && <ClipLoader size={20} color="#ffffff" />}Book
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}