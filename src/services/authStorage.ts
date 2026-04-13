import { storage } from "./storage";
import { STORAGE_KEYS } from "../constants/storageKeys";
import type { Institute, InstituteRole, User } from "../types/session";

const parseStoredJson = <T>(value: string | undefined, fallback: T): T => {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

export const savePreContextToken = async (token: string) => {
  storage.set(STORAGE_KEYS.PRE_CONTEXT_TOKEN, token);
};

export const getPreContextToken = async () => {
  return storage.getString(STORAGE_KEYS.PRE_CONTEXT_TOKEN) || null;
};

export const saveAccessToken = async (token: string) => {
  storage.set(STORAGE_KEYS.ACCESS_TOKEN, token);
};

export const getAccessToken = async () => {
  return storage.getString(STORAGE_KEYS.ACCESS_TOKEN) || null;
};

export const saveUser = async (user: User) => {
  storage.set(STORAGE_KEYS.USER, JSON.stringify(user));
};

export const getUser = async (): Promise<User | null> => {
  const value = storage.getString(STORAGE_KEYS.USER);
  return parseStoredJson<User | null>(value, null);
};

export const saveInstitutes = async (institutes: Institute[]) => {
  storage.set(STORAGE_KEYS.INSTITUTES, JSON.stringify(institutes));
};

export const getInstitutes = async (): Promise<Institute[]> => {
  const value = storage.getString(STORAGE_KEYS.INSTITUTES);
  return parseStoredJson<Institute[]>(value, []);
};

export const saveSelectedInstitute = async (institute: Institute) => {
  storage.set(STORAGE_KEYS.SELECTED_INSTITUTE, JSON.stringify(institute));
};

export const getSelectedInstitute = async (): Promise<Institute | null> => {
  const value = storage.getString(STORAGE_KEYS.SELECTED_INSTITUTE);
  return parseStoredJson<Institute | null>(value, null);
};

export const saveSelectedRole = async (role: InstituteRole) => {
  storage.set(STORAGE_KEYS.SELECTED_ROLE, JSON.stringify(role));
};

export const getSelectedRole = async (): Promise<InstituteRole | null> => {
  const value = storage.getString(STORAGE_KEYS.SELECTED_ROLE);
  return parseStoredJson<InstituteRole | null>(value, null);
};

export const clearSession = async () => {
  storage.remove(STORAGE_KEYS.PRE_CONTEXT_TOKEN);
  storage.remove(STORAGE_KEYS.ACCESS_TOKEN);
  storage.remove(STORAGE_KEYS.USER);
  storage.remove(STORAGE_KEYS.INSTITUTES);
  storage.remove(STORAGE_KEYS.SELECTED_INSTITUTE);
  storage.remove(STORAGE_KEYS.SELECTED_ROLE);
};
