import ContactForm from "@/app/components/ContactForm";

export default function Feedback() {
    return (
        <div className="h-screen">
            <h1 className="text-center text-[20px] text-[#5A56EA] font-medium">We Value Your Feedback!</h1>
            <h2 className="text-center text-[#575656]">Share your thoughts and help us create a smoother, smarter lecture room booking system.</h2>
            <ContactForm />
        </div>
    )
}