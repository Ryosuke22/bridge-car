import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus } from 'lucide-react';
import { useAddVehicle, WantedVehicle } from '@/hooks/useWantedVehicles';
import { toast } from 'sonner';

interface AddVehicleDialogProps {
  maxSortOrder: number;
}

const AddVehicleDialog = ({ maxSortOrder }: AddVehicleDialogProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<WantedVehicle['category']>('Car');
  const [tag, setTag] = useState('');
  const [isHighPriority, setIsHighPriority] = useState(false);
  
  const addVehicle = useAddVehicle();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await addVehicle.mutateAsync({
        name,
        category,
        tag,
        is_high_priority: isHighPriority,
        sort_order: maxSortOrder + 1
      });
      toast.success('車種を追加しました');
      setOpen(false);
      setName('');
      setTag('');
      setCategory('Car');
      setIsHighPriority(false);
    } catch (error) {
      toast.error('追加に失敗しました');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          車種を追加
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>新しい車種を追加</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">車種名</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例: スカイライン GT-R"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">カテゴリー</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as WantedVehicle['category'])}>
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
            <Label htmlFor="tag">タグ（買取理由）</Label>
            <Input
              id="tag"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="例: 海外輸出人気 / 希少車"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="priority">高優先度</Label>
            <Switch
              id="priority"
              checked={isHighPriority}
              onCheckedChange={setIsHighPriority}
            />
          </div>
          <Button type="submit" className="w-full" disabled={addVehicle.isPending}>
            {addVehicle.isPending ? '追加中...' : '追加する'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddVehicleDialog;
