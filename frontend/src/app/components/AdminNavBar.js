"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
    LayoutDashboard, Upload, Menu,
    X,
} from "lucide-react";
import NavLink from "./NavLink";
import AdminNavLink from "./AdminNavLink";

export default function AdminNavBar() {
    const [isOpen, setIsOpen] = useState(false)
    const router = useRouter();

    const logout = () => {
        localStorage.removeItem("token");
        router.replace("/");
    };

    return (
        <>
            {/* large screen nav bar */}
            <nav className="hidden lg:fixed lg:top-0 lg:left-0 lg:h-screen lg:w-[20%] lg:bg-white lg:flex lg:flex-col lg:items-center lg:py-5 shadow-md justify-around">
                <div className="inline-flex flex-col gap-4 items-start">
                    <AdminNavLink href="/admindashboard">
                        <LayoutDashboard />
                        Dashboard
                    </AdminNavLink>
                    <AdminNavLink href="/admindashboard/waitlist">
                        <Upload />
                        Waitlist
                    </AdminNavLink>
                </div>

                <button
                    onClick={logout}
                    className="bg-[#5A56EA] text-white text-[17px] rounded-[10px] px-[50px] py-[10px] hover:bg-[#0B0C44] transition-all duration-500 ease-in-out"
                >
                    Log Out
                </button>
            </nav>

            {/* small screen nav */}
            <nav className="lg:hidden flex bg-white justify-between items-center p-[8px] h-[45px] fixed top-0 left-0 w-full shadow-md">
                <div>Lecturoom</div>
                <button onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X className="text-[#5A56EA]" /> : <Menu className="text-[#5A56EA]" />}
                </button>
            </nav>

            {/* small screej nav bar */}
            {isOpen && (
                <nav className="bg-white fixed top-0 left-0 h-screen w-[70%] flex flex-col items-center py-10 shadow-md justify-between">
                    <div className="inline-flex flex-col gap-4 items-start">
                        <AdminNavLink href="/admindashboard" onClick={() => setIsOpen(!isOpen)}>
                            <LayoutDashboard />
                            Dashboard
                        </AdminNavLink>
                        <AdminNavLink href="/admindashboard/waitlist" onClick={() => setIsOpen(!isOpen)}>
                            <Upload />
                            Waitlist
                        </AdminNavLink>
                    </div>
                    <button
                        onClick={logout}
                        className="bg-[#5A56EA] text-white text-[17px] rounded-[10px] px-[50px] py-[10px] hover:bg-[#0B0C44] transition-all duration-500 ease-in-out"
                    >
                        Log Out
                    </button>
                </nav>
            )}
        </>
    )
}