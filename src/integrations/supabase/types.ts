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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          age_category: string
          car_label: string
          car_value: string
          city: string
          created_at: string
          daily_rate: number
          date_from: string
          date_to: string
          days: number
          delivery_time: string | null
          deposit: number
          email: string
          experience_category: string
          extras_cost: number
          first_name: string
          id: string
          last_name: string
          license_date: string | null
          license_number: string | null
          middle_name: string | null
          passport_code: string | null
          passport_date: string | null
          passport_number: string | null
          passport_series: string | null
          payment_method: string
          payment_status: string
          phone: string
          preferred_messenger: string | null
          prepay: number
          promo_code: string | null
          remaining: number
          selected_extras: string[] | null
          status: string
          total_cost: number
          updated_at: string
        }
        Insert: {
          age_category: string
          car_label: string
          car_value: string
          city?: string
          created_at?: string
          daily_rate: number
          date_from: string
          date_to: string
          days: number
          delivery_time?: string | null
          deposit: number
          email: string
          experience_category: string
          extras_cost?: number
          first_name: string
          id?: string
          last_name: string
          license_date?: string | null
          license_number?: string | null
          middle_name?: string | null
          passport_code?: string | null
          passport_date?: string | null
          passport_number?: string | null
          passport_series?: string | null
          payment_method: string
          payment_status?: string
          phone: string
          preferred_messenger?: string | null
          prepay: number
          promo_code?: string | null
          remaining: number
          selected_extras?: string[] | null
          status?: string
          total_cost: number
          updated_at?: string
        }
        Update: {
          age_category?: string
          car_label?: string
          car_value?: string
          city?: string
          created_at?: string
          daily_rate?: number
          date_from?: string
          date_to?: string
          days?: number
          delivery_time?: string | null
          deposit?: number
          email?: string
          experience_category?: string
          extras_cost?: number
          first_name?: string
          id?: string
          last_name?: string
          license_date?: string | null
          license_number?: string | null
          middle_name?: string | null
          passport_code?: string | null
          passport_date?: string | null
          passport_number?: string | null
          passport_series?: string | null
          payment_method?: string
          payment_status?: string
          phone?: string
          preferred_messenger?: string | null
          prepay?: number
          promo_code?: string | null
          remaining?: number
          selected_extras?: string[] | null
          status?: string
          total_cost?: number
          updated_at?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          bonus_balance: number
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          list_status: string
          loyalty_level: string
          middle_name: string | null
          notes: string | null
          phone: string
          total_rentals: number
          total_spent: number
          updated_at: string
        }
        Insert: {
          bonus_balance?: number
          created_at?: string
          email: string
          first_name: string
          id?: string
          last_name: string
          list_status?: string
          loyalty_level?: string
          middle_name?: string | null
          notes?: string | null
          phone: string
          total_rentals?: number
          total_spent?: number
          updated_at?: string
        }
        Update: {
          bonus_balance?: number
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          list_status?: string
          loyalty_level?: string
          middle_name?: string | null
          notes?: string | null
          phone?: string
          total_rentals?: number
          total_spent?: number
          updated_at?: string
        }
        Relationships: []
      }
      fleet: {
        Row: {
          car_label: string
          car_value: string
          created_at: string
          id: string
          mileage: number
          notes: string | null
          status: string
          updated_at: string
        }
        Insert: {
          car_label: string
          car_value: string
          created_at?: string
          id?: string
          mileage?: number
          notes?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          car_label?: string
          car_value?: string
          created_at?: string
          id?: string
          mileage?: number
          notes?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          bonus_balance: number
          created_at: string
          email: string
          favorite_cars: string[] | null
          first_name: string
          id: string
          last_name: string
          license_date: string | null
          license_number: string | null
          loyalty_level: string
          middle_name: string | null
          passport_code: string | null
          passport_date: string | null
          passport_number: string | null
          passport_series: string | null
          phone: string
          total_rentals: number
          total_spent: number
          updated_at: string
          user_id: string
        }
        Insert: {
          bonus_balance?: number
          created_at?: string
          email?: string
          favorite_cars?: string[] | null
          first_name?: string
          id?: string
          last_name?: string
          license_date?: string | null
          license_number?: string | null
          loyalty_level?: string
          middle_name?: string | null
          passport_code?: string | null
          passport_date?: string | null
          passport_number?: string | null
          passport_series?: string | null
          phone?: string
          total_rentals?: number
          total_spent?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          bonus_balance?: number
          created_at?: string
          email?: string
          favorite_cars?: string[] | null
          first_name?: string
          id?: string
          last_name?: string
          license_date?: string | null
          license_number?: string | null
          loyalty_level?: string
          middle_name?: string | null
          passport_code?: string | null
          passport_date?: string | null
          passport_number?: string | null
          passport_series?: string | null
          phone?: string
          total_rentals?: number
          total_spent?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
