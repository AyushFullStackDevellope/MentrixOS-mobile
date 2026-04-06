import apiClient from './client';

export interface Institute {
  id: string;
  name: string;
  location: string;
  code: string;
  type: string;
  logo?: string;
}

export const instituteApi = {
  getInstitutes: async (): Promise<Institute[]> => {
    const response = await apiClient.get<Institute[]>('/institutes');
    return response.data;
  },
  
  selectInstitute: async (id: string): Promise<void> => {
    await apiClient.post(`/institutes/${id}/select`);
  }
};
