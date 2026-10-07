// Mirrors supabase/migrations/20261007000000_init.sql.
// Regenerate with:
//   npx supabase gen types typescript --project-id <ref> --schema public > src/types/database.ts

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type PublishStatus = "draft" | "published";

export type Database = {
  public: {
    Tables: {
      admins: {
        Row: { user_id: string; email: string; created_at: string };
        Insert: { user_id: string; email: string; created_at?: string };
        Update: { user_id?: string; email?: string; created_at?: string };
        Relationships: [];
      };
      events: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string | null;
          description: string | null;
          event_date: string;
          start_time: string | null;
          end_time: string | null;
          venue: string | null;
          address: string | null;
          map_link: string | null;
          cover_image_url: string | null;
          status: PublishStatus;
          featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          excerpt?: string | null;
          description?: string | null;
          event_date: string;
          start_time?: string | null;
          end_time?: string | null;
          venue?: string | null;
          address?: string | null;
          map_link?: string | null;
          cover_image_url?: string | null;
          status?: PublishStatus;
          featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["events"]["Insert"]>;
        Relationships: [];
      };
      posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string | null;
          body: string | null;
          cover_image_url: string | null;
          category: string | null;
          author: string | null;
          publish_date: string;
          status: PublishStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          excerpt?: string | null;
          body?: string | null;
          cover_image_url?: string | null;
          category?: string | null;
          author?: string | null;
          publish_date?: string;
          status?: PublishStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["posts"]["Insert"]>;
        Relationships: [];
      };
      messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          subject: string | null;
          message: string;
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string | null;
          subject?: string | null;
          message: string;
          read?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["messages"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: {
      is_admin: { Args: Record<PropertyKey, never>; Returns: boolean };
    };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};

export type EventRow = Database["public"]["Tables"]["events"]["Row"];
export type PostRow = Database["public"]["Tables"]["posts"]["Row"];
export type MessageRow = Database["public"]["Tables"]["messages"]["Row"];
