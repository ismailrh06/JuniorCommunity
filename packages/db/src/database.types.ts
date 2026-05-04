// ============================================================
// DATABASE TYPES — Auto-générable avec: supabase gen types typescript
// Ces types seront générés automatiquement depuis Supabase
// ============================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          role: "learner" | "student" | "client" | "admin" | "mentor";
          bio: string | null;
          github_url: string | null;
          portfolio_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["profiles"]["Row"],
          "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      badges: {
        Row: {
          id: string;
          slug:
            | "html-basics"
            | "git-ready"
            | "js-starter"
            | "project-builder"
            | "verified-junior";
          name: string;
          description: string;
          icon: string;
          color: string;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["badges"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<Database["public"]["Tables"]["badges"]["Insert"]>;
      };
      user_badges: {
        Row: {
          id: string;
          user_id: string;
          badge_id: string;
          earned_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["user_badges"]["Row"],
          "id" | "earned_at"
        >;
        Update: Partial<Database["public"]["Tables"]["user_badges"]["Insert"]>;
      };
      learning_paths: {
        Row: {
          id: string;
          slug: string;
          title: string;
          description: string | null;
          icon: string | null;
          modules_count: number;
          estimated_duration: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["learning_paths"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["learning_paths"]["Insert"]
        >;
      };
      lessons: {
        Row: {
          id: string;
          path_id: string;
          title: string;
          description: string | null;
          content_mdx: string | null;
          type: "lesson" | "exercise" | "project";
          order_index: number;
          duration_minutes: number;
          level: 0 | 1 | 2 | 3 | 4;
          badge_id: string | null;
          is_premium: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["lessons"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["lessons"]["Insert"]>;
      };
      learner_profiles: {
        Row: {
          id: string;
          user_id: string;
          current_path_id: string | null;
          current_level: 0 | 1 | 2 | 3 | 4;
          xp_points: number;
          streak_days: number;
          last_active_at: string | null;
          is_premium: boolean;
          ready_junior: boolean;
          onboarding_goal: "learn" | "mission" | "portfolio" | null;
          onboarding_level: "beginner" | "some" | "experienced" | null;
          onboarding_path: string | null;
          onboarding_completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["learner_profiles"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["learner_profiles"]["Insert"]
        >;
      };
      user_progress: {
        Row: {
          id: string;
          user_id: string;
          lesson_id: string;
          status: "not_started" | "in_progress" | "completed";
          started_at: string | null;
          completed_at: string | null;
        };
        Insert: Omit<
          Database["public"]["Tables"]["user_progress"]["Row"],
          "id"
        >;
        Update: Partial<
          Database["public"]["Tables"]["user_progress"]["Insert"]
        >;
      };
      projects: {
        Row: {
          id: string;
          client_id: string;
          title: string;
          description: string;
          category: "web" | "design" | "data" | "mobile" | "other";
          difficulty: "junior" | "intermediate" | "senior";
          status: "draft" | "open" | "in_progress" | "completed" | "cancelled";
          budget_min: number;
          budget_max: number;
          duration_days: number;
          tags: string[];
          junior_only: boolean;
          is_sponsored: boolean;
          required_badge_id: string | null;
          deadline: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["projects"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["projects"]["Insert"]>;
      };
      applications: {
        Row: {
          id: string;
          project_id: string;
          applicant_id: string;
          cover_letter: string;
          proposed_budget: number;
          proposed_duration_days: number;
          status: "pending" | "viewed" | "accepted" | "rejected" | "withdrawn";
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["applications"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["applications"]["Insert"]>;
      };
      reviews: {
        Row: {
          id: string;
          project_id: string;
          reviewer_id: string;
          reviewed_id: string;
          rating: 1 | 2 | 3 | 4 | 5;
          comment: string | null;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["reviews"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<Database["public"]["Tables"]["reviews"]["Insert"]>;
      };
      payments: {
        Row: {
          id: string;
          project_id: string;
          payer_id: string;
          payee_id: string;
          amount: number;
          platform_fee: number;
          stripe_payment_intent_id: string | null;
          status:
            | "pending"
            | "processing"
            | "succeeded"
            | "failed"
            | "refunded";
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["payments"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<Database["public"]["Tables"]["payments"]["Insert"]>;
      };
      analytics_events: {
        Row: {
          id: string;
          user_id: string | null;
          session_id: string | null;
          event: string; // 'signup' | 'module_started' | 'module_completed' | 'project_applied' | 'path_started'
          properties: Record<string, unknown>;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["analytics_events"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["analytics_events"]["Insert"]
        >;
      };
    };
    Functions: {
      increment_xp: {
        Args: { p_user_id: string; p_xp?: number };
        Returns: void;
      };
      update_streak: {
        Args: { p_user_id: string };
        Returns: void;
      };
      track_event: {
        Args: {
          p_event: string;
          p_properties?: Record<string, unknown>;
          p_session_id?: string;
        };
        Returns: void;
      };
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
  };
};
