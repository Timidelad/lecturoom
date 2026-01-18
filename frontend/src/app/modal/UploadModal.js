"use client"
import { useState } from "react"
import { X } from "lucide-react";
import axios from "@/lib/axios";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import { uploadLectureRoomImage } from "../apiCalls/UploadLectureRoomImage";
import { useFaculty } from "@/app/context/FacultyContext"

export default function UploadModal({ isOpen, onClose, id }) {
    const [roomName, setRoomName] = useState("");
    const [capacity, setCapacity] = useState("");
    const [facilities, setFacilities] = useState("");
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setImage(e.target.files[0])
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!image) {
            alert("Please select an image for the lecture room")
            return
        }

        setLoading(true)

        try {
            const imageUrl = await uploadLectureRoomImage(image);
            const token = localStorage.getItem("token");

            const payload = {
                roomName,
                capacity: Number(capacity),
                facilities: facilities
                    .split(",")
                    .map((f) => f.trim())
                    .filter((f) => f !== ""),
                imageUrl,
            }

            const response = await axios.post(
                "/upload/upload-lecture-room",
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            if (response.status === 200) {
                toast.success("Lecture room uploaded successfully!")
                setRoomName("")
                setCapacity("")
                setFacilities("")
                setImage("")
            }
            // console.log("send this to the data base", payload)
            setLoading(false)
            onClose()
        } catch (error) {
            if (error.status === 400) {
                toast.error("Failed to upload lecture room. Please try again.")
            } else if (error.status === 401) {
                toast.error("Failed to upload lecture room. Please try again.")
            } else {
                toast.error("Failed to upload lecture room. Please try again.")
            }
            setLoading(false)
        }
    };

    return (
        <div className="fixed inset-0 bg-[#00000077]  flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
                {/* header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Upload Lecture Room</h2>
                    <button onClick={onClose}>< X className="text-[#5A56EA] cursor-pointer" /></button>
                </div>
                {/* form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1 font-medium">Lecture Room Image</label>
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full border p-2 border-[#bdbdbd] rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#5A56EA]"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Lecture Room Name</label>
                        <input
                            type="text"
                            name="roomName"
                            value={roomName}
                            onChange={(e) => setRoomName(e.target.value)}
                            required
                            className="w-full border p-2 border-[#bdbdbd] rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#5A56EA]"
                            placeholder="E.g. MSS1"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Capacity</label>
                        <input
                            type="number"
                            name="capacity"
                            value={capacity}
                            onChange={(e) => setCapacity(e.target.value)}
                            required
                            className="w-full border border-[#bdbdbd] p-2 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#5A56EA]"
                            placeholder="E.g. 150"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Facilities</label>
                        <input
                            type="text"
                            name="facilities"
                            value={facilities}
                            onChange={(e) => setFacilities(e.target.value)}
                            className="w-full border border-[#bdbdbd] p-2 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#5A56EA]"
                            placeholder="seperate with commas (e.g Projector, AC"
                        />
                    </div>
                    <button
                        disabled={loading}
                        type="submit"
                        className={` w-full my-5 py-2 rounded  ${loading
                            ? "cursor-not-allowed bg-gray-400 text-white"
                            : "cursor-pointer bg-[#5A56EA] text-[#ffffff] hover:bg-[#0B0C44] transition-all duration-500 ease-in-out"}`}>
                        {loading && <ClipLoader size={20} color="#ffffff" />}Upload
                    </button>
                </form>
            </div>
        </div>
    )
}