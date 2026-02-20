import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  full_name: string;
  phone_number: string;
  email?: string;
  address?: string;
  language: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(() => {
    const stored = localStorage.getItem("pushkar_user");
    return stored ? JSON.parse(stored) : null;
  });

  const setUser = (u: User | null) => {
    setUserState(u);
    if (u) {
      localStorage.setItem("pushkar_user", JSON.stringify(u));
    } else {
      localStorage.removeItem("pushkar_user");
    }
  };

  const logout = () => setUser(null);

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
};
