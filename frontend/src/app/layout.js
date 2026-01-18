import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: "LECTUROOM | Smart Lecture Room Booking for your faculty",
  description: "LECTUROOM is a solution-based web application that helps university faculties effortlessly book, manage, and track lecture rooms. It streamlines scheduling, prevents conflicts, and saves time for students and lecturers.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* className={`${inter.variable} font-inter`} */}
      <body suppressHydrationWarning={true}>
        {children}
        <Toaster position="top-right" reverseOrder={false} />
      </body>
    </html>
  );
}
