
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";

// This is a mock authentication context that will be replaced with Supabase Auth
// after connecting to Supabase

export interface User {
  id: string;
  email: string;
  name: string;
  role: "owner" | "warehouse_admin" | "cashier";
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: "1",
    email: "owner@retailayu.com",
    name: "Owner User",
    role: "owner",
    avatar: "",
  },
  {
    id: "2",
    email: "warehouse@retailayu.com",
    name: "Warehouse Admin",
    role: "warehouse_admin",
    avatar: "",
  },
  {
    id: "3",
    email: "cashier@retailayu.com",
    name: "Cashier User",
    role: "cashier",
    avatar: "",
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check for existing session on load
  useEffect(() => {
    const savedUser = localStorage.getItem("retailayu_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock authentication logic
      const foundUser = mockUsers.find((user) => user.email === email);
      if (!foundUser || password !== "password") {
        throw new Error("Invalid credentials");
      }

      setUser(foundUser);
      localStorage.setItem("retailayu_user", JSON.stringify(foundUser));
      toast.success(`Welcome back, ${foundUser.name}!`);
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in");
      console.error("Sign in error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Create new user - in real app this would be done by Supabase
      const newUser: User = {
        id: `${mockUsers.length + 1}`,
        email,
        name,
        role: "cashier", // Default role for new users
      };

      setUser(newUser);
      localStorage.setItem("retailayu_user", JSON.stringify(newUser));
      toast.success("Account created successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
      console.error("Sign up error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      setUser(null);
      localStorage.removeItem("retailayu_user");
      toast.success("Signed out successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign out");
      console.error("Sign out error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (userData: Partial<User>) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (!user) {
        throw new Error("No user is currently logged in");
      }

      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem("retailayu_user", JSON.stringify(updatedUser));
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
      console.error("Profile update error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, signIn, signUp, signOut, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
