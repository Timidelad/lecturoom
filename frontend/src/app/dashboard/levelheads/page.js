"use client"
import { useFaculty } from "@/app/context/FacultyContext";
import { User, ShieldCheck, Layers, IdCard } from "lucide-react";
export default function LevelHeadsPage() {
    const { faculty } = useFaculty();
    const allLevelHeads = faculty.faculty.members.flatMap(
        (head) => head
    );
    // console.log(allLevelHeads)
    return (
        <div className="h-screen">
            <h2>All level heads</h2>
            <ul className="flex flex-row flex-wrap gap-4 my-3">
                {allLevelHeads.map(a => (
                    <li key={a._id} className="bg-white w-full lg:w-[48%] flex flex-col justify-center gap-2 border border-[#aca5a5] rounded-[10px] p-[10px] h-[150px] hover:bg-[#5b56ea54] transition-all duration-500 ease-in-out">
                        <div className="flex items-center"><User /><p>{a.fullname}</p></div>
                        <div className="flex items-center"><ShieldCheck /><p>{a.isAdmin ? "Faculty Admin" : "Class rep"}</p></div>
                        <div className="flex items-center"><Layers /><p>{a.level}</p></div>
                        <div className="flex items-center"><IdCard /><p>{a.matricNumber}</p></div>
                    </li>
                ))}
            </ul>
        </div>
    )
}