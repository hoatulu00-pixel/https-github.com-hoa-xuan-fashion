import Cookies from "js-cookie";
import api from "./api";

const TOKEN_KEY = "hx_token";

export async function login(email: string, password: string): Promise<void> {
  const { data } = await api.post("/auth/login", { email, password });
  Cookies.set(TOKEN_KEY, data.access_token, { expires: 7, sameSite: "lax" });
}

export function logout(): void {
  Cookies.remove(TOKEN_KEY);
}

export function getToken(): string | undefined {
  return Cookies.get(TOKEN_KEY);
}

export function isLoggedIn(): boolean {
  return !!getToken();
}
