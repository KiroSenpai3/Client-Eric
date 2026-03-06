import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import { PlatformOverview, Services, HowItWorks, About, CTA } from "@/components/sections/Sections";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <PlatformOverview />
        <Services />
        <HowItWorks />
        <About />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
