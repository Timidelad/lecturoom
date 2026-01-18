"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFaculty } from "../context/FacultyContext";
import { BounceLoader } from "react-spinners";

export default function AdminRoute({ children }) {
    const router = useRouter();
    const { faculty } = useFaculty();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!faculty.isAdmin) {
            router.replace("/dashboard")
        } else {
            setLoading(false)
        }
    }, [faculty.isAdmin])

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