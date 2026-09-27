import { SiteHeader } from "@/components/SiteHeader";
import { RecentAnalysis } from "@/components/RecentAnalysis";
import { HeroSection, StepsSection, FeaturesSection, FaqSection, SiteFooter } from "@/components/sections";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <HeroSection />
      <RecentAnalysis />
      <StepsSection />
      <FeaturesSection />
      <FaqSection />
      <SiteFooter />
    </div>
  );
}
