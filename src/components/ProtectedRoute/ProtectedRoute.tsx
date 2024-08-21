import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
  userData: { token: string | null } | null; 
}

export default function ProtectedRoute({ children, userData }: ProtectedRouteProps) {
  if (!userData?.token) {
    return <Navigate to="/login" />;
  } else {
    return <>{children}</>;
  }
}

