"use client"

import { useRouter } from "next/navigation";
import axios from "@/lib/axios";
import { useEffect, } from "react";
import { useFacultyContext } from "../context/FacultyContext";

export default function ProtectedRoute({ children }) {
    const { faculty, setFaculty } = useFacultyContext();
    const router = useRouter();

    useEffect(() => {
        const verifyToken = async () => {
            const response = await axios.post("/verifyToken");
            if (response.data.success === true) {
                setFaculty(response.data.faculty);
            } else {
                router.replace('/login')
            }
        };
        verifyToken();
    }, [router])

    return <>{children}</>
}