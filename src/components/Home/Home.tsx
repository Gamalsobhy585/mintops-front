import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { SyncLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Helmet } from 'react-helmet';

interface Task {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  status: string;
  priority: string;
  category_id: number;
  user_id: number;
  team_id: number;
  deleted_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

const fetchTasks = async () => {
  try {
    const { data } = await axios.get<Task[]>('http://localhost:8000/api/v1/tasks', {
      headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` },
    });
    return data;
  } catch (error: any) {
    if (error.response && error.response.status === 500) {
      const errorMessage = error.response.data.message;
      throw new Error(errorMessage || 'An error occurred while fetching tasks.');
    }
    throw error;
  }
};

const deleteTask = async (id: number) => {
  await axios.delete(`http://localhost:8000/api/v1/tasks/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` },
  });
};

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const { data, isError, isLoading, refetch, error } = useQuery({
    queryKey: ['getTasks'],
    queryFn: fetchTasks,
    refetchInterval: 5 * 1000,
    staleTime: 5 * 1000,
    refetchOnWindowFocus: true,
  });

  const fetchAllCategories = async () => {
    let allCategories: { id: number; name: string }[] = [];
    let page = 1;
    let lastPage = 1;

    do {
      const { data } = await axios.get(`http://localhost:8000/api/v1/categories?page=${page}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` },
      });
      allCategories = [...allCategories, ...data.data];
      lastPage = data.meta.last_page;
      page++;
    } while (page <= lastPage);

    return allCategories;
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const allCategories = await fetchAllCategories();
        setCategories(allCategories);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const [filters, setFilters] = useState<{
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    status: string;
    priority: string;
    category_id: number | '';
  }>({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    status: '',
    priority: '',
    category_id: '',
  });

  const handleDelete = async (id: number) => {
    try {
      await deleteTask(id);
      toast.success('Task deleted successfully!', {
        position: 'bottom-right',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
        style: { backgroundColor: '#f56565', color: '#fff' },
      });
      refetch();
    } catch (error) {
      toast.error('Failed to delete the task.', {
        position: 'bottom-right',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
        style: { backgroundColor: '#f56565', color: '#fff' },
      });
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const filteredData = data?.filter((task) => {
    return (
      (!filters.title || task.title.toLowerCase().includes(filters.title.toLowerCase())) &&
      (!filters.description || task.description.toLowerCase().includes(filters.description.toLowerCase())) &&
      (!filters.start_date || task.start_date === filters.start_date) &&
      (!filters.end_date || task.end_date === filters.end_date) &&
      (!filters.status || task.status.toLowerCase() === filters.status.toLowerCase()) &&
      (!filters.priority || task.priority === filters.priority) &&
      (filters.category_id === '' || task.category_id === filters.category_id)
    );
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <SyncLoader color="blue" />
      </div>
    );
  }

  if (isError && error instanceof Error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <p className="text-red-600 font-semibold text-lg">You have To join team at first </p>
          <button
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => navigate('/teams/create')}
          >
            Create or Join a Team
          </button>
        </div>
      </div>
    );
  }

  return (
    
    <><Helmet>
      <meta charSet="utf-8" />
      <title>Home</title>
    </Helmet>
    
    <div className="container mx-auto p-4">
        <div className="flex justify-end mb-4 space-x-2">
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => navigate('/tasks/create')}
          >
            Create Task
          </button>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded flex items-center"
            onClick={() => navigate('/trash')}
          >
            <FontAwesomeIcon icon={faTrash} className="mr-2" />
            Trash
          </button>
        </div>

        <div className="grid md:grid-cols-3 sm:grid-cols-12 gap-4 mb-4">
            {/* Title Filter - Visible on All Screens */}
  <input
    type="text"
    name="title"
    placeholder="Filter by Title"
    value={filters.title}
    onChange={handleFilterChange}
    className="border border-blue-500  p-2"
    aria-label='search by title '
  />

  {/* End Date Filter - Visible on All Screens */}
  <input
    type="date"
    name="end_date"
    placeholder="Filter by End Date"
    value={filters.end_date}
    onChange={handleFilterChange}
    className="border border-blue-500 p-2"
    aria-label='search by End Date '
  />

  {/* Description Filter - Hidden on Mobile */}
  <input
    type="text"
    name="description"
    placeholder="Filter by Description"
    value={filters.description}
    onChange={handleFilterChange}
    className="border border-blue-500 p-2 hidden sm:block"
    aria-label='search by Description '

  />

  {/* Start Date Filter - Hidden on Mobile */}
  <input
    type="date"
    name="start_date"
    placeholder="Filter by Start Date"
    value={filters.start_date}
    onChange={handleFilterChange}
    className="border border-blue-500 p-2 hidden sm:block"
    aria-label='search by Start Date '

  />

  {/* Status Filter - Hidden on Mobile */}
  <select
    className="p-2 border rounded hidden sm:block"
    value={filters.status}
    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
  >
    <option value="">All Statuses</option>
    <option value="not started">Not Started</option>
    <option value="in progress">In Progress</option>
    <option value="completed">Completed</option>
  </select>

  {/* Priority Filter - Hidden on Mobile */}
  <select
    name="priority"
    value={filters.priority}
    onChange={handleFilterChange}
    className="border border-blue-500 p-2 hidden sm:block"
  >
    <option value="">Filter by Priority</option>
    <option value="low">Low</option>
    <option value="medium">Medium</option>
    <option value="high">High</option>
  </select>

  {/* Category Filter - Hidden on Mobile */}
  <select
    className="p-2 border rounded hidden sm:block"
    value={filters.category_id}
    onChange={(e) => setFilters({ ...filters, category_id: parseInt(e.target.value) || '' })}
  >
    <option value="">All Categories</option>
    {categories.map((category) => (
      <option key={category.id} value={category.id}>
        {category.name}
      </option>
    ))}
  </select>
</div>


        <table className="min-w-full bg-white border border-blue-500">
  <thead>
    <tr className="bg-sky-100">
      <th scope='col' className="text-black p-2 border border-blue-500">Title</th>
      <th scope='col' className="text-black p-2 border border-blue-500 hidden sm:table-cell">Description</th>
      <th scope='col' className="text-black p-2 border border-blue-500 hidden sm:table-cell">Start Date</th>
      <th scope='col' className="text-black p-2 border border-blue-500">End Date</th>
      <th scope='col' className="text-black p-2 border border-blue-500 hidden sm:table-cell">Status</th>
      <th scope='col' className="text-black p-2 border border-blue-500 hidden sm:table-cell">Priority</th>
      <th scope='col' className="text-black p-2 border border-blue-500">Actions</th>
    </tr>
  </thead>
  <tbody>
    {filteredData?.map((task) => (
      <tr key={task.id}>
        <td className="border border-blue-500 p-2">{task.title}</td>
        <td className="border border-blue-500 p-2 hidden sm:table-cell">{task.description}</td>
        <td className="border border-blue-500 p-2 hidden sm:table-cell">{task.start_date}</td>
        <td className="border border-blue-500 p-2">{task.end_date}</td>
        <td className="border border-blue-500 p-2 hidden sm:table-cell">{task.status}</td>
        <td className="border border-blue-500 p-2 hidden sm:table-cell">{task.priority}</td>
        <td className="border border-blue-500 p-2">
          <button
            className="text-blue-500 hover:underline mr-2"
            onClick={() => navigate(`/tasks/edit/${task.id}`)}
          >
            Edit
          </button>
          <button
            className="text-red-500 hover:underline"
            onClick={() => handleDelete(task.id)}
            role='button'
          >
            Delete
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

        <ToastContainer />
      </div></>
  
);
};

export default Home;
