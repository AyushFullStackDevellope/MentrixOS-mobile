import { UserRole } from '../types/auth';

/**
 * Utility to determine the next screen in the application flow
 * based on user state and role
 */
export const getNextScreen = (
  isAuthenticated: boolean,
  hasSelectedInstitute: boolean,
  hasSelectedRole: boolean,
  userRole?: UserRole
) => {
  if (!isAuthenticated) return 'Login';
  if (!hasSelectedInstitute) return 'InstituteSelection';
  if (!hasSelectedRole) return 'RoleSelection';
  
  // Custom role-based logic could be added here
  return 'Dashboard';
};

export const canAccessScreen = (
  screenName: string,
  isAuthenticated: boolean,
  userRole?: UserRole
) => {
  const protectedScreens = ['InstituteSelection', 'RoleSelection', 'Dashboard'];
  
  if (protectedScreens.includes(screenName) && !isAuthenticated) {
    return false;
  }
  
  return true;
};
