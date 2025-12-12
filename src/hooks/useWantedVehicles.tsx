import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface WantedVehicle {
  id: string;
  name: string;
  category: 'Car' | 'Bike' | 'Car/Bike';
  tag: string;
  is_high_priority: boolean;
  sort_order: number;
}

export const useWantedVehicles = () => {
  return useQuery({
    queryKey: ['wanted-vehicles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('wanted_vehicles')
        .select('*')
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      return data as WantedVehicle[];
    }
  });
};

export const useAddVehicle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (vehicle: Omit<WantedVehicle, 'id'>) => {
      const { data, error } = await supabase
        .from('wanted_vehicles')
        .insert(vehicle)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wanted-vehicles'] });
    }
  });
};

export const useUpdateVehicle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<WantedVehicle> & { id: string }) => {
      const { data, error } = await supabase
        .from('wanted_vehicles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wanted-vehicles'] });
    }
  });
};

export const useDeleteVehicle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('wanted_vehicles')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wanted-vehicles'] });
    }
  });
};

export const useReorderVehicles = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (vehicles: { id: string; sort_order: number }[]) => {
      const updates = vehicles.map(v => 
        supabase
          .from('wanted_vehicles')
          .update({ sort_order: v.sort_order })
          .eq('id', v.id)
      );
      
      await Promise.all(updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wanted-vehicles'] });
    }
  });
};

// Helper functions for form selection
export const getCarModels = (vehicles: WantedVehicle[]) => {
  return vehicles
    .filter(v => v.category === 'Car' || v.category === 'Car/Bike')
    .map(v => v.name);
};

export const getBikeModels = (vehicles: WantedVehicle[]) => {
  return vehicles
    .filter(v => v.category === 'Bike' || v.category === 'Car/Bike')
    .map(v => v.name);
};
