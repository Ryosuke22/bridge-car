import { useState } from "react";
import { Car, Bike, Star, Flame, GripVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface WantedVehicle {
  id: string;
  name: string;
  category: "Car" | "Bike" | "Car/Bike";
  tag: string;
  priority: "High" | "Normal";
}

const initialHighPriority: WantedVehicle[] = [
  { id: "1", name: "Ducati 916 SP", category: "Bike", tag: "イタリアの名宝 / 希少SPモデル", priority: "High" },
  { id: "2", name: "Honda City & Motocompo", category: "Car/Bike", tag: "80's アイコン / セット買取強化", priority: "High" },
  { id: "3", name: "Nissan Figaro", category: "Car", tag: "北米・英国輸出人気 / パイクカー", priority: "High" },
  { id: "4", name: "Mitsubishi Pajero Evolution", category: "Car", tag: "ダカールラリー直系 / 輸出超高騰", priority: "High" },
  { id: "5", name: "Toyota Century", category: "Car", tag: "V12 / V8 / 海外VIP需要", priority: "High" },
  { id: "6", name: "Audi RS4 Avant", category: "Car", tag: "クワトロ / 25年ルール対象車", priority: "High" },
  { id: "7", name: "Ferrari 456 GTA", category: "Car", tag: "V12 / 2+2 / ネオクラシック", priority: "High" },
  { id: "8", name: "Ferrari 550/575 Maranello", category: "Car", tag: "V12 フロントエンジン / 伝説の名車", priority: "High" },
  { id: "9", name: "Honda Gold Monkey", category: "Bike", tag: "限定ゴールドメッキ / 未走行車高額", priority: "High" },
];

const initialNormalPriority: WantedVehicle[] = [
  { id: "10", name: "Honda GB500", category: "Bike", tag: "空冷シングル / カフェレーサー", priority: "Normal" },
  { id: "11", name: "Toyota Crown Estate", category: "Car", tag: "1JZターボ搭載車 / アスリートV", priority: "Normal" },
  { id: "12", name: "Mitsubishi Legnum (MT)", category: "Car", tag: "VR-4 マニュアル車 / 希少", priority: "Normal" },
  { id: "13", name: "Subaru Legacy Touring Wagon", category: "Car", tag: "GT-B / マニュアル車求む", priority: "Normal" },
  { id: "14", name: "Daihatsu Mira Gino (Turbo)", category: "Car", tag: "ミニライトSP / ターボ車", priority: "Normal" },
  { id: "15", name: "Classic Mini Cooper", category: "Car", tag: "ローバーミニ / 最終モデル歓迎", priority: "Normal" },
  { id: "16", name: "Honda Monkey Baja", category: "Bike", tag: "絶版オフロードスタイル / コレクター向け", priority: "Normal" },
];

const CategoryIcon = ({ category }: { category: WantedVehicle["category"] }) => {
  switch (category) {
    case "Car":
      return <Car className="h-5 w-5" />;
    case "Bike":
      return <Bike className="h-5 w-5" />;
    case "Car/Bike":
      return (
        <div className="flex gap-1">
          <Car className="h-4 w-4" />
          <Bike className="h-4 w-4" />
        </div>
      );
  }
};

interface SortableCardProps {
  vehicle: WantedVehicle;
  isHighPriority: boolean;
}

const SortableCard = ({ vehicle, isHighPriority }: SortableCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: vehicle.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative rounded-xl p-5 transition-all duration-300 ${
        isDragging ? "opacity-80 scale-105 shadow-2xl" : ""
      } ${
        isHighPriority
          ? "bg-card border-2 border-accent/50 hover:border-accent hover:shadow-glow"
          : "bg-card border border-border hover:border-primary/50 hover:bg-card/80"
      }`}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 right-2 p-1.5 rounded-md bg-muted/50 hover:bg-muted cursor-grab active:cursor-grabbing opacity-50 hover:opacity-100 transition-opacity"
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>

      {/* Priority Badge for High Priority */}
      {isHighPriority && (
        <div className="absolute -top-2 -left-2 bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded-full shadow-lg">
          HIGH
        </div>
      )}

      {/* Category Badge */}
      <div className="inline-flex items-center gap-1.5 bg-muted text-muted-foreground text-xs px-2 py-1 rounded-md mb-3">
        <CategoryIcon category={vehicle.category} />
        <span>{vehicle.category}</span>
      </div>

      {/* Vehicle Name */}
      <h4
        className={`font-display text-lg font-bold mb-2 transition-colors ${
          isHighPriority
            ? "text-foreground group-hover:text-accent"
            : "text-foreground group-hover:text-primary"
        }`}
      >
        {vehicle.name}
      </h4>

      {/* Tag */}
      <p
        className={`text-sm font-medium ${
          isHighPriority ? "text-primary" : "text-muted-foreground"
        }`}
      >
        {vehicle.tag}
      </p>
    </div>
  );
};

const WantedSection = () => {
  const [highPriorityVehicles, setHighPriorityVehicles] = useState(initialHighPriority);
  const [normalPriorityVehicles, setNormalPriorityVehicles] = useState(initialNormalPriority);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleHighPriorityDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setHighPriorityVehicles((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleNormalPriorityDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setNormalPriorityVehicles((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-background to-card">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-destructive/20 text-destructive px-4 py-2 rounded-full mb-4">
            <Flame className="h-5 w-5 animate-pulse" />
            <span className="font-bold tracking-wide">WANTED</span>
            <Flame className="h-5 w-5 animate-pulse" />
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            買取強化リスト
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            以下の車両・バイクは特に高価買取中です。お持ちの方はぜひご相談ください。
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            ※ カードをドラッグして並び替えできます
          </p>
        </div>

        {/* High Priority Section */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Star className="h-6 w-6 text-accent fill-accent" />
            <h3 className="text-xl font-bold text-foreground">特に探しています</h3>
          </div>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleHighPriorityDragEnd}
          >
            <SortableContext
              items={highPriorityVehicles.map((v) => v.id)}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {highPriorityVehicles.map((vehicle) => (
                  <SortableCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    isHighPriority={true}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        {/* Normal Priority Section */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <h3 className="text-xl font-bold text-foreground">その他の強化車種</h3>
          </div>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleNormalPriorityDragEnd}
          >
            <SortableContext
              items={normalPriorityVehicles.map((v) => v.id)}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {normalPriorityVehicles.map((vehicle) => (
                  <SortableCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    isHighPriority={false}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </section>
  );
};

export default WantedSection;
