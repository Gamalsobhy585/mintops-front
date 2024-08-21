import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface PublicRouteProps {
  userData: string | null;
  children: ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ userData, children }) => {
  if (userData) {
    return <Navigate to="/home" />;
  }

  return <>{children}</>;
};

export default PublicRoute;
