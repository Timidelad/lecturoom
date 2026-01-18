"use client"

import axios from "@/lib/axios";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import toast from "react-hot-toast";
import WavingHand from "@/app/components/WavingHand";
import { ClipLoader } from "react-spinners";

export default function AdminLogin() {
    const router = useRouter();
    const [status, setStatus] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus(true)

        try {
            const response = await axios.post("/authentication/admin-login", formData);
            if (response.status === 200) {
                localStorage.setItem("token", response.data.token);
                toast.success("Login successful!");
                router.push("/admindashboard");
            }
        } catch (error) {
            const status = error.response.status;
            const message = error.response.data?.message || "Something went wrong";
            if (status === 401) {
                toast.error("who are you!!!!!!")
            } else {
                toast.error("something went wrong")
            }
            setStatus(false)
        }
    };
    return (
        <div>
            <div className="pl-[6px] text-[25px] font-bold lg:pl-[64px]">Lecturoom</div>
            <hr />
            <div className="mt-[20px] mx-[8px] lg:w-full lg:mx-0 lg:flex lg:items-center lg:justify-center">
                <div className="lg:w-[500px]">
                    <h1 className="text-[23px]">Login</h1>
                    <div className="flex items-center">
                        <p className="text-[15px]">Hi, Welcome back creator</p>
                        <WavingHand />
                    </div>
                    <form className="mt-[20px]" onSubmit={handleSubmit}>
                        <div className="w-full">
                            <label htmlFor="email" className="font-semibold">Your Email</label>
                            <input
                                type="email"
                                name="email"
                                onChange={handleChange}
                                placeholder="timilehin@gmail.com"
                                className="w-full p-2 border border-[#bdbdbd] rounded focus:outline-none focus:ring-2 focus:ring-[#5A56EA]"
                                required
                            />
                        </div>
                        <div className="w-full mt-5 mb-[5px]">
                            <label htmlFor="password" className="font-semibold">Your Password</label>
                            <input
                                type="password"
                                name="password"
                                onChange={handleChange}
                                placeholder="*************"
                                className="w-full p-2 border border-[#bdbdbd] rounded focus:outline-none focus:ring-2 focus:ring-[#5A56EA]"
                                required
                            />
                        </div>
                        <button
                            disabled={status}
                            type="submit"
                            className={`flex flex-row gap-1 items-center justify-center w-full my-5 py-2 rounded  ${status
                                ? "cursor-not-allowed bg-gray-400 text-white"
                                : "cursor-pointer bg-[#5A56EA] text-[#ffffff] hover:bg-[#0B0C44] transition-all duration-500 ease-in-out"}`}>
                            {status && <ClipLoader size={20} color="#ffffff" />}Login
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}