export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      members: {
        Row: {
          id: string
          user_id: string
          name: string
          email: string | null
          phone: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          email?: string | null
          phone?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          email?: string | null
          phone?: string | null
          created_at?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          event_date: string
          location: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          event_date: string
          location?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          event_date?: string
          location?: string | null
          created_at?: string
        }
        Relationships: []
      }
      event_attendance: {
        Row: {
          id: string
          event_id: string
          member_id: string
          user_id: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          event_id: string
          member_id: string
          user_id: string
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          member_id?: string
          user_id?: string
          status?: string
          created_at?: string
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
  }
}
