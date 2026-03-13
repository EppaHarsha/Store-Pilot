import React from "react";
import HeroSection from "./HeroSection.jsx";
import FeaturesSection from "./FeaturesSection.jsx";
import HowItWorksSection from "./HowItWorksSection.jsx";
import PreviewSection from "./PreviewSection.jsx";
import CtaSection from "./CtaSection.jsx";
import FooterSection from "./FooterSection.jsx";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PreviewSection />
      <CtaSection />
      <FooterSection />
    </div>
  );
};

export default LandingPage;

