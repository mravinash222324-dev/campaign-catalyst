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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      ads: {
        Row: {
          brief_id: string
          budget: number
          client_id: string
          created_at: string
          ctr: number
          end_date: string | null
          id: string
          leads: number
          platform: Database["public"]["Enums"]["platform_type"]
          reach: number
          spent: number
          start_date: string
          status: string
          type: Database["public"]["Enums"]["ad_type"]
          updated_at: string
        }
        Insert: {
          brief_id: string
          budget?: number
          client_id: string
          created_at?: string
          ctr?: number
          end_date?: string | null
          id?: string
          leads?: number
          platform: Database["public"]["Enums"]["platform_type"]
          reach?: number
          spent?: number
          start_date?: string
          status?: string
          type: Database["public"]["Enums"]["ad_type"]
          updated_at?: string
        }
        Update: {
          brief_id?: string
          budget?: number
          client_id?: string
          created_at?: string
          ctr?: number
          end_date?: string | null
          id?: string
          leads?: number
          platform?: Database["public"]["Enums"]["platform_type"]
          reach?: number
          spent?: number
          start_date?: string
          status?: string
          type?: Database["public"]["Enums"]["ad_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ads_brief_id_fkey"
            columns: ["brief_id"]
            isOneToOne: false
            referencedRelation: "briefs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ads_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          new_data: Json | null
          old_data: Json | null
          record_id: string | null
          table_name: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      briefs: {
        Row: {
          budget: number | null
          client_id: string
          created_at: string
          created_by: string
          deadline: string
          id: string
          objective: string
          platforms: Database["public"]["Enums"]["platform_type"][]
          priority: Database["public"]["Enums"]["priority_level"]
          status: Database["public"]["Enums"]["task_status"]
          target_audience: string | null
          title: string
          updated_at: string
        }
        Insert: {
          budget?: number | null
          client_id: string
          created_at?: string
          created_by: string
          deadline: string
          id?: string
          objective: string
          platforms?: Database["public"]["Enums"]["platform_type"][]
          priority?: Database["public"]["Enums"]["priority_level"]
          status?: Database["public"]["Enums"]["task_status"]
          target_audience?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          budget?: number | null
          client_id?: string
          created_at?: string
          created_by?: string
          deadline?: string
          id?: string
          objective?: string
          platforms?: Database["public"]["Enums"]["platform_type"][]
          priority?: Database["public"]["Enums"]["priority_level"]
          status?: Database["public"]["Enums"]["task_status"]
          target_audience?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "briefs_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          created_at: string
          id: string
          industry: string
          is_active: boolean
          logo_url: string | null
          monthly_budget: number
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          industry: string
          is_active?: boolean
          logo_url?: string | null
          monthly_budget?: number
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          industry?: string
          is_active?: boolean
          logo_url?: string | null
          monthly_budget?: number
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      meeting_decisions: {
        Row: {
          created_at: string
          description: string
          due_date: string | null
          id: string
          meeting_id: string
          owner_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          due_date?: string | null
          id?: string
          meeting_id: string
          owner_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          due_date?: string | null
          id?: string
          meeting_id?: string
          owner_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "meeting_decisions_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
        ]
      }
      meetings: {
        Row: {
          created_at: string
          created_by: string
          id: string
          meeting_date: string
          notes: string | null
          title: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          meeting_date: string
          notes?: string | null
          title: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          meeting_date?: string
          notes?: string | null
          title?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      qc_checklists: {
        Row: {
          brand_tone: boolean
          client_priority_met: boolean
          comments: string | null
          created_at: string
          cta_alignment: boolean
          grammar_clarity: boolean
          id: string
          is_approved: boolean | null
          platform_guidelines: boolean
          reviewed_at: string | null
          reviewer_id: string
          task_id: string
        }
        Insert: {
          brand_tone?: boolean
          client_priority_met?: boolean
          comments?: string | null
          created_at?: string
          cta_alignment?: boolean
          grammar_clarity?: boolean
          id?: string
          is_approved?: boolean | null
          platform_guidelines?: boolean
          reviewed_at?: string | null
          reviewer_id: string
          task_id: string
        }
        Update: {
          brand_tone?: boolean
          client_priority_met?: boolean
          comments?: string | null
          created_at?: string
          cta_alignment?: boolean
          grammar_clarity?: boolean
          id?: string
          is_approved?: boolean | null
          platform_guidelines?: boolean
          reviewed_at?: string | null
          reviewer_id?: string
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "qc_checklists_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: true
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      task_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          task_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          task_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          task_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_comments_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assignee_id: string | null
          brief_id: string
          created_at: string
          deadline: string
          description: string | null
          id: string
          priority: Database["public"]["Enums"]["priority_level"]
          status: Database["public"]["Enums"]["task_status"]
          type: Database["public"]["Enums"]["task_type"]
          updated_at: string
        }
        Insert: {
          assignee_id?: string | null
          brief_id: string
          created_at?: string
          deadline: string
          description?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["priority_level"]
          status?: Database["public"]["Enums"]["task_status"]
          type: Database["public"]["Enums"]["task_type"]
          updated_at?: string
        }
        Update: {
          assignee_id?: string | null
          brief_id?: string
          created_at?: string
          deadline?: string
          description?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["priority_level"]
          status?: Database["public"]["Enums"]["task_status"]
          type?: Database["public"]["Enums"]["task_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_brief_id_fkey"
            columns: ["brief_id"]
            isOneToOne: false
            referencedRelation: "briefs"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      ad_type: "awareness" | "lead_generation"
      app_role:
        | "admin"
        | "dm_manager"
        | "copywriter"
        | "copy_qc"
        | "designer"
        | "design_qc"
        | "client_coordinator"
        | "dm_team_lead"
      platform_type:
        | "facebook"
        | "instagram"
        | "linkedin"
        | "twitter"
        | "google_ads"
        | "youtube"
      priority_level: "low" | "normal" | "high" | "critical"
      task_status:
        | "draft"
        | "pending"
        | "in_progress"
        | "review"
        | "approved"
        | "rejected"
        | "client_review"
        | "published"
      task_type:
        | "copy"
        | "design"
        | "copy_qc"
        | "design_qc"
        | "client_review"
        | "publishing"
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
      ad_type: ["awareness", "lead_generation"],
      app_role: [
        "admin",
        "dm_manager",
        "copywriter",
        "copy_qc",
        "designer",
        "design_qc",
        "client_coordinator",
        "dm_team_lead",
      ],
      platform_type: [
        "facebook",
        "instagram",
        "linkedin",
        "twitter",
        "google_ads",
        "youtube",
      ],
      priority_level: ["low", "normal", "high", "critical"],
      task_status: [
        "draft",
        "pending",
        "in_progress",
        "review",
        "approved",
        "rejected",
        "client_review",
        "published",
      ],
      task_type: [
        "copy",
        "design",
        "copy_qc",
        "design_qc",
        "client_review",
        "publishing",
      ],
    },
  },
} as const
