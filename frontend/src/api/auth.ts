import { apiRequest } from "./client";

export interface UserProfile { partner_name: string; }
export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  profile: UserProfile;
}
export interface LoginCredentials { username: string; password: string; }
export interface RegisterCredentials extends LoginCredentials {
  email: string;
  password_repeat: string;
}
export async function initializeCsrf(): Promise<void> {
  await apiRequest("/auth/csrf/");
}
export function login(credentials: LoginCredentials): Promise<User> {
  return apiRequest("/auth/login/", { method: "POST", body: JSON.stringify(credentials) });
}
export async function register(credentials: RegisterCredentials): Promise<void> {
  await apiRequest("/auth/register/", { method: "POST", body: JSON.stringify(credentials) });
}
export function getCurrentUser(): Promise<User> { return apiRequest("/auth/me/"); }
export async function logout(): Promise<void> {
  await apiRequest("/auth/logout/", { method: "POST" });
}
