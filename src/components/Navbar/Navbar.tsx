import React from 'react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  userData: string | null; 
  logOut: () => void; 
}

export default function Navbar({ userData, logOut }: NavbarProps) {
  return (
    <nav className="p-4 flex justify-between items-center bg-white shadow-md">
      <div className="left-nav flex items-center">
        <h1 className="m-0 pr-3 text-xl font-semibold">
          <Link className="text-decoration-none" to="/">
            <img
              className="inavde-logo"
              src="/INVADE_logo.png"
              alt="Invade Tasks Logo"
              style={{ height: '40px', marginRight: '10px' }}
            />
          </Link>
        </h1>
      </div>
      <div className="right-nav flex items-center">
        {userData ? (
          <ul className="list-none flex m-0 items-center space-x-4">
            <li>
              <Link className="text-pink-500 hover:text-pink-700" to="/tasks">
                Tasks
              </Link>
            </li>
            <li>
              <Link className="text-pink-500 hover:text-pink-700" to="/categories">
                Categories
              </Link>
            </li>
            <li>
              <Link className="text-pink-500 hover:text-pink-700" to="/create-task">
                Create a New Task
              </Link>
            </li>
            <li>
              <Link className="text-pink-500 hover:text-pink-700" to="/create-team">
                Create a New Team
              </Link>
            </li>
            <li>
              <Link className="text-pink-500 hover:text-pink-700" to="/my-teams">
                My Teams
              </Link>
            </li>
            <li>
              <span
                className="text-pink-500 hover:text-pink-700 cursor-pointer"
                onClick={logOut}
              >
                Logout
              </span>
            </li>
          </ul>
        ) : (
          <ul className="list-none flex m-0 items-center space-x-4">
            <li>
              <Link className="text-pink-500 hover:text-pink-700" to="/login">
                Login
              </Link>
            </li>
            <li>
              <Link className="text-pink-500 hover:text-pink-700" to="/register">
                Register
              </Link>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
}
