export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      assessment_photos: {
        Row: {
          assessment_id: string
          created_at: string | null
          id: string
          photo_url: string
        }
        Insert: {
          assessment_id: string
          created_at?: string | null
          id?: string
          photo_url: string
        }
        Update: {
          assessment_id?: string
          created_at?: string | null
          id?: string
          photo_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessment_photos_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessment_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      assessment_requests: {
        Row: {
          accident_history: boolean | null
          admin_notes: string | null
          created_at: string | null
          displacement: number | null
          email: string
          engine_status: Database["public"]["Enums"]["engine_status"] | null
          estimated_price_max: number | null
          estimated_price_min: number | null
          fuel_type: Database["public"]["Enums"]["fuel_type"] | null
          handle_position: Database["public"]["Enums"]["handle_type"] | null
          has_custom: boolean | null
          id: string
          inspection_remaining: string | null
          manufacturer: string
          mileage: number | null
          model_name: string
          name: string
          notes: string | null
          phone: string | null
          status: Database["public"]["Enums"]["assessment_status"] | null
          touch_pen_marks: boolean | null
          transmission: Database["public"]["Enums"]["transmission_type"] | null
          updated_at: string | null
          vehicle_type: Database["public"]["Enums"]["vehicle_type"]
          year: number | null
        }
        Insert: {
          accident_history?: boolean | null
          admin_notes?: string | null
          created_at?: string | null
          displacement?: number | null
          email: string
          engine_status?: Database["public"]["Enums"]["engine_status"] | null
          estimated_price_max?: number | null
          estimated_price_min?: number | null
          fuel_type?: Database["public"]["Enums"]["fuel_type"] | null
          handle_position?: Database["public"]["Enums"]["handle_type"] | null
          has_custom?: boolean | null
          id?: string
          inspection_remaining?: string | null
          manufacturer: string
          mileage?: number | null
          model_name: string
          name: string
          notes?: string | null
          phone?: string | null
          status?: Database["public"]["Enums"]["assessment_status"] | null
          touch_pen_marks?: boolean | null
          transmission?: Database["public"]["Enums"]["transmission_type"] | null
          updated_at?: string | null
          vehicle_type: Database["public"]["Enums"]["vehicle_type"]
          year?: number | null
        }
        Update: {
          accident_history?: boolean | null
          admin_notes?: string | null
          created_at?: string | null
          displacement?: number | null
          email?: string
          engine_status?: Database["public"]["Enums"]["engine_status"] | null
          estimated_price_max?: number | null
          estimated_price_min?: number | null
          fuel_type?: Database["public"]["Enums"]["fuel_type"] | null
          handle_position?: Database["public"]["Enums"]["handle_type"] | null
          has_custom?: boolean | null
          id?: string
          inspection_remaining?: string | null
          manufacturer?: string
          mileage?: number | null
          model_name?: string
          name?: string
          notes?: string | null
          phone?: string | null
          status?: Database["public"]["Enums"]["assessment_status"] | null
          touch_pen_marks?: boolean | null
          transmission?: Database["public"]["Enums"]["transmission_type"] | null
          updated_at?: string | null
          vehicle_type?: Database["public"]["Enums"]["vehicle_type"]
          year?: number | null
        }
        Relationships: []
      }
      price_master: {
        Row: {
          created_at: string | null
          id: string
          max_price: number
          min_price: number
          model_name: string
          updated_at: string | null
          vehicle_type: Database["public"]["Enums"]["vehicle_type"]
        }
        Insert: {
          created_at?: string | null
          id?: string
          max_price?: number
          min_price?: number
          model_name: string
          updated_at?: string | null
          vehicle_type: Database["public"]["Enums"]["vehicle_type"]
        }
        Update: {
          created_at?: string | null
          id?: string
          max_price?: number
          min_price?: number
          model_name?: string
          updated_at?: string | null
          vehicle_type?: Database["public"]["Enums"]["vehicle_type"]
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wanted_vehicles: {
        Row: {
          category: string
          created_at: string | null
          id: string
          is_high_priority: boolean | null
          name: string
          sort_order: number | null
          tag: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          id?: string
          is_high_priority?: boolean | null
          name: string
          sort_order?: number | null
          tag: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          id?: string
          is_high_priority?: boolean | null
          name?: string
          sort_order?: number | null
          tag?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      assessment_status:
        | "pending"
        | "reviewing"
        | "quoted"
        | "completed"
        | "cancelled"
      engine_status: "running" | "not_running"
      fuel_type: "gasoline" | "diesel" | "hybrid" | "electric"
      handle_type: "right" | "left"
      transmission_type: "mt" | "at" | "cvt"
      vehicle_type: "car" | "bike"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      assessment_status: [
        "pending",
        "reviewing",
        "quoted",
        "completed",
        "cancelled",
      ],
      engine_status: ["running", "not_running"],
      fuel_type: ["gasoline", "diesel", "hybrid", "electric"],
      handle_type: ["right", "left"],
      transmission_type: ["mt", "at", "cvt"],
      vehicle_type: ["car", "bike"],
    },
  },
} as const
