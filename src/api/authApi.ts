import { apiRequest } from "./client";
import type { ContextSelectionResponse, Institute, User } from "../types/session";

// ── 1. POST /auth/login ────────────────────────────────────────────────────
export async function loginUser(email: string, password: string) {
  const data = await apiRequest<{ pre_context_token: string; user: User }>("/auth/login", {
    method: "POST",
    body: { email, password },
  });
  // Returns: { pre_context_token, user }
  return data;
}

// ── 2. GET /auth/my-institutes-roles ──────────────────────────────────────
export async function getMyInstitutesAndRoles(preContextToken: string) {
  const data = await apiRequest<Institute[]>("/auth/my-institutes-roles", {
    method: "GET",
    token: preContextToken,
  });
  // Returns: [ { tenant_id, institute_id, institute_name, type, city, state, logo, roles[] } ]
  return data;
}

// ── 3. POST /auth/select-context ──────────────────────────────────────────
export async function selectUserContext(
  preContextToken: string,
  body: { tenant_id: number; institute_id: number; role_id: number }
) {
  const data = await apiRequest<ContextSelectionResponse>("/auth/select-context", {
    method: "POST",
    token: preContextToken,
    body,
  });
  // Returns: { access_token, selected_context }
  return data;
}
