"use client"

import React, { useState } from 'react'
import axios from '@/lib/axios'
import { toast } from 'react-hot-toast'
import Link from "next/link";
import { ClipLoader } from "react-spinners";

export default function SignupPage() {
    const [message, setMessage] = useState("");
    const [responseStatus, setResponseStatus] = useState(false);
    const [status, setStatus] = useState(false);
    const [formData, setFormData] = useState({
        fullname: "",
        matricNumber: "",
        institutionName: "",
        level: "",
        facultyName: "",
        phone: "",
        email: "",
        password: ""
    });

    // handle the form changes
    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    };

    // handle the form when submitted
    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus(true);

        try {
            const response = await axios.post("/authentication/signup", formData);

            // Clear form only if signup is successful
            if (response.data.success) {
                setStatus(false);
                setResponseStatus(true);
                setMessage(response.data.message);
                setFormData({
                    fullname: "",
                    matricNumber: "",
                    institutionName: "",
                    level: "",
                    facultyName: "",
                    phone: "",
                    email: "",
                    password: "",
                });
            } else {
                setMessage(response.data.message || "Signup failed");
                setStatus(false);
            }

            setResponseStatus(true);
        } catch (error) {
            setResponseStatus(true);
            setMessage(error.response.data.message);
        }
        setStatus(false)
    };

    return (
        <div>
            <div className="pl-[6px] text-[25px] font-bold lg:pl-[64px]">Lecturoom</div>
            <hr />
            {/* {formData.fullname} */}
            <h1 className="text-[23px] lg:ml-[20%] mt-[20px]">Sign Up</h1>
            <p className="text-[13px] lg:ml-[20%]">Register as your faculty admin</p>
            <form onSubmit={handleSubmit} className="mx-[8px] lg:mx-[20%] mt-[30px]">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="w-full">
                        <label htmlFor="fullname">Fullname</label>
                        <input
                            name="fullname"
                            placeholder="Timi Delad"
                            onChange={handleChange}
                            value={formData.fullname}
                            className="w-full p-2 border border-[#bdbdbd] rounded focus:outline-none focus:ring-2 focus:ring-[#5A56EA]"
                            required
                        />
                    </div>
                    <div className="w-full">
                        <label htmlFor="matricNumber">Matric Number</label>
                        <input
                            name="matricNumber"
                            placeholder="CDS/2019/1010"
                            onChange={handleChange}
                            value={formData.matricNumber}
                            className="w-full p-2 border border-[#bdbdbd] rounded focus:outline-none focus:ring-2 focus:ring-[#5A56EA]"
                            required
                        />
                    </div>
                </div>
                <div className="flex flex-col lg:flex-row gap-4 mt-4">
                    <div className="w-full">
                        <label htmlFor="institutionName">Name of Institution</label>
                        <input
                            name="institutionName"
                            placeholder="Federal University Of Oye-Ekiti"
                            onChange={handleChange}
                            value={formData.institutionName}
                            className="w-full p-2 border border-[#bdbdbd] rounded focus:outline-none focus:ring-2 focus:ring-[#5A56EA]"
                            required
                        />
                    </div>
                    <div className="w-full">
                        <label htmlFor="yourLevel">Level</label>
                        <input
                            name="level"
                            placeholder="100"
                            onChange={handleChange}
                            value={formData.level}
                            className="w-full p-2 border border-[#bdbdbd] rounded focus:outline-none focus:ring-2 focus:ring-[#5A56EA]"
                            required
                        />
                    </div>
                </div>
                <div className="flex flex-col lg:flex-row gap-4 mt-4">
                    <div className="w-full">
                        <label htmlFor="yourFaculty">Faculty</label>
                        <input
                            name="facultyName"
                            placeholder="social science"
                            onChange={handleChange}
                            value={formData.facultyName}
                            className="w-full p-2 border border-[#bdbdbd] rounded focus:outline-none focus:ring-2 focus:ring-[#5A56EA]"
                            required
                        />
                    </div>
                    <div className="w-full">
                        <label htmlFor="phoneNumer">Phone number</label>
                        <input
                            name="phone"
                            type="tel"
                            placeholder="+2348097432389"
                            onChange={handleChange}
                            value={formData.phone}
                            className="w-full p-2 border border-[#bdbdbd] rounded focus:outline-none focus:ring-2 focus:ring-[#5A56EA]"
                            required
                        />
                    </div>
                </div>
                <div className="flex flex-col lg:flex-row gap-4 mt-4">
                    <div className="w-full">
                        <label htmlFor="email">Email</label>
                        <input
                            name="email"
                            type="email"
                            placeholder="timilehin@gmail.com"
                            onChange={handleChange}
                            value={formData.email}
                            className="w-full p-2 border border-[#bdbdbd] rounded focus:outline-none focus:ring-2 focus:ring-[#5A56EA]"
                            required
                        />
                    </div>
                    <div className="w-full">
                        <label htmlFor="password">Password</label>
                        <input
                            name="password"
                            type="password"
                            placeholder="your password"
                            onChange={handleChange}
                            value={formData.password}
                            className="w-full p-2 border border-[#bdbdbd] rounded focus:outline-none focus:ring-2 focus:ring-[#5A56EA]"
                            required
                        />
                    </div>
                </div>
                <button
                    disabled={status}
                    type="submit"
                    className={`flex flex-row gap-1 items-center justify-center w-full my-5 py-2 rounded  ${status
                        ? "cursor-not-allowed bg-gray-400 text-white"
                        : "cursor-pointer bg-[#5A56EA] text-[#ffffff] hover:bg-[#0B0C44] transition-all duration-500 ease-in-out"}`}>
                    {status && <ClipLoader size={20} color="#ffffff" />}Register
                </button>
            </form>
            {responseStatus && <div className="text-center text-[#5A56EA]">{message}</div>}
            <p className="text-center">Not on the access list? <Link className="text-[#5A56EA]" href='/access'>Join</Link></p>
        </div>
    )
}