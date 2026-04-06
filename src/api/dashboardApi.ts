import apiClient from './client';

export interface DashboardStats {
  id: string;
  title: string;
  value: string;
  color: string;
  trend?: 'up' | 'down' | 'neutral';
}

export interface DashboardData {
  stats: DashboardStats[];
  activities: any[];
  quickActions: string[];
}

export const dashboardApi = {
  getOverview: async (): Promise<DashboardData> => {
    const response = await apiClient.get<DashboardData>('/dashboard/overview');
    return response.data;
  }
};
