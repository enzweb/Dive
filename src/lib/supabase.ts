import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let supabase: any;

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'your-project-url.supabase.co' || supabaseAnonKey === 'your-anon-key') {
  console.warn('Variables d\'environnement Supabase manquantes ou non configurées. Utilisation des données de démonstration.');
  // Create a dummy client to prevent errors
  supabase = {
    from: () => ({
      select: () => ({ data: [], error: null }),
      insert: () => ({ data: null, error: new Error('Supabase non configuré') }),
      update: () => ({ data: null, error: new Error('Supabase non configuré') }),
      delete: () => ({ error: new Error('Supabase non configuré') })
    })
  };
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };

// Types générés automatiquement par Supabase
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          license_number: string | null;
          certification_level: string;
          role: 'admin' | 'manager' | 'user';
          qr_code: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          license_number?: string | null;
          certification_level: string;
          role?: 'admin' | 'manager' | 'user';
          qr_code: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          license_number?: string | null;
          certification_level?: string;
          role?: 'admin' | 'manager' | 'user';
          qr_code?: string;
          is_active?: boolean;
          updated_at?: string;
        };
      };
      assets: {
        Row: {
          id: string;
          name: string;
          serial_number: string;
          asset_tag: string;
          category: string;
          model: string | null;
          manufacturer: string | null;
          status: 'available' | 'checked_out' | 'maintenance' | 'retired' | 'defective';
          assigned_to_user_id: string | null;
          location: string;
          notes: string | null;
          has_issues: boolean;
          issue_count: number;
          last_issue_date: string | null;
          qr_code: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          serial_number: string;
          asset_tag: string;
          category: string;
          model?: string | null;
          manufacturer?: string | null;
          status?: 'available' | 'checked_out' | 'maintenance' | 'retired' | 'defective';
          assigned_to_user_id?: string | null;
          location: string;
          notes?: string | null;
          has_issues?: boolean;
          issue_count?: number;
          last_issue_date?: string | null;
          qr_code: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          serial_number?: string;
          asset_tag?: string;
          category?: string;
          model?: string | null;
          manufacturer?: string | null;
          status?: 'available' | 'checked_out' | 'maintenance' | 'retired' | 'defective';
          assigned_to_user_id?: string | null;
          location?: string;
          notes?: string | null;
          has_issues?: boolean;
          issue_count?: number;
          last_issue_date?: string | null;
          qr_code?: string;
          updated_at?: string;
        };
      };
      movements: {
        Row: {
          id: string;
          asset_id: string;
          user_id: string;
          type: 'checkout' | 'checkin' | 'maintenance' | 'retired';
          date: string;
          notes: string | null;
          performed_by: string;
          has_issues: boolean;
          issue_description: string | null;
          method: 'manual' | 'qr_scan';
        };
        Insert: {
          id?: string;
          asset_id: string;
          user_id: string;
          type: 'checkout' | 'checkin' | 'maintenance' | 'retired';
          date?: string;
          notes?: string | null;
          performed_by: string;
          has_issues?: boolean;
          issue_description?: string | null;
          method: 'manual' | 'qr_scan';
        };
        Update: {
          id?: string;
          asset_id?: string;
          user_id?: string;
          type?: 'checkout' | 'checkin' | 'maintenance' | 'retired';
          date?: string;
          notes?: string | null;
          performed_by?: string;
          has_issues?: boolean;
          issue_description?: string | null;
          method?: 'manual' | 'qr_scan';
        };
      };
      issues: {
        Row: {
          id: string;
          asset_id: string;
          title: string;
          description: string;
          severity: 'low' | 'medium' | 'high' | 'critical';
          status: 'open' | 'in_progress' | 'resolved' | 'closed';
          reported_by: string;
          reported_at: string;
          assigned_to: string | null;
          resolved_at: string | null;
          resolved_by: string | null;
          resolution: string | null;
        };
        Insert: {
          id?: string;
          asset_id: string;
          title: string;
          description: string;
          severity?: 'low' | 'medium' | 'high' | 'critical';
          status?: 'open' | 'in_progress' | 'resolved' | 'closed';
          reported_by: string;
          reported_at?: string;
          assigned_to?: string | null;
          resolved_at?: string | null;
          resolved_by?: string | null;
          resolution?: string | null;
        };
        Update: {
          id?: string;
          asset_id?: string;
          title?: string;
          description?: string;
          severity?: 'low' | 'medium' | 'high' | 'critical';
          status?: 'open' | 'in_progress' | 'resolved' | 'closed';
          reported_by?: string;
          reported_at?: string;
          assigned_to?: string | null;
          resolved_at?: string | null;
          resolved_by?: string | null;
          resolution?: string | null;
        };
      };
      notifications: {
        Row: {
          id: string;
          type: 'issue' | 'maintenance' | 'warning' | 'info';
          title: string;
          message: string;
          asset_id: string | null;
          severity: 'low' | 'medium' | 'high' | 'critical';
          is_read: boolean;
          created_at: string;
          created_by: string;
          resolved_at: string | null;
          resolved_by: string | null;
        };
        Insert: {
          id?: string;
          type: 'issue' | 'maintenance' | 'warning' | 'info';
          title: string;
          message: string;
          asset_id?: string | null;
          severity?: 'low' | 'medium' | 'high' | 'critical';
          is_read?: boolean;
          created_at?: string;
          created_by: string;
          resolved_at?: string | null;
          resolved_by?: string | null;
        };
        Update: {
          id?: string;
          type?: 'issue' | 'maintenance' | 'warning' | 'info';
          title?: string;
          message?: string;
          asset_id?: string | null;
          severity?: 'low' | 'medium' | 'high' | 'critical';
          is_read?: boolean;
          created_at?: string;
          created_by?: string;
          resolved_at?: string | null;
          resolved_by?: string | null;
        };
      };
    };
  };
};