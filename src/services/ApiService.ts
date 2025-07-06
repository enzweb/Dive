const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // === UTILISATEURS ===
  
  async getUsers(search?: string) {
    const params = search ? `?search=${encodeURIComponent(search)}` : '';
    return this.request(`/users${params}`);
  }

  async getUserById(id: string) {
    return this.request(`/users/${id}`);
  }

  async createUser(user: any) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  }

  async updateUser(id: string, updates: any) {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteUser(id: string) {
    return this.request(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // === ÉQUIPEMENTS ===

  async getAssets(search?: string, status?: string, category?: string) {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (status && status !== 'all') params.append('status', status);
    if (category && category !== 'all') params.append('category', category);
    
    const queryString = params.toString();
    return this.request(`/assets${queryString ? `?${queryString}` : ''}`);
  }

  async getAssetById(id: string) {
    return this.request(`/assets/${id}`);
  }

  async createAsset(asset: any) {
    return this.request('/assets', {
      method: 'POST',
      body: JSON.stringify(asset),
    });
  }

  async updateAsset(id: string, updates: any) {
    return this.request(`/assets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // === MOUVEMENTS ===

  async getMovements(search?: string, type?: string, limit?: number) {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (type && type !== 'all') params.append('type', type);
    if (limit) params.append('limit', limit.toString());
    
    const queryString = params.toString();
    return this.request(`/movements${queryString ? `?${queryString}` : ''}`);
  }

  async createMovement(movement: any) {
    return this.request('/movements', {
      method: 'POST',
      body: JSON.stringify(movement),
    });
  }

  // === QR CODE ===

  async getUserByQrCode(qrCode: string) {
    return this.request(`/qr/user/${qrCode}`);
  }

  async getAssetByQrCode(qrCode: string) {
    return this.request(`/qr/asset/${qrCode}`);
  }

  // === CHECKOUT/CHECKIN ===

  async checkout(data: {
    assetId: string;
    userId: string;
    performedBy: string;
    notes?: string;
  }) {
    return this.request('/checkout', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async checkin(data: {
    assetId: string;
    userId: string;
    performedBy: string;
    notes?: string;
    hasIssues?: boolean;
    issueDescription?: string;
  }) {
    return this.request('/checkin', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // === STATISTIQUES ===

  async getStats() {
    return this.request('/stats');
  }

  // === SANTÉ DU SERVEUR ===

  async getHealth() {
    return this.request('/health');
  }
}

export const apiService = new ApiService();