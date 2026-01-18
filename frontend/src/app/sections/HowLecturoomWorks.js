// export default function HowLecturoomWorks() {
//     return (
//         <section className="bg-[#030434] mt-[100px] py-[50px] px-[8px] lg:px-[25%] ">
//             <h2 className="text-[25px] font-bold text-[#FFFFFF] text-center pb-3">How Lecturoom works</h2>
//             <div className="grid grid-cols-1 gap-y-4 lg:grid-cols-2 justify-items-center">
//                 <div className="bg-[#0B0C44] p-4 h-[250px] lg:w-[320px] rounded-[20px]">
//                     <div className="pt-2 flex items-center justify-center w-12 h-12 rounded-full border-[#FFFFFF] text-[#FFFFFF] border-2">
//                         1
//                     </div>
//                     <h2 className="pt-2 text-[18px] lg:text-[20px] font-medium text-[#FFFFFF]">Faculty Admin Registers</h2>
//                     <p className="pt-2 text-[15px] font-normal text-[#A7ABDF]">A faculty admin creates an account, selects their faculty and sets up their booking environment.</p>
//                 </div>
//                 <div className="bg-[#0B0C44] p-4 h-[250px]  lg:w-[320px] rounded-[20px]">
//                     <div className="pt-2 flex items-center justify-center w-12 h-12 rounded-full border-[#FFFFFF] text-[#FFFFFF] border-2">
//                         2
//                     </div>
//                     <h2 className="pt-2 text-[18px] lg:text-[20px] font-medium text-[#FFFFFF]">Set Up Classrooms & Invite Level Heads</h2>
//                     <p className="pt-2 text-[15px] font-normal text-[#A7ABDF]">Faculty admin upload all the images and descriptions of the lecture room in the faculty and invites all the class representatives of each department in the faculty.</p>
//                 </div>
//                 <div className="bg-[#0B0C44] p-4 h-[250px]  lg:w-[320px] rounded-[20px]">
//                     <div className="pt-2 flex items-center justify-center w-12 h-12 rounded-full border-[#FFFFFF] text-[#FFFFFF] border-2">
//                         3
//                     </div>
//                     <h2 className="pt-2 text-[18px] lg:text-[20px] font-medium text-[#FFFFFF]">Level Heads Book Classrooms</h2>
//                     <p className="pt-2 text-[15px] font-normal text-[#A7ABDF]">Class representatives log in, select dates and times, and book available classroom for their lectures.</p>
//                 </div>
//                 <div className="bg-[#0B0C44] p-4 h-[250px]  lg:w-[320px] rounded-[20px]">
//                     <div className="pt-2 flex items-center justify-center w-12 h-12 rounded-full border-[#FFFFFF] text-[#FFFFFF] border-2">
//                         4
//                     </div>
//                     <h2 className="pt-2 text-[18px] lg:text-[20px] font-medium text-[#FFFFFF]">Everyone Stays Informed</h2>
//                     <p className="pt-2 text-[15px] font-normal text-[#A7ABDF]">Everyone get a calendar view of all bookings. Everyone have access to a link where they can see their class and other classes in the faculty.</p>
//                 </div>
//             </div>
//         </section>
//     )
// }

export default function HowLecturoomWorks() {
    return (
        <section className="bg-[#030434] mt-[70px] py-[50px] px-[8px] lg:px-[10%]">
            <h2 className="text-[25px] font-bold text-[#FFFFFF] text-center pb-3 leading-[1]">How Lecturoom Works</h2>
            <div className="flex flex-row flex-wrap space-y-4 gap-4">
                <div className="w-full lg:w-[48%] bg-[#0B0C44] p-4 h-[200px] rounded-[20px] flex items-center">
                    <div>
                        <div className="pt-2 flex items-center justify-center w-12 h-12 rounded-full border-[#FFFFFF] text-[#FFFFFF] border-2">1</div>
                        <h2 className="pt-2 text-[18px] lg:text-[20px] font-medium text-[#FFFFFF]">Faculty Admin Registers</h2>
                        <p className="pt-2 text-[15px] font-normal text-[#A7ABDF]">A faculty admin creates an account, input the faculty name and automatically creates the booking environment.</p>
                    </div>
                </div>
                <div className="w-full lg:w-[48%] bg-[#0B0C44] p-4 h-[200px] rounded-[20px] flex items-center">
                    <div>
                        <div className="pt-2 flex items-center justify-center w-12 h-12 rounded-full border-[#FFFFFF] text-[#FFFFFF] border-2">2</div>
                        <h2 className="pt-2 text-[18px] lg:text-[20px] font-medium text-[#FFFFFF]">Set Up lecture rooms & Invite class reps</h2>
                        <p className="pt-2 text-[15px] font-normal text-[#A7ABDF]">Faculty admin upload all the images and descriptions of the lecture rooms within the faculty and send an invite to all class representatives within the faculty.</p>
                    </div>
                </div>
                <div className="w-full lg:w-[48%] bg-[#0B0C44] p-4 h-[200px] rounded-[20px] flex items-center">
                    <div>
                        <div className="pt-2 flex items-center justify-center w-12 h-12 rounded-full border-[#FFFFFF] text-[#FFFFFF] border-2">3</div>
                        <h2 className="pt-2 text-[18px] lg:text-[20px] font-medium text-[#FFFFFF]">Class reps books lecture room</h2>
                        <p className="pt-2 text-[15px] font-normal text-[#A7ABDF]">Class rep logs in, select lecture room, select date, time and check if the the lecture room is available, then proceed to booking</p>
                    </div>
                </div>
                <div className="w-full lg:w-[48%] bg-[#0B0C44] p-4 h-[200px] rounded-[20px] flex items-center">
                    <div>
                        <div className="pt-2 flex items-center justify-center w-12 h-12 rounded-full border-[#FFFFFF] text-[#FFFFFF] border-2">4</div>
                        <h2 className="pt-2 text-[18px] lg:text-[20px] font-medium text-[#FFFFFF]">Everyone Stays Informed</h2>
                        <p className="pt-2 text-[15px] font-normal text-[#A7ABDF]">All the verified class representatives within the faculty environment can view all the bookings made and see which booking was cancelled or confirmed.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}