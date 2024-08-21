import React from 'react';
import Navbar from '../Navbar/Navbar';
import { Outlet } from 'react-router-dom';

interface LayoutProps {
  userData: string | null;
  setUserData: (data: string | null) => void;
  logOut: () => void;
}

export default function Layout({ userData, setUserData, logOut }: LayoutProps) {
  return (
    <>
      <Navbar logOut={logOut} userData={userData} />
      <div className="container mx-auto px-4">
        <Outlet />
      </div>
    </>
  );
}
