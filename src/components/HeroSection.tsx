import { Button } from "@/components/ui/button";
import { Car, Bike, ArrowDown } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

interface HeroSectionProps {
  onScrollToForm: () => void;
}

const HeroSection = ({ onScrollToForm }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        <div className="absolute inset-0 garage-pattern opacity-30" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8 animate-slide-up">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-sm">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-sm font-medium text-primary">輸出専門の高価買取</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-tight">
            <span className="text-foreground">その車、海外なら</span>
            <br />
            <span className="text-gradient">もっと高く売れます</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            他社で0円の愛車・バイク、諦めないでください。
            <br className="hidden md:block" />
            過走行車・低年式車・カスタムバイクを適正価格で買取
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button 
              variant="hero" 
              size="xl"
              onClick={onScrollToForm}
              className="group"
            >
              <Car className="w-5 h-5 group-hover:scale-110 transition-transform" />
              車の査定を申し込む
            </Button>
            <Button 
              variant="heroOutline" 
              size="xl"
              onClick={onScrollToForm}
              className="group"
            >
              <Bike className="w-5 h-5 group-hover:scale-110 transition-transform" />
              バイクの査定を申し込む
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-8 pt-8 text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-display text-primary">10万km+</span>
              <span className="text-sm">過走行車OK</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-display text-primary">15年落ち</span>
              <span className="text-sm">低年式OK</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-display text-primary">事故現状</span>
              <span className="text-sm">対応可能</span>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <button 
            onClick={onScrollToForm}
            className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <span className="text-xs uppercase tracking-widest">Scroll</span>
            <ArrowDown className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
