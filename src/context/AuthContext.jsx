import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext();
const API_BASE = import.meta.env.VITE_API_BASE;

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  // load from storage
  useEffect(() => {
    const saved = localStorage.getItem("netflixclone-auth");
    if (saved) {
      const parsed = JSON.parse(saved);
      setToken(parsed.token || null);
      setUser(parsed.user || null);
    }
  }, []);

  const saveSession = (payload) => {
    localStorage.setItem("netflixclone-auth", JSON.stringify(payload));
    setToken(payload.token);
    setUser(payload.user);
  };

  const logout = () => {
    localStorage.removeItem("netflixclone-auth");
    setToken(null);
    setUser(null);
  };

  const authFetch = async (path, options = {}) => {
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    return res;
  };

  const login = async (email, password) => {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Login failed");
    saveSession({ token: data.token, user: data.user });
  };

  const register = async (name, email, password) => {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Register failed");
    saveSession({ token: data.token, user: data.user });
  };

  const value = useMemo(
    () => ({ user, token, login, register, logout, authFetch }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
