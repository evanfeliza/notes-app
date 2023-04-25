import React, { useEffect, useContext, ReactNode } from 'react'
import { AuthContext } from '@/context/auth/AuthContext'
import { useRouter } from 'next/router'
import { auth } from '@/firebase'

export interface ProtectRouteProp {
  children: ReactNode
}

const ProtectedRoute: React.FC<ProtectRouteProp> = ({ children }: ProtectRouteProp) => {
  const { currentUser } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.replace('/');
    } 
      
  }, [currentUser, router]);

  if (!currentUser) {
    // You can render a loading spinner or a custom message here
    return null;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
