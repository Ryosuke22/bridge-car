import { useRef } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import WantedSection from "@/components/WantedSection";
import SpeedometerSimulator from "@/components/SpeedometerSimulator";
import AssessmentForm from "@/components/AssessmentForm";
import Footer from "@/components/Footer";
const Index = () => {
  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onScrollToForm={scrollToForm} />
      <main>
        <HeroSection onScrollToForm={scrollToForm} />
        <section id="features">
          <FeaturesSection />
        </section>
        <section id="wanted">
          <WantedSection />
        </section>
        <section id="simulator">
          <SpeedometerSimulator />
        </section>
        <AssessmentForm formRef={formRef} />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
