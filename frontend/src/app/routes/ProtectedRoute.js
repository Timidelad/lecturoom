"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BounceLoader } from "react-spinners";
import axios from "@/lib/axios";
import { useFaculty } from "../context/FacultyContext";

export default function ProtectedRoute({ children }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const { faculty, setFaculty } = useFaculty();

    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                router.push("/login");
                return;
            }

            try {
                const response = await axios.get("/authentication/verify-token", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (!response.data.valid) {
                    localStorage.removeItem("token");
                    router.push("/login");
                } else {
                    setLoading(false);
                    setFaculty((prev) => {
                        const newData = {
                            faculty: response.data.userFaculty,
                            isAdmin: response.data.userIsAdmin,
                            userId: response.data.userId
                        };
                        return JSON.stringify(prev) !== JSON.stringify(newData) ? newData : prev;
                    })
                    // setFaculty({
                    //     faculty: response.data.userFaculty,
                    //     isAdmin: response.data.userIsAdmin,
                    // })
                    // console.log(faculty)
                }
            } catch (err) {
                localStorage.removeItem("token");
                router.push("/login");
            }
        };
        verifyToken();
    }, [router, setFaculty])

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