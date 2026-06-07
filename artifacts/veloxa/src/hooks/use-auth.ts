import { useState, useEffect } from "react";

interface AuthState {
  ownerId: number | null;
  name: string | null;
  email: string | null;
  isLoading: boolean;
}

let _authState: AuthState = { ownerId: null, name: null, email: null, isLoading: true };
const _listeners = new Set<() => void>();

function notify() {
  _listeners.forEach((fn) => fn());
}

export async function checkAuth(): Promise<AuthState> {
  try {
    const res = await fetch("/api/me", { credentials: "include" });
    if (res.ok) {
      const data = await res.json();
      _authState = { ownerId: data.id, name: data.name, email: data.email, isLoading: false };
    } else {
      _authState = { ownerId: null, name: null, email: null, isLoading: false };
    }
  } catch {
    _authState = { ownerId: null, name: null, email: null, isLoading: false };
  }
  notify();
  return _authState;
}

export async function loginUser(email: string, password: string): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (res.ok) {
    _authState = { ownerId: data.ownerId, name: data.name, email: data.email, isLoading: false };
    notify();
    return { ok: true };
  }
  return { ok: false, error: data.error || "Login failed" };
}

export async function logoutUser(): Promise<void> {
  await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
  _authState = { ownerId: null, name: null, email: null, isLoading: false };
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
