import { useState } from "react";
import { Car, Bike, Star, Flame, GripVertical, Trash2, Edit2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { 
  useWantedVehicles, 
  useDeleteVehicle, 
  useReorderVehicles,
  useUpdateVehicle,
  WantedVehicle 
} from "@/hooks/useWantedVehicles";
import AddVehicleDialog from "./AddVehicleDialog";
import EditVehicleDialog from "./EditVehicleDialog";
import { Button } from "./ui/button";
import { toast } from "sonner";
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
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

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

interface VehicleCardProps {
  vehicle: WantedVehicle;
  isAdmin: boolean;
  onDelete: (id: string) => void;
  onTogglePriority: (vehicle: WantedVehicle) => void;
  onEdit: (vehicle: WantedVehicle) => void;
}

const VehicleCard = ({ vehicle, isAdmin, onDelete, onTogglePriority, onEdit }: VehicleCardProps) => {
  const isHighPriority = vehicle.is_high_priority;
  
  return (
    <div
      className={`relative rounded-xl p-5 transition-all duration-300 ${
        isHighPriority
          ? "bg-card border-2 border-accent/50 hover:border-accent hover:shadow-glow"
          : "bg-card border border-border hover:border-primary/50 hover:bg-card/80"
      }`}
    >
      {isHighPriority && (
        <div className="absolute -top-2 -left-2 bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded-full shadow-lg">
          HIGH
        </div>
      )}

      {isAdmin && (
        <div className="absolute top-2 right-2 flex gap-1 z-20">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 pointer-events-auto"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(vehicle);
            }}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 pointer-events-auto"
            onClick={(e) => {
              e.stopPropagation();
              onTogglePriority(vehicle);
            }}
          >
            <Star className={`h-4 w-4 ${isHighPriority ? 'fill-accent text-accent' : ''}`} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive hover:text-destructive pointer-events-auto"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(vehicle.id);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="inline-flex items-center gap-1.5 bg-muted text-muted-foreground text-xs px-2 py-1 rounded-md mb-3">
        <CategoryIcon category={vehicle.category} />
        <span>{vehicle.category}</span>
      </div>

      <h4 className="font-card text-lg font-bold mb-2 text-foreground">
        {vehicle.name}
      </h4>

      <p className={`text-sm font-medium ${isHighPriority ? "text-primary" : "text-muted-foreground"}`}>
        {vehicle.tag}
      </p>
    </div>
  );
};

interface SortableVehicleCardProps {
  vehicle: WantedVehicle;
  isAdmin: boolean;
  onDelete: (id: string) => void;
  onTogglePriority: (vehicle: WantedVehicle) => void;
  onEdit: (vehicle: WantedVehicle) => void;
}

const SortableVehicleCard = ({ vehicle, isAdmin, onDelete, onTogglePriority, onEdit }: SortableVehicleCardProps) => {
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
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      {isAdmin && (
        <div
          {...attributes}
          {...listeners}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full pr-2 cursor-grab active:cursor-grabbing z-10"
        >
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </div>
      )}
      <VehicleCard
        vehicle={vehicle}
        isAdmin={isAdmin}
        onDelete={onDelete}
        onTogglePriority={onTogglePriority}
        onEdit={onEdit}
      />
    </div>
  );
};

const WantedSection = () => {
  const { isAdmin } = useAuth();
  const { data: vehicles = [], isLoading } = useWantedVehicles();
  const deleteVehicle = useDeleteVehicle();
  const reorderVehicles = useReorderVehicles();
  const updateVehicle = useUpdateVehicle();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingVehicle, setEditingVehicle] = useState<WantedVehicle | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const highPriorityVehicles = vehicles.filter(v => v.is_high_priority);
  const normalPriorityVehicles = vehicles.filter(v => !v.is_high_priority);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const allVehicles = [...vehicles];
      const oldIndex = allVehicles.findIndex(v => v.id === active.id);
      const newIndex = allVehicles.findIndex(v => v.id === over.id);
      
      const reordered = arrayMove(allVehicles, oldIndex, newIndex);
      const updates = reordered.map((v, index) => ({
        id: v.id,
        sort_order: index
      }));
      
      try {
        await reorderVehicles.mutateAsync(updates);
        toast.success('並び順を更新しました');
      } catch {
        toast.error('並び順の更新に失敗しました');
      }
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    
    try {
      await deleteVehicle.mutateAsync(deleteId);
      toast.success('車種を削除しました');
    } catch {
      toast.error('削除に失敗しました');
    }
    setDeleteId(null);
  };

  const handleTogglePriority = async (vehicle: WantedVehicle) => {
    try {
      await updateVehicle.mutateAsync({
        id: vehicle.id,
        is_high_priority: !vehicle.is_high_priority
      });
      toast.success('優先度を更新しました');
    } catch {
      toast.error('更新に失敗しました');
    }
  };

  const maxSortOrder = Math.max(...vehicles.map(v => v.sort_order), 0);

  if (isLoading) {
    return (
      <section className="py-20 bg-gradient-to-b from-background to-card">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">読み込み中...</p>
        </div>
      </section>
    );
  }

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
            以下の車両・バイクを高価買取中です。お持ちの方はぜひご相談ください。
          </p>
          
          {isAdmin && (
            <div className="mt-6">
              <AddVehicleDialog maxSortOrder={maxSortOrder} />
            </div>
          )}
        </div>

        {isAdmin ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            {/* High Priority Section */}
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-6">
                <Star className="h-6 w-6 text-accent fill-accent" />
                <h3 className="text-xl font-bold text-foreground">特に探しています</h3>
                <span className="text-sm text-muted-foreground">
                  ({highPriorityVehicles.length})
                </span>
              </div>
              <SortableContext
                items={highPriorityVehicles.map(v => v.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pl-8">
                  {highPriorityVehicles.map((vehicle) => (
                    <SortableVehicleCard
                      key={vehicle.id}
                      vehicle={vehicle}
                      isAdmin={isAdmin}
                      onDelete={setDeleteId}
                      onTogglePriority={handleTogglePriority}
                      onEdit={setEditingVehicle}
                    />
                  ))}
                </div>
              </SortableContext>
            </div>

            {/* Normal Priority Section */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <h3 className="text-xl font-bold text-foreground">その他の強化車種</h3>
                <span className="text-sm text-muted-foreground">
                  ({normalPriorityVehicles.length})
                </span>
              </div>
              <SortableContext
                items={normalPriorityVehicles.map(v => v.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pl-8">
                  {normalPriorityVehicles.map((vehicle) => (
                    <SortableVehicleCard
                      key={vehicle.id}
                      vehicle={vehicle}
                      isAdmin={isAdmin}
                      onDelete={setDeleteId}
                      onTogglePriority={handleTogglePriority}
                      onEdit={setEditingVehicle}
                    />
                  ))}
                </div>
              </SortableContext>
            </div>
          </DndContext>
        ) : (
          <>
            {/* High Priority Section */}
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-6">
                <Star className="h-6 w-6 text-accent fill-accent" />
                <h3 className="text-xl font-bold text-foreground">特に探しています</h3>
                <span className="text-sm text-muted-foreground">
                  ({highPriorityVehicles.length})
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {highPriorityVehicles.map((vehicle) => (
                  <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    isAdmin={false}
                    onDelete={() => {}}
                    onTogglePriority={() => {}}
                    onEdit={() => {}}
                  />
                ))}
              </div>
            </div>

            {/* Normal Priority Section */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <h3 className="text-xl font-bold text-foreground">その他の強化車種</h3>
                <span className="text-sm text-muted-foreground">
                  ({normalPriorityVehicles.length})
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {normalPriorityVehicles.map((vehicle) => (
                  <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    isAdmin={false}
                    onDelete={() => {}}
                    onTogglePriority={() => {}}
                    onEdit={() => {}}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>車種を削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              この操作は取り消せません。本当に削除してよろしいですか？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              削除する
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Vehicle Dialog */}
      <EditVehicleDialog
        vehicle={editingVehicle}
        open={!!editingVehicle}
        onOpenChange={(open) => !open && setEditingVehicle(null)}
      />
    </section>
  );
};

export default WantedSection;
