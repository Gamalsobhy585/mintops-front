import React from 'react';
import Navbar from '../Navbar/Navbar';
import { Outlet } from 'react-router-dom';


interface UserData {
  token: string | null;
}

interface LayoutProps {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;
  userData: UserData | null;
  logOut: () => Promise<void>;
}

export default function Layout({ userData, setUserData, logOut , darkMode, setDarkMode }: LayoutProps) {
  return (
    <>
      <Navbar logOut={logOut}  darkMode={darkMode} setDarkMode={setDarkMode} userData={userData} />
      <div className="container  mx-auto py-5 px-4">
        <Outlet />
      </div>
    </>
  );
}
