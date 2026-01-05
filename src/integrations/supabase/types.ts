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
      consultation_bookings: {
        Row: {
          consultant_name: string
          created_at: string
          duration_minutes: number
          id: string
          notes: string | null
          scheduled_at: string
          status: string
          user_id: string
        }
        Insert: {
          consultant_name: string
          created_at?: string
          duration_minutes?: number
          id?: string
          notes?: string | null
          scheduled_at: string
          status?: string
          user_id: string
        }
        Update: {
          consultant_name?: string
          created_at?: string
          duration_minutes?: number
          id?: string
          notes?: string | null
          scheduled_at?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      ielts_library: {
        Row: {
          ai_secret_context: string | null
          created_at: string
          created_by: string | null
          difficulty: string | null
          id: string
          is_active: boolean | null
          model_answer_band9: string | null
          question_image_url: string | null
          question_prompt: string
          target_keywords: string | null
          task_type: string
          title: string
          updated_at: string
        }
        Insert: {
          ai_secret_context?: string | null
          created_at?: string
          created_by?: string | null
          difficulty?: string | null
          id?: string
          is_active?: boolean | null
          model_answer_band9?: string | null
          question_image_url?: string | null
          question_prompt: string
          target_keywords?: string | null
          task_type: string
          title: string
          updated_at?: string
        }
        Update: {
          ai_secret_context?: string | null
          created_at?: string
          created_by?: string | null
          difficulty?: string | null
          id?: string
          is_active?: boolean | null
          model_answer_band9?: string | null
          question_image_url?: string | null
          question_prompt?: string
          target_keywords?: string | null
          task_type?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      listening_library: {
        Row: {
          ai_secret_context: string | null
          answer_key: Json
          audio_url: string
          created_at: string
          created_by: string | null
          difficulty: string | null
          duration_minutes: number | null
          id: string
          is_active: boolean | null
          questions: Json
          title: string
          transcript: string | null
          updated_at: string
        }
        Insert: {
          ai_secret_context?: string | null
          answer_key: Json
          audio_url: string
          created_at?: string
          created_by?: string | null
          difficulty?: string | null
          duration_minutes?: number | null
          id?: string
          is_active?: boolean | null
          questions: Json
          title: string
          transcript?: string | null
          updated_at?: string
        }
        Update: {
          ai_secret_context?: string | null
          answer_key?: Json
          audio_url?: string
          created_at?: string
          created_by?: string | null
          difficulty?: string | null
          duration_minutes?: number | null
          id?: string
          is_active?: boolean | null
          questions?: Json
          title?: string
          transcript?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      listening_submissions: {
        Row: {
          answers: Json
          band_score: number | null
          completed_at: string | null
          created_at: string
          id: string
          listening_id: string | null
          score: number | null
          total_questions: number | null
          user_id: string
        }
        Insert: {
          answers: Json
          band_score?: number | null
          completed_at?: string | null
          created_at?: string
          id?: string
          listening_id?: string | null
          score?: number | null
          total_questions?: number | null
          user_id: string
        }
        Update: {
          answers?: Json
          band_score?: number | null
          completed_at?: string | null
          created_at?: string
          id?: string
          listening_id?: string | null
          score?: number | null
          total_questions?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "listening_submissions_listening_id_fkey"
            columns: ["listening_id"]
            isOneToOne: false
            referencedRelation: "listening_library"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_verifications: {
        Row: {
          admin_notes: string | null
          amount: number
          created_at: string
          id: string
          plan_type: string
          receipt_url: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          amount: number
          created_at?: string
          id?: string
          plan_type: string
          receipt_url: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          amount?: number
          created_at?: string
          id?: string
          plan_type?: string
          receipt_url?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      practice_submissions: {
        Row: {
          ai_feedback: Json | null
          audio_url: string | null
          band_score: number | null
          coherence_cohesion_score: number | null
          content: string
          created_at: string
          grammatical_range_score: number | null
          id: string
          lexical_resource_score: number | null
          module_type: string
          task_achievement_score: number | null
          transcription: string | null
          user_id: string
        }
        Insert: {
          ai_feedback?: Json | null
          audio_url?: string | null
          band_score?: number | null
          coherence_cohesion_score?: number | null
          content: string
          created_at?: string
          grammatical_range_score?: number | null
          id?: string
          lexical_resource_score?: number | null
          module_type: string
          task_achievement_score?: number | null
          transcription?: string | null
          user_id: string
        }
        Update: {
          ai_feedback?: Json | null
          audio_url?: string | null
          band_score?: number | null
          coherence_cohesion_score?: number | null
          content?: string
          created_at?: string
          grammatical_range_score?: number | null
          id?: string
          lexical_resource_score?: number | null
          module_type?: string
          task_achievement_score?: number | null
          transcription?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          current_listening_score: number | null
          current_reading_score: number | null
          current_speaking_score: number | null
          current_writing_score: number | null
          email: string | null
          full_name: string | null
          id: string
          is_verified: boolean
          subscription_tier: Database["public"]["Enums"]["subscription_tier"]
          target_band_score: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          current_listening_score?: number | null
          current_reading_score?: number | null
          current_speaking_score?: number | null
          current_writing_score?: number | null
          email?: string | null
          full_name?: string | null
          id?: string
          is_verified?: boolean
          subscription_tier?: Database["public"]["Enums"]["subscription_tier"]
          target_band_score?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          current_listening_score?: number | null
          current_reading_score?: number | null
          current_speaking_score?: number | null
          current_writing_score?: number | null
          email?: string | null
          full_name?: string | null
          id?: string
          is_verified?: boolean
          subscription_tier?: Database["public"]["Enums"]["subscription_tier"]
          target_band_score?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
          role: Database["public"]["Enums"]["app_role"]
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
      approve_payment: {
        Args: { admin_id: string; payment_id: string }
        Returns: undefined
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      unlock_user: {
        Args: { admin_id: string; target_user_id: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      subscription_tier: "free" | "pro" | "elite"
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
      app_role: ["admin", "moderator", "user"],
      subscription_tier: ["free", "pro", "elite"],
    },
  },
} as const
