"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Upload,
    School,
    User,
    UserPlus,
    Menu,
    X,
    CalendarPlus,
    CalendarRange,
    MessageSquare
} from "lucide-react";
import NavLink from "./NavLink";
import { useFaculty } from "../context/FacultyContext";

export default function DashboardPage() {
    let [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const logout = () => {
        localStorage.clear();
        router.replace("/");
    };

    return (
        <>
            {/* large screen nav bar */}
            <nav className="hidden lg:fixed lg:top-0 lg:left-0 lg:h-screen lg:w-[20%] lg:bg-white lg:flex lg:flex-col lg:items-center lg:py-5 shadow-md justify-between">
                <div className="flex flex-col justify-center items-center">
                    <p className="text-[#5A56EA] text-center">
                        Welcome to the faculty of {faculty.faculty.name}
                    </p>
                </div>
                <div className="inline-flex flex-col gap-4 items-start">
                    <NavLink href="/dashboard">
                        <LayoutDashboard />
                        Dashboard
                    </NavLink>
                    {faculty.isAdmin && (
                        <NavLink href="/dashboard/invite">
                            <UserPlus />
                            Invite
                        </NavLink>
                    )}
                    <NavLink href="/dashboard/lecturerooms">
                        <School />
                        Lecture Rooms
                    </NavLink>
                    <NavLink href="/dashboard/levelheads">
                        <User />
                        Level Heads
                    </NavLink>
                    <NavLink href="/dashboard/allbookings">
                        <CalendarRange />
                        All bookings
                    </NavLink>
                    <NavLink href="/dashboard/mybookings">
                        <CalendarPlus />
                        My bookings
                    </NavLink>
                    {faculty.isAdmin && (
                        <NavLink href="/dashboard/upload">
                            <Upload />
                            Upload
                        </NavLink>
                    )}
                    <NavLink href="/dashboard/feedback">
                        <MessageSquare />
                        Feedback
                    </NavLink>
                </div>
                <button
                    onClick={logout}
                    className="bg-[#5A56EA] text-white text-[17px] rounded-[10px] px-[50px] py-[10px] hover:bg-[#0B0C44] transition-all duration-500 ease-in-out"
                >
                    Log Out
                </button>
            </nav>

            {/* small screen nav bar */}
            <nav className="lg:hidden flex bg-white justify-between items-center p-[8px] h-[45px] fixed top-0 left-0 w-full shadow-md">
                <div>Lecturoom</div>
                <button onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X className="text-[#5A56EA]" /> : <Menu className="text-[#5A56EA]" />}
                </button>
            </nav>

            {/* small screen navbar open */}
            {isOpen && (
                <nav className="bg-white fixed top-0 left-0 h-screen w-[70%] flex flex-col items-center py-10 shadow-md justify-between">
                    <div className="flex flex-col justify-center items-center">
                        <p className="text-[#5A56EA] text-center">
                            Welcome to the faculty of {faculty.faculty.name}
                        </p>
                    </div>
                    <div className="inline-flex flex-col gap-4 items-start">
                        <NavLink href="/dashboard" onClick={() => setIsOpen(!isOpen)}>
                            <LayoutDashboard />
                            Dashboard
                        </NavLink>
                        {faculty.isAdmin && (
                            <NavLink href="/dashboard/invite" onClick={() => setIsOpen(!isOpen)}>
                                <UserPlus />
                                Invite
                            </NavLink>
                        )}
                        <NavLink href="/dashboard/lecturerooms" onClick={() => setIsOpen(!isOpen)}>
                            <School />
                            Lecture Rooms
                        </NavLink>
                        <NavLink href="/dashboard/levelheads" onClick={() => setIsOpen(!isOpen)}>
                            <User />
                            Level Heads
                        </NavLink>
                        <NavLink href="/dashboard/allbookings" onClick={() => setIsOpen(!isOpen)}>
                            <CalendarRange />
                            All bookings
                        </NavLink>
                        <NavLink href="/dashboard/mybookings" onClick={() => setIsOpen(!isOpen)}>
                            <CalendarPlus />
                            My bookings
                        </NavLink>
                        {faculty.isAdmin && (
                            <NavLink href="/dashboard/upload" onClick={() => setIsOpen(!isOpen)}>
                                <Upload />
                                Upload
                            </NavLink>
                        )}
                        <NavLink href="/dashboard/feedback" onClick={() => setIsOpen(!isOpen)}>
                            <MessageSquare />
                            Feedback
                        </NavLink>
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
    );
}
