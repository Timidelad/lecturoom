"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BounceLoader } from "react-spinners";
import axios from "@/lib/axios";
import toast from "react-hot-toast";

export default function SuperAdminProtectedRoute({ children }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                router.push('/adminlogin')
            }

            try {
                const response = await axios.get("/authentication/verify-admin-token", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!response.data.valid) {
                    // toast.error("sorry you cannot login")
                    localStorage.removeItem("token");
                    router.push("/adminlogin")
                } else {
                    // toast.success("Login successful!");
                    setLoading(false)
                }
            } catch (error) {
                localStorage.removeItem("token");
                router.push("/adminlogin");
            }
        };
        verifyToken();
    }, [router])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                {/* <div className="spinner"></div> */}
                <BounceLoader color="#5A56EA" size={80} />
            </div>
        )
    }

    return <>{children}</>
}