import React, { createContext, useEffect, useState } from "react";
import {
  clearSession,
  getAccessToken,
  getSelectedInstitute,
  getSelectedRole,
  getUser,
  getInstitutes,
  saveAccessToken,
  savePreContextToken,
  saveUser,
  saveInstitutes,
  saveSelectedInstitute,
  saveSelectedRole,
} from "../services/authStorage";
import type { Institute, InstituteRole, User } from "../types/session";

type AuthContextType = {
  isLoading: boolean;
  accessToken: string | null;
  preContextToken: string | null;
  user: User | null;
  institutes: Institute[];
  selectedInstitute: Institute | null;
  selectedRole: InstituteRole | null;

  // Called after a successful /auth/login + /auth/my-institutes-roles
  handleLoginSuccess: (params: {
    preContextToken: string;
    user: User;
    institutes: Institute[];
  }) => Promise<void>;

  // Called after a successful /auth/select-context
  handleContextSelectionSuccess: (params: {
    accessToken: string;
    selectedInstitute: Institute;
    selectedRole: InstituteRole;
  }) => Promise<void>;

  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [preContextToken, setPreContextToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [selectedInstitute, setSelectedInstitute] = useState<Institute | null>(null);
  const [selectedRole, setSelectedRole] = useState<InstituteRole | null>(null);

  // On mount: try to restore an existing session (access token, user, selection, etc.)
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const storedToken = await getAccessToken();
        if (storedToken) {
          setAccessToken(storedToken);
          
          // Restore user profile and institute data
          const [storedUser, storedInstitutes, inst, role] = await Promise.all([
            getUser(),
            getInstitutes(),
            getSelectedInstitute(),
            getSelectedRole(),
          ]);

          if (storedUser) setUser(storedUser);
          if (storedInstitutes) setInstitutes(storedInstitutes);
          if (inst) setSelectedInstitute(inst);
          if (role) setSelectedRole(role);
        }
      } catch (err) {
        console.log("Session restore error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    restoreSession();
  }, []);

  // Step 1: Login success — save pre-context token, user, institutes in memory + storage
  const handleLoginSuccess = async (params: {
    preContextToken: string;
    user: User;
    institutes: Institute[];
  }) => {
    setPreContextToken(params.preContextToken);
    setUser(params.user);
    setInstitutes(params.institutes);

    await savePreContextToken(params.preContextToken);
    await saveUser(params.user);
    await saveInstitutes(params.institutes);
  };

  // Step 2: Context selection success — save final access token + selection
  const handleContextSelectionSuccess = async (params: {
    accessToken: string;
    selectedInstitute: Institute;
    selectedRole: InstituteRole;
  }) => {
    setAccessToken(params.accessToken);
    setSelectedInstitute(params.selectedInstitute);
    setSelectedRole(params.selectedRole);

    await saveAccessToken(params.accessToken);
    await saveSelectedInstitute(params.selectedInstitute);
    await saveSelectedRole(params.selectedRole);
  };

  // Logout: clear all state and storage
  const logout = async () => {
    setAccessToken(null);
    setPreContextToken(null);
    setUser(null);
    setInstitutes([]);
    setSelectedInstitute(null);
    setSelectedRole(null);
    await clearSession();
  };

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        accessToken,
        preContextToken,
        user,
        institutes,
        selectedInstitute,
        selectedRole,
        handleLoginSuccess,
        handleContextSelectionSuccess,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
