import React from 'react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  userData: { token: string | null } | null;  
  logOut: () => void;
}

export default function Navbar({ userData, logOut }: NavbarProps) {
  return (
    <nav className="p-4 flex justify-between items-center bg-neutral-100 shadow-md">
      <div className="left-nav flex items-center">
        <h1 className="m-0 pr-3 text-xl font-semibold">
          <Link className="text-decoration-none" to="/">
            <img
            aria-hidden='true'
              className="mintops-logo h-10 mr-2.5"
              src="/logo.png"
              alt="Mint-ops Logo"
            />
          </Link>
        </h1>
      </div>
      <div className="right-nav flex items-center">
        {userData?.token ? (  
          <ul className="list-none flex m-0 items-center space-x-4">
            <li>
              <Link className="text-sky-500 hover:text-sky-700" to="/">
                Tasks
              </Link>
            </li>
            <li>
              <Link className="text-sky-500 hover:text-sky-700" to="/categories">
                Categories
              </Link>
            </li>
    
        
            <li>
              <Link className="text-sky-500 hover:text-sky-700" to="/teams">
                 Teams
              </Link>
            </li>
            <li>
              <span
                className="text-sky-500 hover:text-sky-700 cursor-pointer"
                onClick={logOut} role='button'
              >
                Logout
              </span>
            </li>
          </ul>
        ) : (
          <ul className="list-none flex m-0 items-center space-x-4">
            <li>
              <Link className="text-sky-500 hover:text-sky-700" to="/login">
                Login
              </Link>
            </li>
            <li>
              <Link className="text-sky-500 hover:text-sky-700" to="/register">
                Register
              </Link>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
}
