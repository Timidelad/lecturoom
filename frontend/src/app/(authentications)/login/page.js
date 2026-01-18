"use client"

import axios from "@/lib/axios";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import toast from "react-hot-toast";
import Link from "next/link";
import WavingHand from "@/app/components/WavingHand";
import { ClipLoader } from "react-spinners";

export default function LoginPage() {
    const router = useRouter();
    const [status, setStatus] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    }
    );

    //handle change
    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    //handle submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus(true)

        try {
            const response = await axios.post("/authentication/login", formData);
            if (response.status === 200) {
                toast.success("Login successful!");
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("isAdmin", response.data.isAdmin)
                router.push("/dashboard");
            }
        } catch (error) {
            console.log(error)
            const status = error.response.status;
            const message = error.response.data?.message || "Something went wrong";
            if (status === 401) {
                toast.error("Invalid email or password");
                setStatus(false)
            } else if (status === 403) {
                toast.error("Please verify your email before logging in");
                setStatus(false)
            } else {
                toast.error(message);
                setStatus(false)
            }
            setStatus(false)
        }
    };
    return (
        <div>
            <div className="pl-1.5 text-[25px] font-bold lg:pl-16">Lecturoom</div>
            <hr />
            <div className="mt-5 mx-2 lg:w-full lg:mx-0 lg:flex lg:items-center lg:justify-center">
                <div className="lg:w-[500px]">
                    <h1 className="text-[23px]">Login</h1>
                    <div className="flex items-center">
                        <p className="text-[15px]">Hi, Welcome back</p>
                        <WavingHand />
                    </div>
                    <form className="mt-5" onSubmit={handleSubmit}>
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
                        <Link href='/forgetpassword' className="text-[#5A56EA]">Forgot password?</Link>
                        <button
                            disabled={status}
                            type="submit"
                            className={`flex flex-row gap-1 items-center justify-center w-full my-5 py-2 rounded  ${status
                                ? "cursor-not-allowed bg-gray-400 text-white"
                                : "cursor-pointer bg-[#5A56EA] text-[#ffffff] hover:bg-[#0B0C44] transition-all duration-500 ease-in-out"}`}>
                            {status && <ClipLoader size={20} color="#ffffff" />}Login
                        </button>
                    </form>
                    <p className="text-center">Dont have an account? <Link className="text-[#5A56EA]" href='/signup'>Sign Up</Link></p>
                </div>
            </div>
        </div>
    )
}