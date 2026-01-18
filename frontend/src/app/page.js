import NavBarHomePage from "./components/NavBarHomePage";
import HeroSection from "./sections/HeroSection";
import HowLecturoomWorks from "./sections/HowLecturoomWorks";
import WhyYouNeedLecturoom from "./sections/WhyYouNeedLecturoom";

export default function Home() {
  return (
    <div className="">
      <NavBarHomePage />
      <HeroSection />
      <HowLecturoomWorks />
      <WhyYouNeedLecturoom />
    </div>
  );
}
