import AdminNavBar from "../components/AdminNavBar";
import SuperAdminProtectedRoute from "../routes/SuperAdminProtectedRoute";

export default function AdminLayout({ children }) {
    return (
        <SuperAdminProtectedRoute>
            <div className="lg:flex">
                <AdminNavBar />
                <main className="pt-[45px] lg:ml-[20%] px-[10px] lg:pt-[10px] lg:px-[64px] w-full h-full ">{children}</main>
            </div>
        </SuperAdminProtectedRoute>
    )
}