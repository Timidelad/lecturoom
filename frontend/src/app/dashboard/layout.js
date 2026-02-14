import DashboardNavbar from "../components/DashboardNavbar";

export default function DashboardLayout({ children }) {
    return (
        <div className="flex min-h-screen">
            <DashboardNavbar />
            <div className="bg-[#f8fafc] flex-1 min-h-screen lg:ml-[16%]">{children}</div>
        </div>
    )
}