"use client";
import { useState } from "react";
import emailjs from "emailjs-com";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";

export default function ContactForm() {
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });
    const [status, setStatus] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const sendEmail = (e) => {
        e.preventDefault();
        setStatus(true);

        emailjs
            .send(
                process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,  // Your Service ID
                process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID, // Your Template ID
                {
                    from_name: formData.name,
                    reply_to: formData.email,
                    message: formData.message,
                },
                process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY    // Your Public Key
            )
            .then(
                () => {
                    toast.success("Message sent successfully!");
                    setFormData({ name: "", email: "", message: "" });
                    setStatus(false)
                },
                (error) => {
                    // console.error(error);
                    toast.error("Failed to send message. Try again later.");
                    setStatus(false)
                }
            );
    };

    return (
        <form onSubmit={sendEmail} className="space-y-4 max-w-md mx-auto">
            <div>
                <label htmlFor="name" className="font-semibold">Your Name</label>
                <input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2 border border-[#bdbdbd] rounded focus:outline-none focus:ring-2 focus:ring-[#5A56EA]"
                    required
                />
            </div>
            <div>
                <label htmlFor="email" className="font-semibold">Your Email</label>
                <input
                    type="email"
                    name="email"
                    placeholder="youremail@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-2 border border-[#bdbdbd] rounded focus:outline-none focus:ring-2 focus:ring-[#5A56EA]"
                    required
                />
            </div>
            <div>
                <label htmlFor="email" className="font-semibold">Message</label>
                <textarea
                    name="message"
                    placeholder="Your Message"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full p-2 border border-[#bdbdbd] rounded focus:outline-none focus:ring-2 focus:ring-[#5A56EA]"
                    required
                />
            </div>
            <button
                disabled={status}
                type="submit"
                className={`flex flex-row gap-1 items-center justify-center w-full my-5 py-2 rounded  ${status
                    ? "cursor-not-allowed bg-gray-400 text-white"
                    : "cursor-pointer bg-[#5A56EA] text-[#ffffff] hover:bg-[#0B0C44] transition-all duration-500 ease-in-out"}`}>
                {status && <ClipLoader size={20} color="#ffffff" />}Send Message
            </button>
            {status && <p className="mt-2 text-sm">{status}</p>}
        </form>
    );
}