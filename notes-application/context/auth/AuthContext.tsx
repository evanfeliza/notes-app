import { onAuthStateChanged, User } from "firebase/auth";
import React, { useState, useEffect } from "react";
import { auth } from "@/firebase";

export interface AuthType {
  children: React.ReactNode;
}

interface AuthContextType {
  currentUser: User | null;
}

export const AuthContext = React.createContext<AuthContextType>({
  currentUser: null,
});

export const AuthContextProvider: React.FC<AuthType> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser: currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
