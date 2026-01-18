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
            className={` flex gap-x-2 items-center border-[1px] w-[160px] rounded-[10px] px-[10px] py-[6px] transition 
                ${(isActive || isDashboard)
                    ? 'text-[#5A56EA] border-[#5A56EA] bg-[#ffffff]' : 'border-[#c0bcc4] hover:text-[#5A56EA] hover:border-[#5A56EA] text-gray-600 hover:bg-[#ffffff] transition-all duration-500 ease-in-out'
                }
                `}
        >
            {children}
        </Link>
    )
}