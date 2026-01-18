import Link from "next/link";
export default function NavBarHomePage() {
    return (
        <nav className="mt-3 flex items-center justify-between px-[8px] lg:px-[128px]">
            <p className="text-[22px] lg:text-[30px] font-bold text-[#5A56EA]">Lecturoom</p>
            <div className="flex gap-x-6">
                <Link href='/signup' className="bg-[#5A56EA] text-[#ffffff] px-[7px] lg:px-[15px] py-[5px] rounded-[20px] hover:bg-[#0B0C44] transition-all duration-500 ease-in-out">Sign Up</Link>
                <Link href='/login' className="text-[#5A56EA] rounded-[20px] px-[7px] lg:px-[15px] py-[5px] border-[#5A56EA] border-[2px] hover:text-[#ffffff] hover:bg-[#5A56EA] transition-all duration-500 ease-in-out ">Login</Link>
            </div>
        </nav>
    )
}