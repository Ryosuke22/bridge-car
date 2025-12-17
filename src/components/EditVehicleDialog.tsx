import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateVehicle, WantedVehicle } from "@/hooks/useWantedVehicles";
import { toast } from "sonner";

interface EditVehicleDialogProps {
  vehicle: WantedVehicle | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditVehicleDialog = ({ vehicle, open, onOpenChange }: EditVehicleDialogProps) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<WantedVehicle["category"]>("Car");
  const [tag, setTag] = useState("");
  
  const updateVehicle = useUpdateVehicle();

  useEffect(() => {
    if (vehicle) {
      setName(vehicle.name);
      setCategory(vehicle.category);
      setTag(vehicle.tag);
    }
  }, [vehicle]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!vehicle) return;
    if (!name.trim() || !tag.trim()) {
      toast.error("名前とタグは必須です");
      return;
    }

    try {
      await updateVehicle.mutateAsync({
        id: vehicle.id,
        name: name.trim(),
        category,
        tag: tag.trim(),
      });
      toast.success("車種を更新しました");
      onOpenChange(false);
    } catch {
      toast.error("更新に失敗しました");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>車種を編集</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">車種名</Label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例: スカイライン GT-R"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-category">カテゴリ</Label>
            <Select value={category} onValueChange={(value) => setCategory(value as WantedVehicle["category"])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Car">車</SelectItem>
                <SelectItem value="Bike">バイク</SelectItem>
                <SelectItem value="Car/Bike">車/バイク</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-tag">タグ（理由）</Label>
            <Input
              id="edit-tag"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="例: 輸出人気"
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              キャンセル
            </Button>
            <Button type="submit" disabled={updateVehicle.isPending}>
              {updateVehicle.isPending ? "更新中..." : "保存"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditVehicleDialog;
