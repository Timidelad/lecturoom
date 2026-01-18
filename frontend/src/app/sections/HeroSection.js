import Link from "next/link";
export default function Herosection() {
    return (
        <section className="mt-[100px]">
            <h1 className="text-[#030434] text-[35px] font-bold text-center leading-[1]">Book Lecture Rooms Smarter</h1>
            <p className="text-[16pxpx] font-normal text-center leading-[1] px-[10px] mt-2">No more confusion, clashing timetables, or class cancellations. Give your faculty the system it deserves.</p>
            <div className="flex justify-center mt-6">
                <Link href='/signup' className="text-[#FFFFFF] bg-[#5A56EA] px-[15px] py-[10px] rounded-[20px]  hover:bg-[#0B0C44] transition-all duration-500 ease-in-out">Register Your Faculty</Link>
            </div>
        </section>
    );
}