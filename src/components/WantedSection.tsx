import { useState } from "react";
import { Car, Bike, Star, Flame, GripVertical, Plus, X } from "lucide-react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, rectSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
interface WantedVehicle {
  id: string;
  name: string;
  category: "Car" | "Bike" | "Car/Bike";
  tag: string;
  priority: "High" | "Normal";
}
const initialHighPriority: WantedVehicle[] = [{
  id: "1",
  name: "Ducati 916 SP",
  category: "Bike",
  tag: "イタリアの名宝 / 希少SPモデル",
  priority: "High"
}, {
  id: "2",
  name: "Honda City & Motocompo",
  category: "Car/Bike",
  tag: "80's アイコン / セット買取強化",
  priority: "High"
}, {
  id: "3",
  name: "Nissan Figaro",
  category: "Car",
  tag: "北米・英国輸出人気 / パイクカー",
  priority: "High"
}, {
  id: "4",
  name: "Mitsubishi Pajero Evolution",
  category: "Car",
  tag: "ダカールラリー直系 / 輸出超高騰",
  priority: "High"
}, {
  id: "5",
  name: "Toyota Century",
  category: "Car",
  tag: "V12 / V8 / 海外VIP需要",
  priority: "High"
}, {
  id: "6",
  name: "Audi RS4 Avant",
  category: "Car",
  tag: "クワトロ / 25年ルール対象車",
  priority: "High"
}, {
  id: "7",
  name: "Ferrari 456 GTA",
  category: "Car",
  tag: "V12 / 2+2 / ネオクラシック",
  priority: "High"
}, {
  id: "8",
  name: "Ferrari 550/575 Maranello",
  category: "Car",
  tag: "V12 フロントエンジン / 伝説の名車",
  priority: "High"
}, {
  id: "9",
  name: "Honda Gold Monkey",
  category: "Bike",
  tag: "限定ゴールドメッキ / 未走行車高額",
  priority: "High"
}];
const initialNormalPriority: WantedVehicle[] = [{
  id: "10",
  name: "Honda GB500",
  category: "Bike",
  tag: "空冷シングル / カフェレーサー",
  priority: "Normal"
}, {
  id: "11",
  name: "Toyota Crown Estate",
  category: "Car",
  tag: "1JZターボ搭載車 / アスリートV",
  priority: "Normal"
}, {
  id: "12",
  name: "Mitsubishi Legnum (MT)",
  category: "Car",
  tag: "VR-4 マニュアル車 / 希少",
  priority: "Normal"
}, {
  id: "13",
  name: "Subaru Legacy Touring Wagon",
  category: "Car",
  tag: "GT-B / マニュアル車求む",
  priority: "Normal"
}, {
  id: "14",
  name: "Daihatsu Mira Gino (Turbo)",
  category: "Car",
  tag: "ミニライトSP / ターボ車",
  priority: "Normal"
}, {
  id: "15",
  name: "Classic Mini Cooper",
  category: "Car",
  tag: "ローバーミニ / 最終モデル歓迎",
  priority: "Normal"
}, {
  id: "16",
  name: "Honda Monkey Baja",
  category: "Bike",
  tag: "絶版オフロードスタイル / コレクター向け",
  priority: "Normal"
}];
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
interface CardContentProps {
  vehicle: WantedVehicle;
  isHighPriority: boolean;
  isDragging?: boolean;
}
const CardContent = ({
  vehicle,
  isHighPriority,
  isDragging
}: CardContentProps) => <div className={`relative rounded-xl p-5 transition-all duration-300 ${isDragging ? "opacity-90 shadow-2xl ring-2 ring-accent" : ""} ${isHighPriority ? "bg-card border-2 border-accent/50" : "bg-card border border-border"}`}>
    {/* Priority Badge for High Priority */}
    {isHighPriority && <div className="absolute -top-2 -left-2 bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded-full shadow-lg">
        HIGH
      </div>}

    {/* Category Badge */}
    <div className="inline-flex items-center gap-1.5 bg-muted text-muted-foreground text-xs px-2 py-1 rounded-md mb-3">
      <CategoryIcon category={vehicle.category} />
      <span>{vehicle.category}</span>
    </div>

    {/* Vehicle Name */}
    <h4 className={`font-display text-lg font-bold mb-2 ${isHighPriority ? "text-foreground" : "text-foreground"}`}>
      {vehicle.name}
    </h4>

    {/* Tag */}
    <p className={`text-sm font-medium ${isHighPriority ? "text-primary" : "text-muted-foreground"}`}>
      {vehicle.tag}
    </p>
  </div>;
interface SortableCardProps {
  vehicle: WantedVehicle;
  isHighPriority: boolean;
  onDelete: (id: string) => void;
}
const SortableCard = ({
  vehicle,
  isHighPriority,
  onDelete
}: SortableCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: vehicle.id
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1
  };
  return <div ref={setNodeRef} style={style} className="relative group">
      {/* Drag Handle */}
      <div {...attributes} {...listeners} className="absolute top-2 right-2 z-10 p-1.5 rounded-md bg-muted/50 hover:bg-muted cursor-grab active:cursor-grabbing opacity-50 hover:opacity-100 transition-opacity">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
      {/* Delete Button */}
      <button onClick={() => onDelete(vehicle.id)} className="absolute top-2 right-10 z-10 p-1.5 rounded-md bg-destructive/50 hover:bg-destructive cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
        <X className="h-4 w-4 text-destructive-foreground" />
      </button>
      <div className={`rounded-xl p-5 transition-all duration-300 ${isHighPriority ? "bg-card border-2 border-accent/50 hover:border-accent hover:shadow-glow" : "bg-card border border-border hover:border-primary/50 hover:bg-card/80"}`}>
        {/* Priority Badge for High Priority */}
        {isHighPriority && <div className="absolute -top-2 -left-2 bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded-full shadow-lg">
            HIGH
          </div>}

        {/* Category Badge */}
        <div className="inline-flex items-center gap-1.5 bg-muted text-muted-foreground text-xs px-2 py-1 rounded-md mb-3">
          <CategoryIcon category={vehicle.category} />
          <span>{vehicle.category}</span>
        </div>

        {/* Vehicle Name */}
        <h4 className={`font-display text-lg font-bold mb-2 transition-colors ${isHighPriority ? "text-foreground group-hover:text-accent" : "text-foreground group-hover:text-primary"}`}>
          {vehicle.name}
        </h4>

        {/* Tag */}
        <p className={`text-sm font-medium ${isHighPriority ? "text-primary" : "text-muted-foreground"}`}>
          {vehicle.tag}
        </p>
      </div>
    </div>;
};
const WantedSection = () => {
  const [highPriorityVehicles, setHighPriorityVehicles] = useState(initialHighPriority);
  const [normalPriorityVehicles, setNormalPriorityVehicles] = useState(initialNormalPriority);
  const [activeVehicle, setActiveVehicle] = useState<WantedVehicle | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    name: "",
    category: "Car" as WantedVehicle["category"],
    tag: "",
    priority: "High" as WantedVehicle["priority"]
  });
  const sensors = useSensors(useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8
    }
  }), useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates
  }));
  const handleAddVehicle = () => {
    if (!newVehicle.name.trim()) return;
    const vehicle: WantedVehicle = {
      id: `new-${Date.now()}`,
      name: newVehicle.name,
      category: newVehicle.category,
      tag: newVehicle.tag || "新規追加",
      priority: newVehicle.priority
    };
    if (newVehicle.priority === "High") {
      setHighPriorityVehicles(prev => [...prev, vehicle]);
    } else {
      setNormalPriorityVehicles(prev => [...prev, vehicle]);
    }
    setNewVehicle({
      name: "",
      category: "Car",
      tag: "",
      priority: "High"
    });
    setIsAddDialogOpen(false);
  };
  const handleDeleteVehicle = (id: string) => {
    setHighPriorityVehicles(prev => prev.filter(v => v.id !== id));
    setNormalPriorityVehicles(prev => prev.filter(v => v.id !== id));
  };
  const findContainer = (id: string) => {
    if (highPriorityVehicles.find(v => v.id === id)) return "high";
    if (normalPriorityVehicles.find(v => v.id === id)) return "normal";
    return null;
  };
  const handleDragStart = (event: DragStartEvent) => {
    const {
      active
    } = event;
    const vehicle = highPriorityVehicles.find(v => v.id === active.id) || normalPriorityVehicles.find(v => v.id === active.id);
    setActiveVehicle(vehicle || null);
  };
  const handleDragOver = (event: DragOverEvent) => {
    const {
      active,
      over
    } = event;
    if (!over) return;
    const activeContainer = findContainer(active.id as string);
    const overContainer = findContainer(over.id as string);
    if (!activeContainer || !overContainer || activeContainer === overContainer) return;

    // Moving between containers
    if (activeContainer === "high" && overContainer === "normal") {
      const vehicle = highPriorityVehicles.find(v => v.id === active.id);
      if (vehicle) {
        setHighPriorityVehicles(prev => prev.filter(v => v.id !== active.id));
        const overIndex = normalPriorityVehicles.findIndex(v => v.id === over.id);
        setNormalPriorityVehicles(prev => {
          const newItems = [...prev];
          newItems.splice(overIndex >= 0 ? overIndex : prev.length, 0, {
            ...vehicle,
            priority: "Normal"
          });
          return newItems;
        });
      }
    } else if (activeContainer === "normal" && overContainer === "high") {
      const vehicle = normalPriorityVehicles.find(v => v.id === active.id);
      if (vehicle) {
        setNormalPriorityVehicles(prev => prev.filter(v => v.id !== active.id));
        const overIndex = highPriorityVehicles.findIndex(v => v.id === over.id);
        setHighPriorityVehicles(prev => {
          const newItems = [...prev];
          newItems.splice(overIndex >= 0 ? overIndex : prev.length, 0, {
            ...vehicle,
            priority: "High"
          });
          return newItems;
        });
      }
    }
  };
  const handleDragEnd = (event: DragEndEvent) => {
    const {
      active,
      over
    } = event;
    setActiveVehicle(null);
    if (!over || active.id === over.id) return;
    const activeContainer = findContainer(active.id as string);
    const overContainer = findContainer(over.id as string);
    if (activeContainer === overContainer) {
      if (activeContainer === "high") {
        setHighPriorityVehicles(items => {
          const oldIndex = items.findIndex(item => item.id === active.id);
          const newIndex = items.findIndex(item => item.id === over.id);
          return arrayMove(items, oldIndex, newIndex);
        });
      } else if (activeContainer === "normal") {
        setNormalPriorityVehicles(items => {
          const oldIndex = items.findIndex(item => item.id === active.id);
          const newIndex = items.findIndex(item => item.id === over.id);
          return arrayMove(items, oldIndex, newIndex);
        });
      }
    }
  };
  const allIds = [...highPriorityVehicles.map(v => v.id), ...normalPriorityVehicles.map(v => v.id)];
  return <section className="py-20 bg-gradient-to-b from-background to-card">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-destructive/20 text-destructive px-4 py-2 rounded-full mb-4">
            <Flame className="h-5 w-5 animate-pulse" />
            <span className="font-bold tracking-wide">WANTED</span>
            <Flame className="h-5 w-5 animate-pulse" />
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">買取リスト</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">以下の車両・バイクを高価買取中です。お持ちの方はぜひご相談ください。</p>
          <p className="text-sm text-muted-foreground mt-2">
            ※ カードをドラッグしてセクション間の移動・並び替え、ホバーで削除ができます
          </p>
          
          {/* Add Button */}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="mt-4" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                車両を追加
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>新しい車両を追加</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="name">車両名</Label>
                  <Input id="name" value={newVehicle.name} onChange={e => setNewVehicle({
                  ...newVehicle,
                  name: e.target.value
                })} placeholder="例: Toyota Supra MK4" />
                </div>
                <div>
                  <Label htmlFor="tag">タグ</Label>
                  <Input id="tag" value={newVehicle.tag} onChange={e => setNewVehicle({
                  ...newVehicle,
                  tag: e.target.value
                })} placeholder="例: 2JZ-GTE / 希少MTモデル" />
                </div>
                <div>
                  <Label>カテゴリー</Label>
                  <Select value={newVehicle.category} onValueChange={value => setNewVehicle({
                  ...newVehicle,
                  category: value as WantedVehicle["category"]
                })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Car">Car</SelectItem>
                      <SelectItem value="Bike">Bike</SelectItem>
                      <SelectItem value="Car/Bike">Car/Bike</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>優先度</Label>
                  <Select value={newVehicle.priority} onValueChange={value => setNewVehicle({
                  ...newVehicle,
                  priority: value as WantedVehicle["priority"]
                })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">High Priority</SelectItem>
                      <SelectItem value="Normal">Normal Priority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddVehicle} className="w-full">
                  追加する
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
          {/* High Priority Section */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Star className="h-6 w-6 text-accent fill-accent" />
              <h3 className="text-xl font-bold text-foreground">特に探しています</h3>
              <span className="text-sm text-muted-foreground">({highPriorityVehicles.length})</span>
            </div>
            <SortableContext items={allIds} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 min-h-[120px] p-2 rounded-xl border-2 border-dashed border-accent/30 bg-accent/5">
                {highPriorityVehicles.map(vehicle => <SortableCard key={vehicle.id} vehicle={vehicle} isHighPriority={true} onDelete={handleDeleteVehicle} />)}
              </div>
            </SortableContext>
          </div>

          {/* Normal Priority Section */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <h3 className="text-xl font-bold text-foreground">その他の強化車種</h3>
              <span className="text-sm text-muted-foreground">({normalPriorityVehicles.length})</span>
            </div>
            <SortableContext items={allIds} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 min-h-[120px] p-2 rounded-xl border-2 border-dashed border-border bg-muted/5">
                {normalPriorityVehicles.map(vehicle => <SortableCard key={vehicle.id} vehicle={vehicle} isHighPriority={false} onDelete={handleDeleteVehicle} />)}
              </div>
            </SortableContext>
          </div>

          {/* Drag Overlay */}
          <DragOverlay>
            {activeVehicle ? <CardContent vehicle={activeVehicle} isHighPriority={activeVehicle.priority === "High"} isDragging /> : null}
          </DragOverlay>
        </DndContext>
      </div>
    </section>;
};
export default WantedSection;