import DashboardPage from '../components/DashBoardSideBar'
import { FacultyProvider } from '../context/FacultyContext'
import ProtectedRoute from '../routes/ProtectedRoute'

export default function DashboardLayout({ children }) {
    return (
        <FacultyProvider>
            <ProtectedRoute>
                <div className="lg:flex">
                    <DashboardPage />
                    <main className="pt-[45px] lg:ml-[20%] px-[10px] lg:pt-[10px] lg:px-[64px] w-full h-full  bg-[#f8f8f8]">{children}</main>
                </div>
            </ProtectedRoute>
        </FacultyProvider>
    )
}