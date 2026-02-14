"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavLink({ href, children, onClick }) {
    const pathname = usePathname();

    const isActive = pathname.startsWith(href) && href !== '/dashboard';

    const isDashboard = href === '/dashboard' && pathname === '/dashboard'
    return (
        <Link
            onClick={onClick}
            href={href}
            className={` flex gap-x-2 items-center w-[160px] rounded-[10px] px-[10px] py-[6px] transition 
                ${(isActive || isDashboard)
                    ? 'text-[#136dec] bg-[#e7f0fd]' : ' hover:text-[#136dec] hover:bg-[#e7f0fd] transition-all duration-500 ease-in-out'
                }
                `}
        >
            {children}
        </Link>
    )
}