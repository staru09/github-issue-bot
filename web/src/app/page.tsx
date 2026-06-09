import { FeaturesSection } from "@/components/home/FeaturesSection";
import { HeroSection } from "@/components/home/HeroSection";
import { HomeFooter } from "@/components/home/HomeFooter";
import { HowItWorks } from "@/components/home/HowItWorks";
import { UploadSection } from "@/components/home/UploadSection";
import { SiteHeader } from "@/components/SiteHeader";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <HowItWorks />
        <UploadSection />
        <HomeFooter />
      </main>
    </>
  );
}
