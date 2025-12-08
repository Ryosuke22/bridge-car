import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Car, Bike, Gauge } from "lucide-react";

interface PriceData {
  model_name: string;
  min_price: number;
  max_price: number;
}

const SpeedometerSimulator = () => {
  const [vehicleType, setVehicleType] = useState<"car" | "bike">("car");
  const [models, setModels] = useState<PriceData[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [priceData, setPriceData] = useState<PriceData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [needleRotation, setNeedleRotation] = useState(-135);

  useEffect(() => {
    fetchModels();
  }, [vehicleType]);

  useEffect(() => {
    if (selectedModel) {
      const model = models.find(m => m.model_name === selectedModel);
      if (model) {
        setPriceData(model);
        // Calculate needle rotation based on average price (max 2M for full scale)
        const avgPrice = (model.min_price + model.max_price) / 2;
        const rotation = Math.min((avgPrice / 2000000) * 270 - 135, 135);
        setNeedleRotation(rotation);
      }
    }
  }, [selectedModel, models]);

  const fetchModels = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("price_master")
      .select("model_name, min_price, max_price")
      .eq("vehicle_type", vehicleType);

    if (!error && data) {
      setModels(data);
    }
    setIsLoading(false);
    setSelectedModel("");
    setPriceData(null);
    setNeedleRotation(-135);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ja-JP").format(price);
  };

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background to-card" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            PRICE SIMULATOR
          </span>
          <h2 className="font-display text-4xl md:text-6xl mb-4">
            <span className="text-gradient">簡易査定</span>シミュレーター
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            車種を選んで、輸出相場の目安をチェック！
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="p-8 rounded-3xl bg-card border border-border/50 shadow-2xl">
            {/* Vehicle Type Tabs */}
            <Tabs value={vehicleType} onValueChange={(v) => setVehicleType(v as "car" | "bike")} className="mb-8">
              <TabsList className="grid w-full grid-cols-2 h-14 bg-secondary/50">
                <TabsTrigger value="car" className="flex items-center gap-2 font-display text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Car className="w-5 h-5" />
                  自動車
                </TabsTrigger>
                <TabsTrigger value="bike" className="flex items-center gap-2 font-display text-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Bike className="w-5 h-5" />
                  バイク
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Model Select */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                車種を選択
              </label>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="h-14 text-lg bg-secondary/30 border-border/50">
                  <SelectValue placeholder="車種を選んでください" />
                </SelectTrigger>
                <SelectContent>
                  {models.map((model) => (
                    <SelectItem key={model.model_name} value={model.model_name}>
                      {model.model_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Speedometer Display */}
            <div className="flex flex-col items-center">
              <div className="relative w-64 h-32 mb-6">
                {/* Speedometer Arc */}
                <div className="absolute inset-0">
                  <svg viewBox="0 0 200 100" className="w-full h-full">
                    {/* Background arc */}
                    <path
                      d="M 20 90 A 80 80 0 0 1 180 90"
                      fill="none"
                      stroke="hsl(var(--muted))"
                      strokeWidth="12"
                      strokeLinecap="round"
                    />
                    {/* Colored arc */}
                    <defs>
                      <linearGradient id="speedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="hsl(var(--muted))" />
                        <stop offset="50%" stopColor="hsl(var(--primary))" />
                        <stop offset="100%" stopColor="hsl(var(--accent))" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 20 90 A 80 80 0 0 1 180 90"
                      fill="none"
                      stroke="url(#speedGradient)"
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeDasharray={priceData ? `${((priceData.min_price + priceData.max_price) / 4000000) * 250} 250` : "0 250"}
                      style={{ transition: "stroke-dasharray 1s ease-out" }}
                    />
                    {/* Needle */}
                    <g 
                      style={{ 
                        transform: `rotate(${needleRotation}deg)`,
                        transformOrigin: "100px 90px",
                        transition: "transform 1s ease-out"
                      }}
                    >
                      <line
                        x1="100"
                        y1="90"
                        x2="100"
                        y2="25"
                        stroke="hsl(var(--foreground))"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                      <circle cx="100" cy="90" r="8" fill="hsl(var(--primary))" />
                    </g>
                  </svg>
                </div>
                
                {/* Center icon */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Gauge className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </div>

              {/* Price Display */}
              {priceData ? (
                <div className="text-center animate-scale-in">
                  <p className="text-muted-foreground mb-2">輸出/マニア向け相場目安</p>
                  <div className="font-display text-4xl md:text-5xl text-gradient">
                    ¥{formatPrice(priceData.min_price)} 〜 ¥{formatPrice(priceData.max_price)}
                  </div>
                  <p className="text-sm text-primary mt-3 flex items-center justify-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    状態やカスタムによってはさらにプラス査定！
                  </p>
                </div>
              ) : selectedModel === "" ? (
                <div className="text-center text-muted-foreground">
                  <p>車種を選択すると相場が表示されます</p>
                </div>
              ) : (
                <div className="text-center animate-pulse">
                  <p className="text-primary font-medium">データ照会中...</p>
                  <p className="text-sm text-muted-foreground mt-1">高価買取の可能性があります！</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpeedometerSimulator;
