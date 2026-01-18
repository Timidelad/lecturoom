"use client"

import toast from "react-hot-toast";
import { useState } from "react";
import axios from "@/lib/axios";
import { ClipLoader } from "react-spinners";

export default function AccessList() {
    const [formData, setFormData] = useState({
        email: "",
        firstName: ""
    });
    const [status, setStatus] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus(true)

        try {
            const response = await axios.post("/members/add-to-wait-list", formData);
            if (response.status === 200) {
                toast.success("Your email has been added to the wait-list successfully. You will receive an email once you have been added to the access list.")
                setFormData({
                    email: "",
                    firstName: ""
                })
                setStatus(false)
            }
        } catch (error) {
            console.log(error)
            if (error.status === 409) {
                toast.error("Your email already exist in the wait-list")
            } else {
                toast.status("something went wrong while ading your email")
            }
            setStatus(false)
        }
    };
    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }
    return (
        <div className="px-[10px] h-screen flex items-center justify-center">
            <div className="lg:w-[600px] md:w-[500px]">
                <h1 className="text-[25px] leading-[1] text-center font-bold text-[#5A56EA]">Joining Our Access List</h1>
                <p className="text-[#595c5f] text-center mt-3">We&apos;re inviting a small group of testers to try LECTUROOM early, explore its features, and share honest feedback. Enter your first name and email to join the waitlist, and we&apos;ll email you once you&apos;ve been added to the access list.</p>
                <form className="mt-2 flex flex-col gap-2 lg:flex-col " onSubmit={handleSubmit}>
                    <div className="flex flex-col lg:flex-row gap-3">
                        <div className="w-full lg:w-[50%]">
                            <label htmlFor="email" className="font-semibold">Your firstName</label>
                            <input
                                type="text"
                                name="firstName"
                                onChange={handleChange}
                                value={formData.firstName}
                                placeholder="John"
                                className="w-full p-2 border border-[#bdbdbd] rounded focus:outline-none focus:ring-2 focus:ring-[#5A56EA]"
                                required
                            />
                        </div>
                        <div className="w-full lg:w-[50%]">
                            <label htmlFor="email" className="font-semibold">Your Email</label>
                            <input
                                type="email"
                                name="email"
                                onChange={handleChange}
                                value={formData.email}
                                placeholder="yourmail@gmail.com"
                                className="w-full p-2 border border-[#bdbdbd] rounded focus:outline-none focus:ring-2 focus:ring-[#5A56EA]"
                                required
                            />
                        </div>
                    </div>
                    <button
                        disabled={status}
                        type="submit"
                        className={` flex flex-row gap-1 items-center justify-center w-full py-2 rounded  ${status
                            ? "cursor-not-allowed bg-gray-400 text-white"
                            : "cursor-pointer bg-[#5A56EA] text-[#ffffff] hover:bg-[#0B0C44] transition-all duration-500 ease-in-out"}`}>
                        {status && <ClipLoader size={20} color="#ffffff" />}Join
                    </button>
                </form>
            </div>
        </div>
    )
}