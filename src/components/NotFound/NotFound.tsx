import React from 'react';
import { Helmet } from 'react-helmet';

export default function NotFound() {
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Mint-ops - Page Not Found</title>
      </Helmet>
      <div className="text-center flex flex-col items-center justify-center min-h-[80vh] mt-20 pt-20">
        <img src="notfound.svg" alt="Not Found" className="rounded-lg w-full max-w-[31.25rem]" />
        <h1 className="mt-4 text-2xl md:text-4xl font-semibold text-gray-800">Page Not Found</h1>
        <p className="mt-2 text-lg md:text-xl text-neutral-dark-gray">Sorry, the page you are looking for does not exist.</p>
      </div>
    </>
  );
}
