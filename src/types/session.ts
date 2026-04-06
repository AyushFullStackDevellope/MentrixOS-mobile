export type User = {
  id: number;
  full_name: string;
  email: string;
};

export type InstituteRole = {
  role_id: number;
  role_name: string;
};

export type Institute = {
  tenant_id: number;
  institute_id: number;
  institute_name: string;
  city: string;
  state: string;
  type: string;
  logo?: string | null;
  roles: InstituteRole[];
};

export type ContextSelectionResponse = {
  access_token: string;
  selected_context?: unknown;
};
