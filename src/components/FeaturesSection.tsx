import { Ship, Wrench, TrendingUp, Globe, Shield, Clock } from "lucide-react";

const features = [
  {
    icon: Ship,
    title: "直輸出ルート",
    description: "中間業者を挟まず、海外バイヤーへ直接販売。だから高価買取が可能です。",
  },
  {
    icon: Globe,
    title: "世界中のバイヤー",
    description: "アフリカ、中東、東南アジアなど、日本車を求める市場へ直接アプローチ。",
  },
  {
    icon: TrendingUp,
    title: "2000年以降の車両",
    description: "買取対象は2000年以降に生産された車両・バイクです。輸出需要の高い年式を中心に高価買取。",
  },
  {
    icon: Wrench,
    title: "カスタムプラス査定",
    description: "カスタムパーツも適正評価。他店では評価されない改造車も大歓迎。",
  },
  {
    icon: Shield,
    title: "不動車も買取OK",
    description: "エンジンがかからない不動車も買取対象。状態問わずまずはご相談ください。",
  },
  {
    icon: Clock,
    title: "最短即日査定",
    description: "お申し込みから最短即日で査定額をご提示。スピード対応をお約束。",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-card relative overflow-hidden">
      <div className="absolute inset-0 garage-pattern opacity-10" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            WHY CHOOSE US
          </span>
          <h2 className="font-display text-4xl md:text-6xl mb-4">
            なぜ<span className="text-gradient">高く買える</span>のか？
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            私たちには海外への直輸出ルートがあります。
            だから、国内相場に縛られない適正価格で買取できるのです。
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="group p-6 rounded-2xl bg-gradient-to-b from-secondary/50 to-secondary/20 border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display text-2xl mb-2 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
