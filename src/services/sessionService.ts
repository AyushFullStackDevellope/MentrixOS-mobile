import { getAccessToken, getPreContextToken, getUser, getInstitutes, getSelectedInstitute, getSelectedRole } from "./authStorage";

/** Returns the full session state from storage (for restore or debugging). */
export const getSession = async () => {
  const accessToken = await getAccessToken();
  const preContextToken = await getPreContextToken();
  const user = await getUser();
  const institutes = await getInstitutes();
  const selectedInstitute = await getSelectedInstitute();
  const selectedRole = await getSelectedRole();

  return { accessToken, preContextToken, user, institutes, selectedInstitute, selectedRole };
};