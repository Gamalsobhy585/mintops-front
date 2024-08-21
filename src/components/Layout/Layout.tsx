import React from 'react';
import Navbar from '../Navbar/Navbar';
import { Outlet } from 'react-router-dom';


interface UserData {
  token: string | null;
}

interface LayoutProps {
  userData: UserData | null; 
  setUserData: (data: UserData | null) => void;  
  logOut: () => void;
}

export default function Layout({ userData, setUserData, logOut }: LayoutProps) {
  return (
    <>
      <Navbar logOut={logOut} userData={userData} />
      <div className="container mx-auto py-5 px-4">
        <Outlet />
      </div>
    </>
  );
}
