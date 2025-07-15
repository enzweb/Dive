import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type User = Database['public']['Tables']['users']['Row'];
type Asset = Database['public']['Tables']['assets']['Row'];
type Movement = Database['public']['Tables']['movements']['Row'];
type Issue = Database['public']['Tables']['issues']['Row'];
type Notification = Database['public']['Tables']['notifications']['Row'];

export class SupabaseService {
  // === UTILISATEURS ===
  
  async getUsers(search?: string) {
    let query = supabase
      .from('users')
      .select('*')
      .order('name');
    
    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  async getUserById(id: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  async getUserByQrCode(qrCode: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('qr_code', qrCode)
      .single();
    
    if (error) throw error;
    return data;
  }

  async createUser(user: Database['public']['Tables']['users']['Insert']) {
    const { data, error } = await supabase
      .from('users')
      .insert(user)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateUser(id: string, updates: Database['public']['Tables']['users']['Update']) {
    const { data, error } = await supabase
      .from('users')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async deleteUser(id: string) {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // === ÉQUIPEMENTS ===

  async getAssets(search?: string, status?: string, category?: string) {
    let query = supabase
      .from('assets')
      .select(`
        *,
        assigned_user:users(name)
      `)
      .order('name');
    
    if (search) {
      query = query.or(`name.ilike.%${search}%,asset_tag.ilike.%${search}%,serial_number.ilike.%${search}%`);
    }
    
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }
    
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    
    // Transformer les données pour correspondre au format attendu
    return data.map(asset => ({
      ...asset,
      assignedTo: asset.assigned_user?.name || null
    }));
  }

  async getAssetById(id: string) {
    const { data, error } = await supabase
      .from('assets')
      .select(`
        *,
        assigned_user:users(name)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return {
      ...data,
      assignedTo: data.assigned_user?.name || null
    };
  }

  async getAssetByQrCode(qrCode: string) {
    const { data, error } = await supabase
      .from('assets')
      .select(`
        *,
        assigned_user:users(name)
      `)
      .eq('qr_code', qrCode)
      .single();
    
    if (error) throw error;
    return {
      ...data,
      assignedTo: data.assigned_user?.name || null
    };
  }

  async createAsset(asset: Database['public']['Tables']['assets']['Insert']) {
    const { data, error } = await supabase
      .from('assets')
      .insert(asset)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateAsset(id: string, updates: Database['public']['Tables']['assets']['Update']) {
    const { data, error } = await supabase
      .from('assets')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // === MOUVEMENTS ===

  async getMovements(search?: string, type?: string, limit?: number) {
    let query = supabase
      .from('movements')
      .select(`
        *,
        asset:assets(name),
        user:users(name)
      `)
      .order('date', { ascending: false });
    
    if (search) {
      query = query.or(`asset.name.ilike.%${search}%,user.name.ilike.%${search}%`);
    }
    
    if (type && type !== 'all') {
      query = query.eq('type', type);
    }
    
    if (limit) {
      query = query.limit(limit);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    
    // Transformer les données pour correspondre au format attendu
    return data.map(movement => ({
      ...movement,
      assetName: movement.asset?.name || 'Équipement supprimé',
      userName: movement.user?.name || 'Utilisateur supprimé'
    }));
  }

  async createMovement(movement: Database['public']['Tables']['movements']['Insert']) {
    const { data, error } = await supabase
      .from('movements')
      .insert(movement)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // === CHECKOUT/CHECKIN ===

  async checkout(data: {
    assetId: string;
    userId: string;
    performedBy: string;
    notes?: string;
  }) {
    // Vérifier que l'équipement est disponible
    const asset = await this.getAssetById(data.assetId);
    if (asset.status !== 'available') {
      throw new Error('Équipement non disponible');
    }

    // Transaction : créer le mouvement et mettre à jour l'équipement
    const { data: movement, error: movementError } = await supabase
      .from('movements')
      .insert({
        asset_id: data.assetId,
        user_id: data.userId,
        type: 'checkout',
        performed_by: data.performedBy,
        notes: data.notes,
        method: 'qr_scan'
      })
      .select()
      .single();

    if (movementError) throw movementError;

    // Mettre à jour le statut de l'équipement
    await this.updateAsset(data.assetId, {
      status: 'checked_out',
      assigned_to_user_id: data.userId
    });

    return movement;
  }

  async checkin(data: {
    assetId: string;
    userId: string;
    performedBy: string;
    notes?: string;
    hasIssues?: boolean;
    issueDescription?: string;
  }) {
    // Créer le mouvement
    const { data: movement, error: movementError } = await supabase
      .from('movements')
      .insert({
        asset_id: data.assetId,
        user_id: data.userId,
        type: 'checkin',
        performed_by: data.performedBy,
        notes: data.notes,
        has_issues: data.hasIssues || false,
        issue_description: data.issueDescription,
        method: 'qr_scan'
      })
      .select()
      .single();

    if (movementError) throw movementError;

    // Mettre à jour le statut de l'équipement
    const newStatus = data.hasIssues ? 'defective' : 'available';
    await this.updateAsset(data.assetId, {
      status: newStatus,
      assigned_to_user_id: null,
      has_issues: data.hasIssues || false,
      issue_count: data.hasIssues ? 1 : 0,
      last_issue_date: data.hasIssues ? new Date().toISOString() : null
    });

    // Créer un problème si nécessaire
    if (data.hasIssues && data.issueDescription) {
      await supabase
        .from('issues')
        .insert({
          asset_id: data.assetId,
          title: 'Problème signalé lors du retour',
          description: data.issueDescription,
          severity: 'medium',
          reported_by: data.performedBy
        });
    }

    return movement;
  }

  // === STATISTIQUES ===

  async getStats() {
    // Compter les équipements par statut
    const { data: assetStats } = await supabase
      .from('assets')
      .select('status')
      .then(({ data }) => {
        const stats = {
          totalAssets: data?.length || 0,
          availableAssets: data?.filter(a => a.status === 'available').length || 0,
          checkedOutAssets: data?.filter(a => a.status === 'checked_out').length || 0,
          maintenanceAssets: data?.filter(a => a.status === 'maintenance').length || 0,
          retiredAssets: data?.filter(a => a.status === 'retired').length || 0,
          defectiveAssets: data?.filter(a => a.status === 'defective').length || 0
        };
        return { data: stats };
      });

    // Compter les utilisateurs actifs
    const { count: activeUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    // Mouvements récents
    const recentMovements = await this.getMovements(undefined, undefined, 5);

    // Notifications non lues
    const { count: unreadNotifications } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('is_read', false);

    // Problèmes ouverts
    const { count: openIssues } = await supabase
      .from('issues')
      .select('*', { count: 'exact', head: true })
      .in('status', ['open', 'in_progress']);

    const { count: criticalIssues } = await supabase
      .from('issues')
      .select('*', { count: 'exact', head: true })
      .eq('severity', 'critical')
      .eq('status', 'open');

    return {
      ...assetStats,
      activeUsers: activeUsers || 0,
      recentMovements,
      unreadNotifications: unreadNotifications || 0,
      openIssues: openIssues || 0,
      criticalIssues: criticalIssues || 0
    };
  }

  // === PROBLÈMES ===

  async getIssues() {
    const { data, error } = await supabase
      .from('issues')
      .select(`
        *,
        asset:assets(name)
      `)
      .order('reported_at', { ascending: false });
    
    if (error) throw error;
    
    return data.map(issue => ({
      ...issue,
      assetName: issue.asset?.name || 'Équipement supprimé'
    }));
  }

  async createIssue(issue: Database['public']['Tables']['issues']['Insert']) {
    const { data, error } = await supabase
      .from('issues')
      .insert(issue)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // === NOTIFICATIONS ===

  async getNotifications() {
    const { data, error } = await supabase
      .from('notifications')
      .select(`
        *,
        asset:assets(name)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data.map(notification => ({
      ...notification,
      assetName: notification.asset?.name || null
    }));
  }

  async markNotificationAsRead(id: string) {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id);
    
    if (error) throw error;
  }
}

export const supabaseService = new SupabaseService();