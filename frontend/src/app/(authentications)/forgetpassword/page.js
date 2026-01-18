"use client";

import { useState } from "react";
import axios from "@/lib/axios";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";

export default function ForgetPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)

        try {
            let response = await axios.post("/authentication/forgetpassword", { email });
            if (response.status === 200) {
                toast.success("Password reset link sent to your email");
                setEmail("");
                setLoading(false)
            }
        } catch (error) {
            if (error.status === 400) {
                toast.error("Email not found");
                setLoading(false)
            } else {
                toast.error("Something went wrong, please try again");
                setLoading(false)
            }
        }
        setLoading(false)
    }

    const handleChange = (e) => {
        setEmail(e.target.value)
    }

    return (
        <div>
            <div className="pl-[6px] text-[25px] font-bold lg:pl-[64px]">Lecturoom</div>
            <hr />
            <div className="mt-[20px] mx-[8px] lg:w-full lg:mx-0 lg:flex lg:items-center lg:justify-center">
                <div className="lg:w-[500px]">
                    <h1 className="text-[23px]">Reset Password</h1>
                    <p>Enter your email to reset your password</p>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="email" className="block mb-1 font-medium">Your Email</label>
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={handleChange}
                            className="w-full border p-2 rounded border-[#bdbdbd] focus:outline-none focus:ring-2 focus:ring-[#5A56EA]"
                            placeholder="timilehin@gmail.com"
                            required
                        />
                        <button
                            disabled={loading}
                            type="submit"
                            className={`flex flex-row gap-1 items-center justify-center w-full my-5 py-2 rounded  ${loading
                                ? "cursor-not-allowed bg-gray-400 text-white"
                                : "cursor-pointer bg-[#5A56EA] text-[#ffffff] hover:bg-[#0B0C44] transition-all duration-500 ease-in-out"
                                }`}>
                            {loading && <ClipLoader size={20} color="#ffffff" />} Reset password
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}