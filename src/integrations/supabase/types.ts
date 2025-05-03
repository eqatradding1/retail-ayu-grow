export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      credit_payments: {
        Row: {
          amount: number
          credit_record_id: string | null
          id: string
          notes: string | null
          payment_date: string
          payment_method: string | null
          receipt_url: string | null
        }
        Insert: {
          amount: number
          credit_record_id?: string | null
          id?: string
          notes?: string | null
          payment_date?: string
          payment_method?: string | null
          receipt_url?: string | null
        }
        Update: {
          amount?: number
          credit_record_id?: string | null
          id?: string
          notes?: string | null
          payment_date?: string
          payment_method?: string | null
          receipt_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "credit_payments_credit_record_id_fkey"
            columns: ["credit_record_id"]
            isOneToOne: false
            referencedRelation: "credit_records"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_records: {
        Row: {
          created_at: string
          customer_id: string | null
          due_date: string
          id: string
          initial_amount: number
          last_reminder_date: string | null
          notes: string | null
          remaining_amount: number
          status: string
          transaction_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          due_date: string
          id?: string
          initial_amount: number
          last_reminder_date?: string | null
          notes?: string | null
          remaining_amount: number
          status?: string
          transaction_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          due_date?: string
          id?: string
          initial_amount?: number
          last_reminder_date?: string | null
          notes?: string | null
          remaining_amount?: number
          status?: string
          transaction_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "credit_records_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credit_records_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          id: string
          loyalty_points: number | null
          name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          loyalty_points?: number | null
          name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          loyalty_points?: number | null
          name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      email_settings: {
        Row: {
          created_at: string
          email_signature: string | null
          enable_emails: boolean
          id: string
          send_low_stock_alert: boolean
          send_order_confirmation: boolean
          send_payment_receipt: boolean
          sender_email: string | null
          sender_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email_signature?: string | null
          enable_emails?: boolean
          id?: string
          send_low_stock_alert?: boolean
          send_order_confirmation?: boolean
          send_payment_receipt?: boolean
          sender_email?: string | null
          sender_name?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email_signature?: string | null
          enable_emails?: boolean
          id?: string
          send_low_stock_alert?: boolean
          send_order_confirmation?: boolean
          send_payment_receipt?: boolean
          sender_email?: string | null
          sender_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          category: string
          created_at: string
          date: string
          description: string | null
          id: string
          receipt_url: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          date: string
          description?: string | null
          id?: string
          receipt_url?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          receipt_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      invoice_settings: {
        Row: {
          created_at: string
          due_days: number
          id: string
          next_number: number
          prefix: string
          show_logo: boolean
          terms_and_conditions: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          due_days?: number
          id?: string
          next_number?: number
          prefix?: string
          show_logo?: boolean
          terms_and_conditions?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          due_days?: number
          id?: string
          next_number?: number
          prefix?: string
          show_logo?: boolean
          terms_and_conditions?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      price_levels: {
        Row: {
          created_at: string
          id: string
          min_quantity: number
          price: number
          product_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          min_quantity: number
          price: number
          product_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          min_quantity?: number
          price?: number
          product_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "price_levels_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          barcode: string | null
          category_id: string | null
          cost_price: number
          created_at: string
          description: string | null
          expiry_date: string | null
          id: string
          loyalty_points: number | null
          min_stock_level: number
          name: string
          photo_url: string | null
          retail_price: number
          stock_quantity: number
          unit_id: string | null
          updated_at: string
        }
        Insert: {
          barcode?: string | null
          category_id?: string | null
          cost_price?: number
          created_at?: string
          description?: string | null
          expiry_date?: string | null
          id?: string
          loyalty_points?: number | null
          min_stock_level?: number
          name: string
          photo_url?: string | null
          retail_price?: number
          stock_quantity?: number
          unit_id?: string | null
          updated_at?: string
        }
        Update: {
          barcode?: string | null
          category_id?: string | null
          cost_price?: number
          created_at?: string
          description?: string | null
          expiry_date?: string | null
          id?: string
          loyalty_points?: number | null
          min_stock_level?: number
          name?: string
          photo_url?: string | null
          retail_price?: number
          stock_quantity?: number
          unit_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          role: string | null
          role_id: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          role?: string | null
          role_id?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: string | null
          role_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "user_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_transactions: {
        Row: {
          created_at: string
          id: string
          invoice_number: string | null
          notes: string | null
          product_id: string
          quantity: number
          supplier_id: string | null
          type: string
          unit_price: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          invoice_number?: string | null
          notes?: string | null
          product_id: string
          quantity: number
          supplier_id?: string | null
          type: string
          unit_price?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          invoice_number?: string | null
          notes?: string | null
          product_id?: string
          quantity?: number
          supplier_id?: string | null
          type?: string
          unit_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "stock_transactions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      store_settings: {
        Row: {
          address: string | null
          created_at: string
          currency_code: string
          email: string | null
          id: string
          logo_url: string | null
          name: string
          phone: string | null
          tax_id: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          currency_code?: string
          email?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          phone?: string | null
          tax_id?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          currency_code?: string
          email?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          phone?: string | null
          tax_id?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      tax_settings: {
        Row: {
          created_at: string
          default_tax_rate: number
          enable_tax: boolean
          id: string
          include_tax_in_price: boolean
          tax_name: string
          tax_number: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          default_tax_rate?: number
          enable_tax?: boolean
          id?: string
          include_tax_in_price?: boolean
          tax_name?: string
          tax_number?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          default_tax_rate?: number
          enable_tax?: boolean
          id?: string
          include_tax_in_price?: boolean
          tax_name?: string
          tax_number?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      transaction_items: {
        Row: {
          created_at: string
          id: string
          product_id: string
          quantity: number
          subtotal: number
          transaction_id: string
          unit_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          quantity: number
          subtotal: number
          transaction_id: string
          unit_price: number
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number
          subtotal?: number
          transaction_id?: string
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "transaction_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transaction_items_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          created_at: string
          customer_id: string | null
          discount_amount: number | null
          id: string
          notes: string | null
          payment_method: string | null
          payment_status: string | null
          tax_amount: number | null
          total_amount: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          discount_amount?: number | null
          id?: string
          notes?: string | null
          payment_method?: string | null
          payment_status?: string | null
          tax_amount?: number | null
          total_amount?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          discount_amount?: number | null
          id?: string
          notes?: string | null
          payment_method?: string | null
          payment_status?: string | null
          tax_amount?: number | null
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      units: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          name: string
          permissions: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          permissions: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          permissions?: Json
          updated_at?: string
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
