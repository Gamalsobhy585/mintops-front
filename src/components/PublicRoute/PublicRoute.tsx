import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface PublicRouteProps {
  userData: { token: string | null } | null; 
  children: ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ userData, children }) => {
  if (userData?.token) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default PublicRoute;
