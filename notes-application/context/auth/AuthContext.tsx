import { onAuthStateChanged } from "firebase/auth";
import React, { useState, useEffect } from 'react'
import { auth } from "@/firebase";

export interface AuthType {
  children: React.ReactNode
}

interface AuthContextType {
  currentUser: any;
}

export const AuthContext = React.createContext<AuthContextType>({
  currentUser: null
});

export const AuthContextProvider: React.FC<AuthType> = ({ children }) => { 
  const [currentUser, setCurrentUser] = useState<any>(null);
 
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
    })

    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ currentUser }}>
      { children }
    </AuthContext.Provider>
  );
}
