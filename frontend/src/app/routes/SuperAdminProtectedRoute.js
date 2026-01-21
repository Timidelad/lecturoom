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

            try {
                const response = await axios.post("/verifyAdmin");
                console.log(response)

                if (response.data.success === false) {
                    router.push("/adminlogin")
                } else {
                    // toast.success("Login successful!");
                    setLoading(false)
                }
            } catch (error) {
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