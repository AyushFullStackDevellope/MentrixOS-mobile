import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "../constants/storageKeys";
import type { Institute, InstituteRole, User } from "../types/session";

const parseStoredJson = <T>(value: string | null, fallback: T): T => {
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
  await AsyncStorage.setItem(STORAGE_KEYS.PRE_CONTEXT_TOKEN, token);
};

export const getPreContextToken = async () => {
  return await AsyncStorage.getItem(STORAGE_KEYS.PRE_CONTEXT_TOKEN);
};

export const saveAccessToken = async (token: string) => {
  await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
};

export const getAccessToken = async () => {
  return await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
};

export const saveUser = async (user: User) => {
  await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

export const getUser = async (): Promise<User | null> => {
  const value = await AsyncStorage.getItem(STORAGE_KEYS.USER);
  return parseStoredJson<User | null>(value, null);
};

export const saveInstitutes = async (institutes: Institute[]) => {
  await AsyncStorage.setItem(STORAGE_KEYS.INSTITUTES, JSON.stringify(institutes));
};

export const getInstitutes = async (): Promise<Institute[]> => {
  const value = await AsyncStorage.getItem(STORAGE_KEYS.INSTITUTES);
  return parseStoredJson<Institute[]>(value, []);
};

export const saveSelectedInstitute = async (institute: Institute) => {
  await AsyncStorage.setItem(STORAGE_KEYS.SELECTED_INSTITUTE, JSON.stringify(institute));
};

export const getSelectedInstitute = async (): Promise<Institute | null> => {
  const value = await AsyncStorage.getItem(STORAGE_KEYS.SELECTED_INSTITUTE);
  return parseStoredJson<Institute | null>(value, null);
};

export const saveSelectedRole = async (role: InstituteRole) => {
  await AsyncStorage.setItem(STORAGE_KEYS.SELECTED_ROLE, JSON.stringify(role));
};

export const getSelectedRole = async (): Promise<InstituteRole | null> => {
  const value = await AsyncStorage.getItem(STORAGE_KEYS.SELECTED_ROLE);
  return parseStoredJson<InstituteRole | null>(value, null);
};

export const clearSession = async () => {
  await Promise.all([
    AsyncStorage.removeItem(STORAGE_KEYS.PRE_CONTEXT_TOKEN),
    AsyncStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN),
    AsyncStorage.removeItem(STORAGE_KEYS.USER),
    AsyncStorage.removeItem(STORAGE_KEYS.INSTITUTES),
    AsyncStorage.removeItem(STORAGE_KEYS.SELECTED_INSTITUTE),
    AsyncStorage.removeItem(STORAGE_KEYS.SELECTED_ROLE),
  ]);
};
