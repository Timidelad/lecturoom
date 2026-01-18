"use client"

import { useState } from "react"
import axios from "@/lib/axios";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";

export default function CancelBookingModal({ book, onClose }) {
    const [cancelLoading, setCancelLoading] = useState(false);
    const token = localStorage.getItem("token");

    const handleCancel = async (e) => {
        e.preventDefault();
        setCancelLoading(true)

        try {
            const response = await axios.post(
                "/booking/cancel-booking",
                {
                    bookingId: book._id,
                    lectureRoomId: book.lectureRoom._id,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setCancelLoading(false)
            if (response.status === 200) {
                setCancelLoading(false)
                toast.success("Booking cancelled")
                onClose()
                // window.location.reload()
            }
        } catch (error) {
            console.log(error.message)
            toast.error("Something went wrong")
            onClose()
            // window.location.reload();
        }
    };

    return (
        <div className="fixed inset-0 bg-[#00000077]  flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
                <p className="text-center text-[17px] font-medium">Are you sure you want to cancel this booking?</p>
                <div className="flex items-center justify-center gap-2 mt-2">
                    <button
                        onClick={onClose}
                        className="bg-[#f1efef] p-2 rounded cursor-pointer hover:bg-[#ccc9c9] transition-all duration-500 ease-in-out">
                        No, go back
                    </button>
                    <button
                        disabled={cancelLoading}
                        onClick={handleCancel}
                        className={`p-2 rounded flex flex-row gap-1 items-center justify-center ${cancelLoading
                            ? "cursor-not-allowed bg-gray-400 text-white"
                            : "cursor-pointer bg-[#5A56EA] text-white p-2 rounded hover:bg-[#3a35c0] transition-all duration-500 ease-in-out"}`}>
                        {cancelLoading && <ClipLoader size={20} color="#ffffff" />}Yes, cancel
                    </button>
                </div>
            </div>
        </div>
    )
}