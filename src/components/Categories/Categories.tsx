import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import SyncLoader from 'react-spinners/SyncLoader';
import { Helmet } from 'react-helmet';


const fetchCategories = async (url: string) => {
  const token = localStorage.getItem('userToken');
  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const Categories: React.FC = () => {
  const [currentUrl, setCurrentUrl] = React.useState('http://localhost:8000/api/v1/categories');

  const { data, isError, isLoading } = useQuery({
    queryKey: ['recentCategories', currentUrl],
    queryFn: () => fetchCategories(currentUrl),
    staleTime: 6 * 60 * 60 * 1000,
  });

  const handlePageChange = (url: string) => {
    setCurrentUrl(url);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <SyncLoader color="blue" />
      </div>
    );
  }

  if (isError) {
    return <div className="text-red-500">Error fetching categories.</div>;
  }

  return (
    <><Helmet>
      <meta charSet="utf-8" />
      <title>Categories</title>
    </Helmet><div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {data?.data.map((category: any) => (
            <div key={category.id} className="bg-slate-600 hover:bg-slate-300 border  text-blue-200 hover:text-blue-600 border-blue-600 p-4 rounded-lg text-center cursor-pointer">
              <h3 className=" text-lg">{category.name}</h3>
            </div>
          ))}
        </div>

        <nav id="nav-pagination" aria-label="Page navigation" className="mt-5">
          <ul className="pagination flex justify-center">
            {data?.meta.links
              .filter((link: any) => !isNaN(Number(link.label)))
              .map((link: any, index: number) => (
                <li key={index} className={`page-item ${link.active ? 'font-bold' : ''}`}>
                  <button
                    className={`
                    text-light-gray
                    bg-sky-300 
                    border-sky-300
                    border
                    transition
                    duration-300
                    ease-in-out
                    w-12
                    px-4 py-2
                    rounded
                    mx-1
                    ${link.active ? 'bg-sky-500 text-dark-gray' : 'hover:bg-sky-500 hover:text-dark-gray'}
                  `}
                    onClick={() => handlePageChange(link.url)}
                    disabled={!link.url}
                    aria-label={`Go to page ${link.label}`}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
          </ul>
        </nav>
      </div></>
  );
};

export default Categories;
