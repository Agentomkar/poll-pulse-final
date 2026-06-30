"use client";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import BloodInventory from "@/components/BloodInventory";
import DonorRegistration from "@/components/DonorRegistration";
import EmergencyRequests from "@/components/EmergencyRequests";
import DashboardPreview from "@/components/DashboardPreview";
import Features from "@/components/Features";
import TeamSection from "@/components/TeamSection";
import Testimonials from "@/components/Testimonials";
import ContactFooter from "@/components/ContactFooter";
import SectionDivider from "@/components/SectionDivider";
import AIChatbot from "@/components/AIChatbot";
import CustomCursor from "@/components/CustomCursor";
import PageTransition from "@/components/PageTransition";

// Lazy-load 3D background (heavy Three.js bundle)
const ThreeBackground = dynamic(
  () => import("@/components/ThreeBackground").then((mod) => mod.default),
  {
    ssr: false,
  }
);

export default function Home() {
  if (typeof window !== "undefined") {
    // Runtime check: log imported component types to help identify invalid imports
    // (will appear in the browser console)
    // eslint-disable-next-line no-console
    console.log("componentTypes", {
      NavbarType: Navbar,
      HeroType: Hero,
      BloodInventoryType: BloodInventory,
      DonorRegistrationType: DonorRegistration,
      EmergencyRequestsType: EmergencyRequests,
      DashboardPreviewType: DashboardPreview,
      FeaturesType: Features,
      TestimonialsType: Testimonials,
      ContactFooterType: ContactFooter,
      SectionDividerType: SectionDivider,
      AIChatbotType: AIChatbot,
      CustomCursorType: CustomCursor,
      PageTransitionType: PageTransition,
    });
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black">
      <ThreeBackground />

      <div className="relative z-20">
        <CustomCursor />
        <Navbar />
        <Hero />
        <SectionDivider />
        <BloodInventory />
        <SectionDivider />
        <DonorRegistration />
        <SectionDivider />
        <EmergencyRequests />
        <SectionDivider />
        <DashboardPreview />
        <SectionDivider />
        <Features />
        <SectionDivider />
        <TeamSection />
        <SectionDivider />
        <Testimonials />
        <SectionDivider />
        <ContactFooter />
        <PageTransition />
        <AIChatbot />
      </div>
    </main>
  );
}