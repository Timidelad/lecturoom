"use client"
import { LayoutDashboard, CalendarDays, Landmark, Users, Settings } from 'lucide-react';
import NavLink from './NavLink';
export default function DashboardNavbar() {
    return (
        <nav className="w-[15%] bg-white flex flex-col gap-6 shadow-2xl fixed top-0 left-0 h-screen">
            <div>Lecturoom</div>
            <div className="hidden lg:flex flex-col gap-1 items-start">
                <NavLink href="/dashboard" className=' flex flex-row gap-1'><LayoutDashboard />Dashboard</NavLink>
                <NavLink href="/dashboard/bookings" className='flex flex-row gap-1'><CalendarDays />Bookings</NavLink>
                <NavLink href="/dashboard/rooms" className='flex flex-row gap-1'><Landmark />Rooms</NavLink>
                <NavLink href="/dashboard/members" className='flex flex-row gap-1'><Users />Members</NavLink>
                <NavLink href="/dashboard/settings" className='flex flex-row gap-1'><Settings />Settings</NavLink>
            </div>
        </nav>
    )
}