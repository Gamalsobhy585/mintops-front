import React, { useState } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import Cookies from 'js-cookie';
import { useContext } from 'react';
import { UserContext } from '../../Context/UserContext';
interface UserData {
  username: string;
  token: string;
}

interface LoginProps {
  saveUserData: (data: UserData) => void;
}

export default function Login({ saveUserData }: LoginProps) {
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("UserContext must be used within a UserContextProvider");
  }
  const { setToken } = userContext;
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  let navigate = useNavigate();
  
  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Email is invalid').required('Email is required'),
    password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .matches(/\d/, 'Password must contain at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character')
    .required('Password is required'),  });

    const handleLogin = async (formValues: { email: string; password: string }) => {
      setIsLoading(true);
      try {
        const response = await axios.post('http://localhost:8000/api/v1/login', formValues);
    
        const token = response.data.access_token;
        const username = response.data.username || 'User';
        setToken(token);

        saveUserData({ username, token });
    
        localStorage.setItem('userToken', token);
        Cookies.set('authorizationtoken', token);
    
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
    
        navigate('/');
      } catch (error: any) {
        setApiError(error?.response?.data?.message || 'Login failed');
        setIsLoading(false);
      }
    };
    
    

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: handleLogin,
  });

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Login</title>
      </Helmet>
      
      {apiError && <div className='p-1 mb-4 bg-sky-200 rounded-lg text-sky-600 text-sm'>{apiError}</div>}

      <div className='border-2 max-w-md py-3 px-8 mx-auto rounded-md border-slate-300'>
        <div className="max-w-xl my-10 mx-auto">
          <h1 className='font-bold text-center text-sky-600 mb-10'>Login Now</h1>

          <form onSubmit={formik.handleSubmit} className="max-w-md mx-auto">
            <div className="relative z-0 w-full mb-5 group">
              <input
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                type="email"
                name="email"
                id="email"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-sky-600 peer"
                placeholder=" "
                required
              />
              <label
                htmlFor="email"
                className="absolute text-sm text-gray-500 peer-focus:font-medium peer-focus:text-sky-600 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 origin-[0] scale-75 -translate-y-6 top-3 peer-focus:left-0"
              >
                Email address
              </label>
            </div>
            {formik.errors.email && formik.touched.email && (
              <div className='p-1 mb-4 bg-sky-200 rounded-lg text-sky-600 text-sm'>
                {formik.errors.email}
              </div>
            )}

            <div className="relative z-0 w-full mb-5 group">
              <input
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                type={showPassword ? 'text' : 'password'}
                name="password"
                id="password"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-sky-600 peer"
                placeholder=" "
                required
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                <i className={`fa ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`}></i>
              </div>
              <label
                htmlFor="password"
                className="absolute text-sm text-gray-500 peer-focus:font-medium peer-focus:text-sky-600 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 origin-[0] scale-75 -translate-y-6 top-3 peer-focus:left-0"
              >
                Password
              </label>
            </div>
            {formik.errors.password && formik.touched.password && (
              <div className='p-1 mb-4 bg-sky-200 rounded-lg text-sky-600 text-sm'>
                {formik.errors.password}
              </div>
            )}

            <div className='flex flex-row justify-center'>
            <button
  disabled={!formik.isValid || !formik.dirty || isLoading}
  type="submit"
  className="disabled:bg-slate-400 w-full text-white hover:bg-sky-300 bg-sky-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
>
  {isLoading ? <i className="fas fa-spinner fa-spin"></i> : "Login"}
</button>

            </div>
          </form>
        </div>
      </div>
    </>
  );
}
