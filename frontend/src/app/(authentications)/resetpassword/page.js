"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "@/lib/axios";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";

function ResetPasswordInner() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!token) {
            router.replace("/");
        }
    }, [token, router]);

    const handleChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post("/authentication/resetpassword", {
                password,
                token,
            });

            if (response.status === 200) {
                setLoading(false);
                setPassword("");
                toast.success("Password reset successful");
                router.replace("/login");
            }
        } catch (error) {
            setLoading(false);
            if (error.response === 400) {
                toast.error("Unable to reset password");
                router.replace("/forgotpassword");
            } else {
                toast.error("Password reset failed");
                router.replace("/forgotpassword");
            }
        }
    };

    return (
        <div>
            <div className="pl-[6px] text-[25px] font-bold lg:pl-[64px]">Lecturoom</div>
            <hr />
            <div className="mt-[20px] mx-[8px] lg:w-full lg:mx-0 lg:flex lg:items-center lg:justify-center">
                <div className="lg:w-[500px]">
                    <p className="text-[23px]">Enter your new password</p>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="password" className="block mb-1 font-medium">
                            Your new password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={handleChange}
                            className="w-full border border-[#bdbdbd] p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#5A56EA]"
                            placeholder="*********"
                            required
                        />
                        <button
                            disabled={loading}
                            type="submit"
                            className={`flex flex-row gap-1 items-center justify-center w-full my-5 py-2 rounded ${loading
                                ? "cursor-not-allowed bg-gray-400 text-white"
                                : "cursor-pointer bg-[#5A56EA] text-[#ffffff] hover:bg-[#0B0C44] transition-all duration-500 ease-in-out"
                                }`}
                        >
                            {loading && <ClipLoader size={20} color="#ffffff" />} Reset password
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<ClipLoader />}>
            <ResetPasswordInner />
        </Suspense>
    );
}
