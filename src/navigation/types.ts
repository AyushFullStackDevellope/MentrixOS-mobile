import { Institute, InstituteRole } from '../types/session';

export type AppStackParamList = {
  Institute: undefined;
  Role: { selectedInstitute: Institute };
  Dashboard: { selectedInstitute: Institute; selectedRole: InstituteRole };
};

export type RootStackParamList = {
  Login: undefined;
  App: undefined;
};
