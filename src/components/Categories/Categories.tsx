import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
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
  const [currentUrl, setCurrentUrl] = useState('http://localhost:8000/api/v1/categories');
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const { data, isError, isLoading } = useQuery({
    queryKey: ['categories', currentUrl],
    queryFn: () => fetchCategories(currentUrl),
    staleTime: 6 * 60 * 60 * 1000,
  });

  const { data: recentCategories } = useQuery({
    queryKey: ['recentlyVisitedCategories'],
    queryFn: () => fetchCategories('http://localhost:8000/api/v1/categories/recently-visited'),
    staleTime: 6 * 60 * 60 * 1000,
  });

  const handleCategoryClick = async (categoryId: number) => {
    try {
      const token = localStorage.getItem('userToken');
      await axios.get(
        `http://localhost:8000/api/v1/categories/${categoryId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      queryClient.invalidateQueries({ queryKey: ['recentlyVisitedCategories'] });
    } catch (error) {
      console.error('Error fetching category:', error);
    }
  };

  const handlePageChange = (url: string) => {
    setCurrentUrl(url);
  };

  const filteredCategories = data?.data.filter((category: any) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Categories</title>
      </Helmet>
      <div className="p-4">
        {/* Search Input */}
        <div className="mb-4">
          <input
            type="text"
            className="w-full p-2 border border-slate-600 rounded"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label='search by Category  '

          />
        </div>

        {/* Recently Visited Categories Section */}
        {recentCategories?.data.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-2">Recently Visited Categories</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
              {recentCategories.data.map((category: any) => (
                <div
                  key={category.id}
                  className="bg-slate-600 hover:bg-slate-300 border text-blue-200 hover:text-blue-600 border-blue-600 p-4 rounded-lg text-center cursor-pointer"
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <h3 className="text-lg">{category.name}</h3>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Existing Categories Grid */}
        <h2 className="text-lg font-bold mb-2">Our  Categories</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {filteredCategories?.map((category: any) => (
            <div
              key={category.id}
              className="bg-slate-600 hover:bg-slate-300 border text-blue-200 hover:text-blue-600 border-blue-600 p-4 rounded-lg text-center cursor-pointer"
              onClick={() => handleCategoryClick(category.id)}
            >
              <h3 className="text-lg">{category.name}</h3>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <nav id="nav-pagination" aria-label="Page navigation" className="mt-5">
          <ul className="pagination flex justify-center">
            {data?.meta?.links
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
      </div>
    </>
  );
};

export default Categories;
