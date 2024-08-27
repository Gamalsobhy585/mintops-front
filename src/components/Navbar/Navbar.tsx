import React from 'react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  userData: { token: string | null } | null;  
  logOut: () => void;
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Navbar({  darkMode, setDarkMode,userData, logOut }: NavbarProps) {
  const logoSrc = darkMode ? '/darkmodel.png' : '/logo.png';
  return (
    <nav className="p-4 flex justify-between items-center dark:bg-neutral-900 bg-neutral-100 shadow-md">
      <div className="left-nav flex items-center">
        <h1 className="m-0 pr-3 text-xl font-semibold">
          <Link className="text-decoration-none" to="/">
            <img
              className="mintops-logo h-10 mr-2.5"
              src={logoSrc}
              alt="Mint-ops Logo"
            />
          </Link>
        </h1>
      </div>
      <div className="right-nav flex items-center">
      <div className="mr-3 dark-mode-toggle">
        <button className='text-sky-500 dark:text-sky-100  ' onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        </button>
      </div>
        {userData?.token ? (  
          <ul className="list-none flex m-0 items-center space-x-4">
            <li>
              <Link className="text-sky-500 dark:text-sky-100  dark:hover:text-sky-300 hover:text-sky-700" to="/">
                Tasks
              </Link>
            </li>
            <li>
              <Link className="text-sky-500 dark:text-sky-100 dark:hover:text-sky-300 hover:text-sky-700" to="/categories">
                Categories
              </Link>
            </li>
    
        
            <li>
              <Link className="text-sky-500 dark:text-sky-100  dark:hover:text-sky-300 hover:text-sky-700" to="/teams">
                 Teams
              </Link>
            </li>
            <li>
              <button
                className="text-sky-500 dark:text-sky-100 dark:hover:text-sky-300 hover:text-sky-700 cursor-pointer"
                onClick={logOut} role='button'
                aria-label='logout'
              >
                Logout
              </button>
            </li>
          </ul>
        ) : (
          <ul className="list-none flex m-0 items-center space-x-4">
            <li>
              <Link className="text-sky-500 dark:text-sky-100 dark:hover:text-sky-300 hover:text-sky-700" to="/login">
                Login
              </Link>
            </li>
            <li>
              <Link className="text-sky-500 dark:text-sky-100 dark:hover:text-sky-300 hover:text-sky-700" to="/register">
                Register
              </Link>
            </li>
          </ul>
        )}
      </div>
      
    </nav>
  );
}
