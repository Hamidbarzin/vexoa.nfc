import { useState, useEffect } from "react";

interface AuthState {
  userId: number | null;
  ownerId: number | null;
  name: string | null;
  email: string | null;
  role: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const emptyAuth: AuthState = {
  userId: null,
  ownerId: null,
  name: null,
  email: null,
  role: null,
  isLoading: true,
  isAuthenticated: false,
};

let _authState: AuthState = { ...emptyAuth };
const _listeners = new Set<() => void>();

function notify() {
  _listeners.forEach((fn) => fn());
}

export function setAuthFromSession(data: {
  userId: number;
  ownerId?: number | null;
  email: string;
  name: string;
  role: string;
}): void {
  _authState = {
    userId: data.userId,
    ownerId: data.ownerId ?? null,
    name: data.name,
    email: data.email,
    role: data.role,
    isLoading: false,
    isAuthenticated: true,
  };
  notify();
}

export async function checkAuth(): Promise<AuthState> {
  try {
    const res = await fetch("/api/auth/session", { credentials: "include" });
    if (res.ok) {
      const data = await res.json();
      _authState = {
        userId: data.userId,
        ownerId: data.ownerId ?? null,
        name: data.name,
        email: data.email,
        role: data.role,
        isLoading: false,
        isAuthenticated: true,
      };
    } else {
      _authState = { ...emptyAuth, isLoading: false, isAuthenticated: false };
    }
  } catch {
    _authState = { ...emptyAuth, isLoading: false, isAuthenticated: false };
  }
  notify();
  return _authState;
}

export async function loginUser(
  email: string,
  password: string,
): Promise<{ ok: boolean; error?: string; role?: string }> {
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      _authState = {
        userId: data.userId,
        ownerId: data.ownerId ?? null,
        name: data.name,
        email: data.email,
        role: data.role,
        isLoading: false,
        isAuthenticated: true,
      };
      notify();
      return { ok: true, role: data.role };
    }
    return { ok: false, error: data.error || "Login failed" };
  } catch {
    return { ok: false, error: "Network error" };
  }
}

export async function logoutUser(): Promise<void> {
  await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
  _authState = { ...emptyAuth, isLoading: false, isAuthenticated: false };
  notify();
}

export function useAuth(): AuthState {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const update = () => forceUpdate((n) => n + 1);
    _listeners.add(update);

    if (_authState.isLoading) {
      checkAuth();
    }

    return () => {
      _listeners.delete(update);
    };
  }, []);

  return _authState;
}
