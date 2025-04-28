
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type UserRole = "owner" | "warehouse_admin" | "cashier";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileImage?: string | null;
}

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  register: (email: string, password: string, name: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// This is a mock implementation for demo purposes
// It will be replaced with Supabase auth later
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved user in localStorage (mock for persistence)
    const savedUser = localStorage.getItem("retailayu_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Mock authentication - will be replaced with Supabase
    // Simulate network request
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Mock user based on email
    let role: UserRole = "cashier";
    if (email.includes("owner")) {
      role = "owner";
    } else if (email.includes("admin")) {
      role = "warehouse_admin";
    }
    
    const mockUser: User = {
      id: "123",
      name: email.split("@")[0],
      email,
      role,
    };
    
    setUser(mockUser);
    localStorage.setItem("retailayu_user", JSON.stringify(mockUser));
    setIsLoading(false);
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    
    // Mock registration - will be replaced with Supabase
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: Date.now().toString(),
      name,
      email,
      role: "owner", // Default role for new registrations
    };
    
    setUser(mockUser);
    localStorage.setItem("retailayu_user", JSON.stringify(mockUser));
    setIsLoading(false);
  };

  const signOut = () => {
    localStorage.removeItem("retailayu_user");
    setUser(null);
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;
    
    // Mock API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update user data
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem("retailayu_user", JSON.stringify(updatedUser));
    
    return;
  };

  const value = {
    user,
    signIn,
    signOut,
    register,
    updateProfile,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
