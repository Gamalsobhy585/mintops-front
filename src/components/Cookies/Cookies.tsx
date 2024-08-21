import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!Cookies.get('cookieConsent')) {
      setShow(true);
    }
  }, []);

  const handleAccept = () => {
    Cookies.set('cookieConsent', 'accepted', { expires: 365 });
    setShow(false);
  };

  const handleReject = () => {
    Cookies.set('cookieConsent', 'rejected', { expires: 365 });
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-md flex justify-between items-center">
      <p>This website uses cookies to offer you the most relevant information. Please accept cookies for optimal performance.</p>
      <div>
        <button
          onClick={handleAccept}
          className="bg-sky-700 text-white px-4 py-2 rounded mr-2"
        >
          Yes, I accept Cookies
        </button>
        <button
          onClick={handleReject}
          className="border border-gray-300 px-4 py-2 rounded"
        >
          Reject Cookies
        </button>
      </div>
    </div>
  );
}
