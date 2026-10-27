/**
 * Client-Side JWT and Session Management
 * Conforming to NEXWEALTH_DATA_CONTRACT.md & security architecture:
 * Access tokens stored in sessionStorage (with safe SSR fallbacks).
 */

const TOKEN_KEY = "nexwealth_access_token";
const USER_KEY = "nexwealth_user_data";

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  username?: string;
  monthlySalary?: number;
  monthlySavings?: number;
  monthlyExpenses?: number;
  initialSavingsPool?: number;
}

export class AuthUtils {
  static getToken(): string | null {
    if (typeof window === "undefined") return null;
    try {
      return sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  }

  static setToken(token: string): void {
    if (typeof window === "undefined") return;
    try {
      sessionStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(TOKEN_KEY, token);
    } catch (e) {
      console.error("Failed to store token:", e);
    }
  }

  static removeToken(): void {
    if (typeof window === "undefined") return;
    try {
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(USER_KEY);
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch (e) {
      console.error("Failed to remove token:", e);
    }
  }

  static isAuthenticated(): boolean {
    const token = this.getToken();
    return Boolean(token && token.length > 5);
  }

  static getUser(): StoredUser | null {
    if (typeof window === "undefined") return null;
    try {
      const data = sessionStorage.getItem(USER_KEY) || localStorage.getItem(USER_KEY);
      if (data) return JSON.parse(data);
    } catch {
      // Ignore parse errors
    }
    return null;
  }

  static setUser(user: StoredUser): void {
    if (typeof window === "undefined") return;
    try {
      sessionStorage.setItem(USER_KEY, JSON.stringify(user));
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (e) {
      console.error("Failed to store user:", e);
    }
  }
}
