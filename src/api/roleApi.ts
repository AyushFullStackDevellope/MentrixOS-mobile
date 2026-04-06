import apiClient from './client';

export interface UserRoleData {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

export const roleApi = {
  getRolesForInstitute: async (instituteId: string): Promise<UserRoleData[]> => {
    const response = await apiClient.get<UserRoleData[]>(`/institutes/${instituteId}/roles`);
    return response.data;
  },
  
  selectRole: async (roleId: string): Promise<void> => {
    await apiClient.post(`/roles/${roleId}/select`);
  }
};
