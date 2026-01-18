"use client"

import AdminRoute from "@/app/routes/AdminRoute"
import toast from "react-hot-toast";
import { useState } from "react";
import axios from "@/lib/axios";
import { ClipLoader } from "react-spinners";

export default function InvitePage() {
    const [formData, setFormData] = useState({
        email: "",
        matricNumber: ""
    });
    const [status, setStatus] = useState(false);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setStatus(true)

        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                "/members/invite",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            if (response.status === 200) {
                toast.success("Invitation sent successfully");
                setFormData({
                    email: "",
                    matricNumber: ""
                })
                setStatus(false)
            }
        } catch (error) {
            if (error.status === 401) {
                toast.error("Unable to send an invite");
            } else if (error.status === 400) {
                toast.error("Email already in use");
            } else {
                toast.error("Something went wrong, please try again");
            }
            setStatus(false)
        }
        setStatus(false)
    };
    return (
        <AdminRoute>
            <div className="flex flex-col items-center mx-[20%] h-screen">
                <h1 className="text-[25px] font-bold text-center leading-[1]">Invite all the class representatives in your faculty</h1>
                <form onSubmit={handleSubmit} className="mx-[8px]  lg:mx-[20%] mt-[30px] w-full">
                    <div className="w-full">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            name="email"
                            onChange={handleChange}
                            value={formData.email}
                            placeholder="timi@gmail.com"
                            className="w-full p-2 border border-[#bdbdbd] rounded"
                            required
                        />
                    </div>
                    <div className="w-full">
                        <label htmlFor="matricNumer">Matric Number</label>
                        <input
                            type="text"
                            name="matricNumber"
                            value={formData.matricNumber}
                            onChange={handleChange}
                            placeholder="CDS/2021/2345"
                            className="w-full p-2 border border-[#bdbdbd] rounded"
                            required
                        />
                    </div>
                    <button
                        disabled={status}
                        type="submit"
                        className={`flex flex-row gap-1 items-center justify-center w-full my-5 py-2 rounded  ${status
                            ? "cursor-not-allowed bg-gray-400 text-white"
                            : "cursor-pointer bg-[#5A56EA] text-[#ffffff] hover:bg-[#0B0C44] transition-all duration-500 ease-in-out"}`}>
                        {status && <ClipLoader size={20} color="#ffffff" />}Send Invite
                    </button>
                </form>
            </div>
        </AdminRoute>
    )
}