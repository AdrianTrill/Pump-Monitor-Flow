/**
 * API Client for communicating with the backend
 */
import config from './config';

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
}

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = config.api.baseUrl;
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    const requestOptions = { ...defaultOptions, ...options };

    try {
      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        const errorText = await response.text();
        return {
          error: errorText || `HTTP ${response.status}: ${response.statusText}`,
          status: response.status,
        };
      }

      const data = await response.json();

      return {
        data,
        status: response.status,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      return {
        error: errorMessage,
        status: 0,
      };
    }
  }

  // Chat API methods
  async streamChatMessage(message: string, chatHistory: any[] = []) {
    const url = `${this.baseUrl}/chat/stream`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          chat_history: chatHistory,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  async getChatSuggestions(message: string, chatHistory: any[] = []) {
    return this.request('/chat/suggestions', {
      method: 'POST',
      body: JSON.stringify({
        message,
        chat_history: chatHistory,
      }),
    });
  }

  // Pump API methods
  async getAllPumps() {
    return this.request('/pumps/');
  }

  async getPumpDetails(pumpId: string) {
    return this.request(`/pumps/${pumpId}`);
  }

  async getPumpTrends(pumpId: string) {
    return this.request(`/pumps/${pumpId}/trends`);
  }

  async searchPumps(filters: {
    location?: string;
    pump_type?: string;
    status?: string;
  }) {
    const searchParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) searchParams.append(key, value);
    });

    const query = searchParams.toString();
    return this.request(`/pumps/search/${query ? `?${query}` : ''}`);
  }

  // Dashboard API methods
  async getDashboardStats() {
    return this.request('/dashboard/stats');
  }

  async getSystemHealthTrends() {
    return this.request('/dashboard/health-trends');
  }

  async getRecentActivity() {
    return this.request('/dashboard/recent-activity');
  }

  // Alert API methods
  async getAlerts(filters: {
    status?: string;
    priority?: string;
    pump_id?: string;
  } = {}) {
    const searchParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) searchParams.append(key, value);
    });

    const query = searchParams.toString();
    return this.request(`/alerts/${query ? `?${query}` : ''}`);
  }

  async getAlertsummary() {
    return this.request('/alerts/summary');
  }

  async acknowledgeAlert(alertId: number) {
    return this.request(`/alerts/${alertId}/acknowledge`, {
      method: 'PUT',
    });
  }

  async resolveAlert(alertId: number) {
    return this.request(`/alerts/${alertId}/resolve`, {
      method: 'PUT',
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/health', {
      method: 'GET',
    });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;