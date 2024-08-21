import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
  userData: string | null; 
}

export default function ProtectedRoute({ children, userData }: ProtectedRouteProps) {
  if (!localStorage.getItem('userToken')) {
    return <Navigate to="/login" />;
  } else {
    return <>{children}</>;
  }
}
