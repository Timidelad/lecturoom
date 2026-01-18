"use client";

import { Suspense, useEffect, useState } from "react";
import axios from "@/lib/axios";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { BounceLoader, ClipLoader } from "react-spinners";

function CompleteRegistrationInner() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const [status, setStatus] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        fullname: "",
        phone: "",
        level: "",
        password: "",
    });

    const [readonlyData, setReadonlyData] = useState({
        email: "",
        matricNumber: "",
    });

    useEffect(() => {
        setLoading(true);
        if (!token) {
            toast.error("Invalid or expired token");
            router.replace("/");
            return;
        }
        const fetchData = async () => {
            try {
                const response = await axios.get(`/members/user-info?token=${token}`);
                if (response.status === 200) {
                    setReadonlyData({
                        email: response.data.email,
                        matricNumber: response.data.matricNumber,
                    });
                    setLoading(false);
                }
            } catch {
                toast.error("Invalid or expired token");
                router.replace("/");
            }
        };
        fetchData();
    }, [token, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <BounceLoader color="#5A56EA" size={80} />
            </div>
        );
    }

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus(true);
        try {
            const response = await axios.post("/members/complete-registration", {
                ...formData,
                token,
            });
            if (response.status === 200) {
                toast.success("Registration completed successfully");
                router.replace("/login");
            }
        } catch {
            toast.error("Something went wrong, please try again");
            setStatus(false);
        } finally {
            setStatus(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4 text-center">
                Complete Your Registration
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    name="email"
                    value={readonlyData.email}
                    readOnly
                    className="w-full border p-2 rounded bg-gray-100"
                />
                <input
                    name="matricNumber"
                    value={readonlyData.matricNumber}
                    readOnly
                    className="w-full border p-2 rounded bg-gray-100"
                />
                <input
                    name="fullname"
                    placeholder="Full Name"
                    required
                    onChange={handleChange}
                    className="w-full border p-2 rounded border-[#bdbdbd] focus:outline-none focus:ring-2 focus:ring-[#5A56EA]"
                />
                <input
                    name="phone"
                    placeholder="Phone Number"
                    required
                    onChange={handleChange}
                    className="w-full border p-2 rounded border-[#bdbdbd] focus:outline-none focus:ring-2 focus:ring-[#5A56EA]"
                />
                <input
                    name="level"
                    placeholder="Level (e.g., 300)"
                    required
                    onChange={handleChange}
                    className="w-full border p-2 rounded border-[#bdbdbd] focus:outline-none focus:ring-2 focus:ring-[#5A56EA]"
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Create Password"
                    required
                    onChange={handleChange}
                    className="w-full border p-2 rounded border-[#bdbdbd] focus:outline-none focus:ring-2 focus:ring-[#5A56EA]"
                />
                <button
                    disabled={status}
                    type="submit"
                    className={`flex flex-row gap-1 items-center justify-center w-full my-5 py-2 rounded ${status
                        ? "cursor-not-allowed bg-gray-400 text-white"
                        : "cursor-pointer bg-[#5A56EA] text-[#ffffff] hover:bg-[#0B0C44] transition-all duration-500 ease-in-out"
                        }`}
                >
                    {status && <ClipLoader size={20} color="#ffffff" />}Complete Setup
                </button>
            </form>
        </div>
    );
}

export default function CompleteRegistrationPage() {
    return (
        <Suspense fallback={<BounceLoader color="#5A56EA" size={80} />}>
            <CompleteRegistrationInner />
        </Suspense>
    );
}
