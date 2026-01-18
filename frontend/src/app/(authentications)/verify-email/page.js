"use client"

import { useEffect, useState, Suspense } from "react"
import axios from "@/lib/axios";
import { useSearchParams, useRouter } from "next/navigation";

function EmailverificationInner() {
    const searchParams = useSearchParams();
    const [message, setMessage] = useState("verifying...");
    const router = useRouter();
    const token = searchParams.get('token');

    useEffect(() => {
        if (!token) {
            setMessage('Invalid Verification link')
            return;
        }

        const verifyEmail = async () => {
            try {
                const response = await axios.get(`/authentication/verify-email?token=${token}`);
                if (response.status === 200) {
                    setMessage("Email verified successfully! You can now log in")
                    router.push("/login")
                }
            } catch (error) {
                if (error.status === 400) {
                    setMessage("Invalid or expired token")
                } else {
                    setMessage("something went wrong")
                }
            }
        };
        verifyEmail()
    }, [token, router])
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow text-center">
                <h1 className="text-2xl font-semibold mb-4">
                    <p>{message}</p>
                </h1>
            </div>
        </div>
    )
}

export default function EmailVerification() {
    return (
        <Suspense>
            <EmailverificationInner />
        </Suspense>
    )
}