import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Helmet } from "react-helmet";
import { useFormik } from 'formik';
import { useNavigate } from "react-router-dom";
import * as Yup from 'yup';
import Cookies from 'js-cookie';

export default function Register() {
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

  let navigate = useNavigate();

  useEffect(() => {
    setUserLocation();
  }, []);

function saveUserDataToLocalStorage(user: { name: string; email: string }) {
  const storedUsers: { name: string; email: string }[] = JSON.parse(localStorage.getItem("users") || '[]');
  storedUsers.push({ name: user.name, email: user.email });
  localStorage.setItem("users", JSON.stringify(storedUsers));
}



  const setUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          Cookies.set('userlocation', `${latitude},${longitude}`);
        },
        (error) => {
          console.error("Error getting user location:", error);
          Cookies.set('userlocation', 'Location not available');
        }
      );
    } else {
      Cookies.set('userlocation', 'Geolocation not supported');
    }
  };

  let validatorYup = Yup.object().shape({
    name: Yup.string().min(3, 'Min length is 3 chars').max(20, 'Max length is 20 chars').required('Name is required'),
    email: Yup.string().email('Email is invalid').required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .matches(/\d/, 'Password must contain at least one number')
      .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character')
      .required('Password is required'),
    password_confirmation: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Password confirmation is required'),
       role: Yup.string().oneOf(['leader', 'member'], 'Role must be either leader or member').required('Role is required'),
  });

  async function handleRegister(formValues: any) {
    setIsLoading(true);
    try {
      const { data } = await axios.post(`http://localhost:8000/api/v1/register`, formValues);
      localStorage.setItem('userToken', data.token);
      Cookies.set('authorizationtoken', data.token);
      navigate('/');
    } catch (error: any) {
      setApiError(error.response?.data?.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  let formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      role: 'member' 
    },
    validationSchema: validatorYup,
    onSubmit: handleRegister,
  });

  return (
    <>
    <Helmet>
      <meta charSet="utf-8" />
      <title>Register</title>
    </Helmet>
    <p>{apiError && <div className='p-1 mb-4 bg-sky-200 dark:bg-sky-700  rounded-lg text-sky-600 dark:text-sky-200 text-sm'>{apiError}</div>}</p>
    <div className='border-2 border-solid max-w-md py-3 px-8 mx-auto rounded-md border-slate-300'>
      <div className="max-w-xl my-10 mx-auto">
        <h1 className='font-bold text-center text-sky-600 dark:text-sky-200 mb-10'>Register Now</h1>
        <form onSubmit={formik.handleSubmit} className="max-w-md mx-auto">
          <div className="relative z-0 w-full mb-5 group">
            <input
            aria-required='true'
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              name="name"
              type="text"
              aria-label='name'
              id="floating_name"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-sky-600 peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="floating_name"
              className="absolute text-sm text-gray-500 peer-focus:font-medium peer-focus:text-sky-600 dark:peer-focus:text-sky-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-75 origin-[0] scale-75 -translate-y-6 top-3 peer-focus:left-0"
            >
              Full Name
            </label>
          </div>
          {formik.errors.name && formik.touched.name && (
            <div className='p-1 mb-4 bg-sky-200 dark:bg-sky-700 rounded-lg text-sky-600 dark:text-sky-200 text-sm'>
              {formik.errors.name}
            </div>
          )}

          <div className="relative z-0 w-full mb-5 group">
            <input
                        aria-required='true'

            aria-label='email'
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              type="email"
              name="email"
              id="floating_email"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-sky-600 peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="floating_email"
              className="absolute text-sm text-gray-500 peer-focus:font-medium peer-focus:text-sky-600  peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-75 origin-[0] scale-75 -translate-y-6 top-3 peer-focus:left-0"
            >
              Email address
            </label>
          </div>
          {formik.errors.email && formik.touched.email && (
            <div className='p-1 mb-4 bg-sky-200 dark:bg-sky-700 rounded-lg text-sky-600 dark:text-sky-200 text-sm'>
              {formik.errors.email}
            </div>
          )}

          <div className="relative z-0 w-full mb-5 group">
            <input
                        aria-required='true'

            aria-label='password'
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
              <i aria-label='button to show password' className={`fa ${showPassword ? 'fa-eye dark:text-white' : 'fa-eye-slash dark:text-white'}`}></i>
            </div>
            <label
              htmlFor="password"
              className="absolute text-sm text-gray-500 peer-focus:font-medium peer-focus:text-sky-600 dark:peer-focus:text-sky-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-75 origin-[0] scale-75 -translate-y-6 top-3 peer-focus:left-0"
            >
              Password
            </label>
          </div>
          {formik.errors.password && formik.touched.password && (
            <div className='p-1 mb-4 bg-sky-200 dark:bg-sky-700 rounded-lg text-sky-600 dark:text-sky-200 text-sm'>
              {formik.errors.password}
            </div>
          )}

          <div className="relative z-0 w-full mb-5 group">
            <input
                        aria-required='true'

            aria-label='confirm password'
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password_confirmation}
              type={showPasswordConfirmation ? 'text' : 'password'}
              name="password_confirmation"
              id="password_confirmation"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-sky-600 peer"
              placeholder=" "
              required
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer" onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}>
              <i aria-label='button to show password' className={`fa ${showPasswordConfirmation ? 'fa-eye dark:text-white' : 'fa-eye-slash dark:text-white'}`}></i>
            </div>
            <label
              htmlFor="password_confirmation"
              className="absolute text-sm text-gray-500 peer-focus:font-medium peer-focus:text-sky-600 dark:peer-focus:text-sky-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-75 origin-[0] scale-75 -translate-y-6 top-3 peer-focus:left-0"
            >
              Confirm Password
            </label>
          </div>
            <p>{formik.errors.password_confirmation && formik.touched.password_confirmation && <div className='p-1 mb-4 bg-sky-200 dark:bg-sky-700 rounded-lg text-sky-600 text-sm'>{formik.errors.password_confirmation}</div>}</p>

            <div className="relative z-0 w-full mb-5 group">
              <select
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.role}
                name="role"
                id="role"
                className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-sky-600 peer"
                required
              >
                <option value="member">Member</option>
                <option value="leader">Leader</option>
              </select>
              <label
                htmlFor="role"
                className="peer-focus:font-medium left-1/2 -translate-x-1/2 absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 peer-focus:text-sky-600 dark:peer-focus:text-sky-200"
              >
                Select Role
              </label>
            </div>
            <p>{formik.errors.role && formik.touched.role && <div role='alert' className='p-1 mb-4 bg-sky-200 dark:bg-sky-700 rounded-lg text-sky-600 dark:text-sky-200 text-sm'>{formik.errors.role}</div>}</p>

            <button role='button' disabled={!formik.isValid || !formik.dirty || isLoading} type="submit" className="disabled:bg-slate-200 w-full dark:disabled:bg-slate-800 dark:text-white text-black hover:bg-sky-300 dark:hover:bg-sky-900 bg-sky-600 dark:bg-sky-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center"> {isLoading ? <i className="fa-solid fa-spinner fa-spin"></i> : "Register"} </button>
          </form>
        </div>
      </div>
    </>
  );
}
