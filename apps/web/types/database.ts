export type Database = {
  PostgrestVersion: "12"
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          clerk_id: string
          email: string
          display_name: string | null
          preferred_languages: string[]
          review_reminder_time: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          clerk_id: string
          email: string
          display_name?: string | null
          preferred_languages?: string[]
          review_reminder_time?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          clerk_id?: string
          email?: string
          display_name?: string | null
          preferred_languages?: string[]
          review_reminder_time?: string
          updated_at?: string
        }
      }
      snippets: {
        Row: {
          id: string
          user_id: string
          title: string
          code: string | null
          description: string | null
          language: string
          tags: string[]
          ease_factor: number
          interval_days: number
          repetitions: number
          next_review: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          code?: string | null
          description?: string | null
          language?: string
          tags?: string[]
          ease_factor?: number
          interval_days?: number
          repetitions?: number
          next_review?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          code?: string | null
          description?: string | null
          language?: string
          tags?: string[]
          ease_factor?: number
          interval_days?: number
          repetitions?: number
          next_review?: string
          updated_at?: string
        }
      }
      review_logs: {
        Row: {
          id: string
          snippet_id: string
          user_id: string
          rating: number
          ease_factor_after: number
          interval_after: number
          reviewed_at: string
        }
        Insert: {
          id?: string
          snippet_id: string
          user_id: string
          rating: number
          ease_factor_after: number
          interval_after: number
          reviewed_at?: string
        }
        Update: {
          id?: string
          snippet_id?: string
          user_id?: string
          rating?: number
          ease_factor_after?: number
          interval_after?: number
          reviewed_at?: string
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
