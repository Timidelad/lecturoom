"use client"

import toast from "react-hot-toast";
import { useState } from "react";
import axios from "@/lib/axios";
import { ClipLoader } from "react-spinners";
export default function Waitlist() {
    const [formData, setFormData] = useState({
        email: "",
        firstName: ""
    });
    const [status, setStatus] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus(true)

        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                "/members/add-to-access-list",
                formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                toast.success("User Added successfully");
                setFormData({
                    email: "",
                    firstName: ""
                });
                setStatus(false)
            }
        } catch (error) {
            console.log(error.message)
            if (error.status === 400) {
                toast.error("This user already exist in the access list");
                setStatus(false)
            } else {
                toast.error("Something went wrong");
                setStatus(false)
            }
        }
        setStatus(false)
    };

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }
    return (
        <div className="flex flex-col items-center mx-[20%] h-screen">
            <h1 className="text-[18px] font-medium text-center leading-[1]">Add faculty admin to the waitlist</h1>
            <form onSubmit={handleSubmit} className="mx-[8px]  lg:mx-[20%] mt-[10px] w-full">
                <div className="w-full">
                    <label htmlFor="email" className="">First Name</label>
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="john doe"
                        className="w-full p-2 border border-[#bdbdbd] rounded focus:outline-none focus:ring-2 focus:ring-[#5A56EA]"
                        required
                    />
                </div>
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
                <button
                    disabled={status}
                    type="submit"
                    className={`flex flex-row gap-1 items-center justify-center w-full my-5 py-2 rounded  ${status
                        ? "cursor-not-allowed bg-gray-400 text-white"
                        : "cursor-pointer bg-[#5A56EA] text-[#ffffff] hover:bg-[#0B0C44] transition-all duration-500 ease-in-out"}`}>
                    {status && <ClipLoader size={20} color="#ffffff" />}Add
                </button>
            </form>
        </div>
    )
}