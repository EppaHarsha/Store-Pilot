import axios, { type AxiosInstance } from "axios";

const BASE_URL = "http://localhost:3001/api";

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  shopName: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UserDto {
  id: string;
  name: string;
  email: string;
  phone: string;
  shopName: string;
  role: "owner" | "staff";
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: UserDto;
}

export interface ProfileResponse {
  user: UserDto;
}

const client: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 8000
});

function authHeaders(token?: string) {
  return token
    ? {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    : {};
}

export async function registerUser(data: RegisterData): Promise<AuthResponse> {
  const res = await client.post<AuthResponse>("/auth/register", data);
  return res.data;
}

export async function loginUser(data: LoginData): Promise<AuthResponse> {
  const res = await client.post<AuthResponse>("/auth/login", data);
  return res.data;
}

export async function getProfile(token: string): Promise<ProfileResponse> {
  const res = await client.get<ProfileResponse>("/auth/profile", authHeaders(token));
  return res.data;
}

