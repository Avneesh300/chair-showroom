"use client";

import React, { createContext, useContext, useState } from "react";

export type UserRole = "admin" | "customer" | null;

interface AuthUser {
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => { success: boolean; role: UserRole; error?: string };
  logout: () => void;
  isLoggedIn: boolean;
}

// Static credentials
const STATIC_USERS = [
  {
    email: "admin@srschairs.com",
    password: "admin123",
    name: "Admin",
    role: "admin" as UserRole,
  },
  {
    email: "customer@srschairs.com",
    password: "customer123",
    name: "Rahul Sharma",
    role: "customer" as UserRole,
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = (email: string, password: string) => {
    const found = STATIC_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (found) {
      setUser({ name: found.name, email: found.email, role: found.role });
      return { success: true, role: found.role };
    }
    return { success: false, role: null, error: "Invalid email or password" };
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
