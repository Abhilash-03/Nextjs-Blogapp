import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import ShowcaseSection from "@/components/home/ShowcaseSection";
import CTASection from "@/components/home/CTASection";

export default async function Home() {
  const session = await getServerSession(authOptions);
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background patterns */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />
      
      <HeroSection session={session} />
      <FeaturesSection />
      <ShowcaseSection />
      <CTASection session={session} />
    </div>
  );
}
