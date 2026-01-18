"use client"

import { useState } from "react"
import axios from "@/lib/axios";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";

export default function DeleteRoomModal({ room, onClose }) {
    const [deleteLoading, setDeleteLoading] = useState(false);
    const token = localStorage.getItem("token");

    const handleDelete = async (e) => {
        e.preventDefault()
        setDeleteLoading(true)
        try {
            const response = await axios.post(
                "/upload/delete-lecture-room",
                {
                    lectureRoomId: room._id
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setDeleteLoading(false)
            if (response.status === 200) {
                toast.success("Lecture room deleted")
                onClose()
                // window.location.reload();
            }
        } catch (error) {
            toast.error("Something went wrong")
            onClose()
            // window.location.reload();
        }
        // console.log(room._id)
    }
    return (
        <div className="fixed inset-0 bg-[#00000077]  flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
                <p className="text-center text-[17px] font-medium">Are you sure you want to delete this lecture room?</p>
                <div className="flex items-center justify-center gap-2 mt-2">
                    <button
                        onClick={onClose}
                        className="bg-[#f1efef] p-2 rounded cursor-pointer hover:bg-[#ccc9c9] transition-all duration-500 ease-in-out">
                        No, cancel
                    </button>
                    <button
                        disabled={deleteLoading}
                        onClick={handleDelete}
                        className={`p-2 rounded flex flex-row gap-1 items-center justify-center ${deleteLoading
                            ? "cursor-not-allowed bg-gray-400 text-white"
                            : "cursor-pointer bg-[#5A56EA] text-white p-2 rounded hover:bg-[#3a35c0] transition-all duration-500 ease-in-out"}`}>
                        {deleteLoading && <ClipLoader size={20} color="#ffffff" />}Yes, delete
                    </button>
                </div>
            </div>
        </div>
    )
}