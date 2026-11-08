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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      business_settings: {
        Row: {
          bank_account_name: string | null
          bank_account_number: string | null
          bank_name: string | null
          bank_nib: string | null
          bank_transfer_enabled: boolean
          id: boolean
          mpesa_enabled: boolean
          mpesa_limit: number | null
          updated_at: string
          whatsapp_number: string | null
        }
        Insert: {
          bank_account_name?: string | null
          bank_account_number?: string | null
          bank_name?: string | null
          bank_nib?: string | null
          bank_transfer_enabled?: boolean
          id?: boolean
          mpesa_enabled?: boolean
          mpesa_limit?: number | null
          updated_at?: string
          whatsapp_number?: string | null
        }
        Update: {
          bank_account_name?: string | null
          bank_account_number?: string | null
          bank_name?: string | null
          bank_nib?: string | null
          bank_transfer_enabled?: boolean
          id?: boolean
          mpesa_enabled?: boolean
          mpesa_limit?: number | null
          updated_at?: string
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      customers: {
        Row: {
          auth_user_id: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          notes: string | null
          phone: string
          updated_at: string
          whatsapp_phone: string | null
        }
        Insert: {
          auth_user_id?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          notes?: string | null
          phone: string
          updated_at?: string
          whatsapp_phone?: string | null
        }
        Update: {
          auth_user_id?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          notes?: string | null
          phone?: string
          updated_at?: string
          whatsapp_phone?: string | null
        }
        Relationships: []
      }
      fulfillments: {
        Row: {
          address: string | null
          contact_phone: string | null
          created_at: string
          delivery_fee: number
          id: string
          notes: string | null
          order_id: string
          scheduled_for: string | null
          status: Database["public"]["Enums"]["fulfillment_status"]
          type: Database["public"]["Enums"]["fulfillment_type"]
          updated_at: string
        }
        Insert: {
          address?: string | null
          contact_phone?: string | null
          created_at?: string
          delivery_fee?: number
          id?: string
          notes?: string | null
          order_id: string
          scheduled_for?: string | null
          status?: Database["public"]["Enums"]["fulfillment_status"]
          type: Database["public"]["Enums"]["fulfillment_type"]
          updated_at?: string
        }
        Update: {
          address?: string | null
          contact_phone?: string | null
          created_at?: string
          delivery_fee?: number
          id?: string
          notes?: string | null
          order_id?: string
          scheduled_for?: string | null
          status?: Database["public"]["Enums"]["fulfillment_status"]
          type?: Database["public"]["Enums"]["fulfillment_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fulfillments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_lots: {
        Row: {
          active: boolean
          arrival_date: string | null
          availability_date: string | null
          available_quantity: number
          created_at: string
          id: string
          lot_code: string
          package_id: string | null
          product_id: string | null
          reserved_quantity: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          arrival_date?: string | null
          availability_date?: string | null
          available_quantity?: number
          created_at?: string
          id?: string
          lot_code: string
          package_id?: string | null
          product_id?: string | null
          reserved_quantity?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          arrival_date?: string | null
          availability_date?: string | null
          available_quantity?: number
          created_at?: string
          id?: string
          lot_code?: string
          package_id?: string | null
          product_id?: string | null
          reserved_quantity?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_lots_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_lots_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      order_events: {
        Row: {
          created_at: string
          event_type: string
          id: number
          message: string | null
          metadata: Json
          order_id: string
          status: Database["public"]["Enums"]["order_status"] | null
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: never
          message?: string | null
          metadata?: Json
          order_id: string
          status?: Database["public"]["Enums"]["order_status"] | null
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: never
          message?: string | null
          metadata?: Json
          order_id?: string
          status?: Database["public"]["Enums"]["order_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "order_events_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          bird_type: Database["public"]["Enums"]["bird_type"] | null
          created_at: string
          id: string
          item_name: string
          line_total: number
          order_id: string
          package_id: string | null
          product_id: string | null
          quantity: number
          unit_price: number
        }
        Insert: {
          bird_type?: Database["public"]["Enums"]["bird_type"] | null
          created_at?: string
          id?: string
          item_name: string
          line_total?: number
          order_id: string
          package_id?: string | null
          product_id?: string | null
          quantity: number
          unit_price?: number
        }
        Update: {
          bird_type?: Database["public"]["Enums"]["bird_type"] | null
          created_at?: string
          id?: string
          item_name?: string
          line_total?: number
          order_id?: string
          package_id?: string | null
          product_id?: string | null
          quantity?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          channel: Database["public"]["Enums"]["order_channel"]
          created_at: string
          currency: string
          customer_id: string | null
          id: string
          notes: string | null
          payment_method: Database["public"]["Enums"]["payment_method"] | null
          payment_status: Database["public"]["Enums"]["payment_status"]
          reference: string
          status: Database["public"]["Enums"]["order_status"]
          total_amount: number
          updated_at: string
        }
        Insert: {
          channel?: Database["public"]["Enums"]["order_channel"]
          created_at?: string
          currency?: string
          customer_id?: string | null
          id?: string
          notes?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          reference: string
          status?: Database["public"]["Enums"]["order_status"]
          total_amount?: number
          updated_at?: string
        }
        Update: {
          channel?: Database["public"]["Enums"]["order_channel"]
          created_at?: string
          currency?: string
          customer_id?: string | null
          id?: string
          notes?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          reference?: string
          status?: Database["public"]["Enums"]["order_status"]
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      package_items: {
        Row: {
          created_at: string
          id: string
          item_name: string
          package_id: string
          product_id: string | null
          quantity: number
          unit: string
        }
        Insert: {
          created_at?: string
          id?: string
          item_name: string
          package_id: string
          product_id?: string | null
          quantity: number
          unit?: string
        }
        Update: {
          created_at?: string
          id?: string
          item_name?: string
          package_id?: string
          product_id?: string | null
          quantity?: number
          unit?: string
        }
        Relationships: [
          {
            foreignKeyName: "package_items_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "package_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      packages: {
        Row: {
          active: boolean
          bird_count: number
          bird_type: Database["public"]["Enums"]["bird_type"]
          created_at: string
          created_at_utc: string
          description: string | null
          id: string
          name: string
          price: number | null
          slug: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          bird_count: number
          bird_type: Database["public"]["Enums"]["bird_type"]
          created_at?: string
          created_at_utc?: string
          description?: string | null
          id?: string
          name: string
          price?: number | null
          slug: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          bird_count?: number
          bird_type?: Database["public"]["Enums"]["bird_type"]
          created_at?: string
          created_at_utc?: string
          description?: string | null
          id?: string
          name?: string
          price?: number | null
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      payment_proofs: {
        Row: {
          file_path: string | null
          id: string
          notes: string | null
          order_id: string
          payment_id: string | null
          status: Database["public"]["Enums"]["payment_status"]
          submitted_at: string
          submitted_by_phone: string
          verified_at: string | null
          whatsapp_message_reference: string | null
        }
        Insert: {
          file_path?: string | null
          id?: string
          notes?: string | null
          order_id: string
          payment_id?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          submitted_at?: string
          submitted_by_phone: string
          verified_at?: string | null
          whatsapp_message_reference?: string | null
        }
        Update: {
          file_path?: string | null
          id?: string
          notes?: string | null
          order_id?: string
          payment_id?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          submitted_at?: string
          submitted_by_phone?: string
          verified_at?: string | null
          whatsapp_message_reference?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_proofs_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_proofs_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          external_reference: string | null
          id: string
          method: Database["public"]["Enums"]["payment_method"]
          order_id: string
          paid_at: string | null
          status: Database["public"]["Enums"]["payment_status"]
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          external_reference?: string | null
          id?: string
          method: Database["public"]["Enums"]["payment_method"]
          order_id: string
          paid_at?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          external_reference?: string | null
          id?: string
          method?: Database["public"]["Enums"]["payment_method"]
          order_id?: string
          paid_at?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          active: boolean
          bird_type: Database["public"]["Enums"]["bird_type"] | null
          created_at: string
          description: string | null
          id: string
          name: string
          price: number | null
          sku: string | null
          slug: string
          unit: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          bird_type?: Database["public"]["Enums"]["bird_type"] | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          price?: number | null
          sku?: string | null
          slug: string
          unit?: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          bird_type?: Database["public"]["Enums"]["bird_type"] | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          price?: number | null
          sku?: string | null
          slug?: string
          unit?: string
          updated_at?: string
        }
        Relationships: []
      }
      reservations: {
        Row: {
          bird_type: Database["public"]["Enums"]["bird_type"] | null
          created_at: string
          customer_id: string | null
          id: string
          notes: string | null
          package_id: string | null
          product_id: string | null
          quantity: number
          reference: string
          reserved_for: string
          status: Database["public"]["Enums"]["reservation_status"]
          updated_at: string
        }
        Insert: {
          bird_type?: Database["public"]["Enums"]["bird_type"] | null
          created_at?: string
          customer_id?: string | null
          id?: string
          notes?: string | null
          package_id?: string | null
          product_id?: string | null
          quantity: number
          reference: string
          reserved_for: string
          status?: Database["public"]["Enums"]["reservation_status"]
          updated_at?: string
        }
        Update: {
          bird_type?: Database["public"]["Enums"]["bird_type"] | null
          created_at?: string
          customer_id?: string | null
          id?: string
          notes?: string | null
          package_id?: string | null
          product_id?: string | null
          quantity?: number
          reference?: string
          reserved_for?: string
          status?: Database["public"]["Enums"]["reservation_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reservations_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      bird_type: "ross" | "cobb" | "quail"
      fulfillment_status:
        | "pending"
        | "scheduled"
        | "ready"
        | "out_for_delivery"
        | "completed"
        | "cancelled"
      fulfillment_type: "delivery" | "pickup"
      order_channel: "website" | "whatsapp" | "backoffice"
      order_status:
        | "draft"
        | "pending_payment"
        | "payment_submitted"
        | "paid"
        | "confirmed"
        | "preparing"
        | "ready"
        | "out_for_delivery"
        | "ready_for_pickup"
        | "completed"
        | "cancelled"
      payment_method: "mpesa" | "bank_transfer" | "cash" | "other"
      payment_status:
        | "pending"
        | "submitted"
        | "verified"
        | "rejected"
        | "refunded"
      reservation_status: "pending" | "confirmed" | "fulfilled" | "cancelled"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      bird_type: ["ross", "cobb", "quail"],
      fulfillment_status: [
        "pending",
        "scheduled",
        "ready",
        "out_for_delivery",
        "completed",
        "cancelled",
      ],
      fulfillment_type: ["delivery", "pickup"],
      order_channel: ["website", "whatsapp", "backoffice"],
      order_status: [
        "draft",
        "pending_payment",
        "payment_submitted",
        "paid",
        "confirmed",
        "preparing",
        "ready",
        "out_for_delivery",
        "ready_for_pickup",
        "completed",
        "cancelled",
      ],
      payment_method: ["mpesa", "bank_transfer", "cash", "other"],
      payment_status: [
        "pending",
        "submitted",
        "verified",
        "rejected",
        "refunded",
      ],
      reservation_status: ["pending", "confirmed", "fulfilled", "cancelled"],
    },
  },
} as const
