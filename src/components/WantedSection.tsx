import { Car, Bike, Star, Flame } from "lucide-react";
import { highPriorityVehicles, normalPriorityVehicles, WantedVehicle } from "@/data/wantedVehicles";

const CategoryIcon = ({
  category
}: {
  category: WantedVehicle["category"];
}) => {
  switch (category) {
    case "Car":
      return <Car className="h-5 w-5" />;
    case "Bike":
      return <Bike className="h-5 w-5" />;
    case "Car/Bike":
      return <div className="flex gap-1">
          <Car className="h-4 w-4" />
          <Bike className="h-4 w-4" />
        </div>;
  }
};

interface VehicleCardProps {
  vehicle: WantedVehicle;
  isHighPriority: boolean;
}

const VehicleCard = ({
  vehicle,
  isHighPriority
}: VehicleCardProps) => <div className={`relative rounded-xl p-5 transition-all duration-300 ${isHighPriority ? "bg-card border-2 border-accent/50 hover:border-accent hover:shadow-glow" : "bg-card border border-border hover:border-primary/50 hover:bg-card/80"}`}>
    {isHighPriority && <div className="absolute -top-2 -left-2 bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded-full shadow-lg">
        HIGH
      </div>}

    <div className="inline-flex items-center gap-1.5 bg-muted text-muted-foreground text-xs px-2 py-1 rounded-md mb-3">
      <CategoryIcon category={vehicle.category} />
      <span>{vehicle.category}</span>
    </div>

    <h4 className={`font-display text-lg font-bold mb-2 transition-colors ${isHighPriority ? "text-foreground" : "text-foreground"}`}>
      {vehicle.name}
    </h4>

    <p className={`text-sm font-medium ${isHighPriority ? "text-primary" : "text-muted-foreground"}`}>
      {vehicle.tag}
    </p>
  </div>;

const WantedSection = () => {
  return <section className="py-20 bg-gradient-to-b from-background to-card">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-destructive/20 text-destructive px-4 py-2 rounded-full mb-4">
            <Flame className="h-5 w-5 animate-pulse" />
            <span className="font-bold tracking-wide">WANTED</span>
            <Flame className="h-5 w-5 animate-pulse" />
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">買取強化リスト</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            以下の車両・バイクを高価買取中です。お持ちの方はぜひご相談ください。
          </p>
        </div>

        {/* High Priority Section */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Star className="h-6 w-6 text-accent fill-accent" />
            <h3 className="text-xl font-bold text-foreground">特に探しています</h3>
            <span className="text-sm text-muted-foreground">({highPriorityVehicles.length})</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {highPriorityVehicles.map(vehicle => <VehicleCard key={vehicle.id} vehicle={vehicle} isHighPriority={true} />)}
          </div>
        </div>

        {/* Normal Priority Section */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <h3 className="text-xl font-bold text-foreground">その他の強化車種</h3>
            <span className="text-sm text-muted-foreground">({normalPriorityVehicles.length})</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {normalPriorityVehicles.map(vehicle => <VehicleCard key={vehicle.id} vehicle={vehicle} isHighPriority={false} />)}
          </div>
        </div>
      </div>
    </section>;
};

export default WantedSection;
