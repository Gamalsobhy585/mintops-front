import React, { useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import '@fortawesome/fontawesome-free/css/all.css';
import './App.scss';
import { Offline } from 'react-detect-offline';
import SyncLoader from 'react-spinners/SyncLoader';

import Register from './components/Register/Register';
import Login from './components/Login/Login';
import Layout from './components/Layout/Layout';
import Home from './components/Home/Home';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import PublicRoute from './components/PublicRoute/PublicRoute';
import NotFound from './components/NotFound/NotFound';
import CreateTeam from './components/CreateTeam/CreateTeam';
import Teams from './components/Teams/Teams';
import TeamDetails from './components/TeamDetails/TeamDetails';
import CreateTask from './components/CreateTask/CreateTask';
import Categories from './components/Categories/Categories';
import EditTask from './components/EditTask/EditTask';

const queryClient = new QueryClient();

interface UserData {
  token: string | null;
}

function App() {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (token) {
      saveUserData({ token });
    }
    showCookieConsent();
    getLocation(); // Fetch and store user location
  }, []);

  function saveUserData({ token }: UserData) {
    setUserData({ token });
  }

  const logOut = async () => {
    try {
      const token = localStorage.getItem('userToken');
      
      if (!token) {
        throw new Error('No token found in localStorage');
      }
  
      if (token === "undefined" || token === null) {
        console.error("Token is invalid or undefined");
        return;
      }
  
      await axios.post('http://localhost:8000/api/v1/logout', {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      localStorage.removeItem('userToken');
      Cookies.remove('authorizationtoken');
      setUserData(null);
  
    } catch (error) {
      if (error instanceof Error) {
        console.error('Logout failed:', error.message);
      } else {
        console.error('An unknown error occurred during logout');
      }
    }
  };

  const showCookieConsent = () => {
    const consent = Cookies.get('cookieConsent');
    if (!consent) {
      Swal.fire({
        title: 'We use cookies',
        text: "This website uses cookies to offer you the most relevant information. Please accept cookies for optimal performance.",
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Yes, I accept Cookies',
        cancelButtonText: 'Reject Cookies',
        reverseButtons: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
        backdrop: true
      }).then((result) => {
        if (result.isConfirmed) {
          Cookies.set('cookieConsent', 'accepted', { expires: 365 });
          Swal.fire(
            'Cookies Accepted!',
            'Thank you for accepting cookies.',
            'success'
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Cookies.set('cookieConsent', 'rejected', { expires: 365 });
          Swal.fire(
            'Cookies Rejected',
            'You have rejected cookies.',
            'info'
          );
        }
      });
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = `${position.coords.latitude},${position.coords.longitude}`;
          Cookies.set('userlocation', location);
        },
        (error) => {
          console.error('Error fetching location:', error);
          Cookies.set('userlocation', 'Location unavailable');
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      Cookies.set('userlocation', 'Geolocation not supported');
    }
  };

  const routers = createBrowserRouter([
    {
      path: '/',
      element: <Layout setUserData={setUserData} userData={userData} logOut={logOut} />,
      children: [
        { path: '/', element: <ProtectedRoute userData={userData}><Home /></ProtectedRoute> },
        { path: 'register', element: <PublicRoute userData={userData}><Register /></PublicRoute> },
        { path: 'login', element: <PublicRoute userData={userData}><Login saveUserData={saveUserData} /></PublicRoute> }, 
        { path: 'tasks/create', element: <ProtectedRoute userData={userData}><CreateTask /></ProtectedRoute> },
        { path: 'tasks/edit/:id', element: <ProtectedRoute userData={userData}><EditTask /></ProtectedRoute> },
        { path: 'categories', element: <ProtectedRoute userData={userData}><Categories /></ProtectedRoute> },
        { path: 'teams/create', element: <ProtectedRoute userData={userData}><CreateTeam /></ProtectedRoute> },
        { path: 'teams', element: <ProtectedRoute userData={userData}><Teams /></ProtectedRoute> },
        { path: 'teams/:id', element: <ProtectedRoute userData={userData}><TeamDetails /></ProtectedRoute> },
      ]
    },
    { path: '*', element: <NotFound /> }
  ]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <ToastContainer />
      </div>
      <Offline>
        <div className="fixed bottom-0 left-0 w-full p-5 bg-sky-500 text-white text-center text-lg font-bold shadow-lg z-50 animate-slideDown">
          You are offline
        </div>
      </Offline>
      <RouterProvider router={routers} />
    </QueryClientProvider>
  );
}

export default App;
