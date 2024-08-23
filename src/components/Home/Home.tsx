import React, { useState } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { SyncLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useEffect } from 'react';
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
  const { data } = await axios.get<Task[]>('http://localhost:8000/api/v1/tasks', {
    headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` },
  });
  return data;
};

const deleteTask = async (id: number) => {
  await axios.delete(`http://localhost:8000/api/v1/tasks/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` },
  });
};

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const { data, isError, isLoading, refetch } = useQuery({
    queryKey: ['getTasks'],
    queryFn: fetchTasks,
    refetchInterval: 5 * 60 * 1000, 
    staleTime: 5 * 60 * 1000,
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

  if (isError) {
    return <div>Error fetching tasks.</div>;
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

        <div className="grid grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            name="title"
            placeholder="Filter by Title"
            value={filters.title}
            onChange={handleFilterChange}
            className="border border-blue-500 p-2" />
          <input
            type="text"
            name="description"
            placeholder="Filter by Description"
            value={filters.description}
            onChange={handleFilterChange}
            className="border border-blue-500 p-2" />
          <input
            type="date"
            name="start_date"
            placeholder="Filter by Start Date"
            value={filters.start_date}
            onChange={handleFilterChange}
            className="border border-blue-500 p-2" />
          <input
            type="date"
            name="end_date"
            placeholder="Filter by End Date"
            value={filters.end_date}
            onChange={handleFilterChange}
            className="border border-blue-500 p-2" />
          <select
            className="p-2 border rounded"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">All Statuses</option>
            <option value="not started">Not Started</option>
            <option value="in progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <select
            name="priority"
            value={filters.priority}
            onChange={handleFilterChange}
            className="border border-blue-500 p-2"
          >
            <option value="">Filter by Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <select
            className="p-2 border rounded"
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
              <th className="text-black p-2 border border-blue-500">Title</th>
              <th className="text-black p-2 border border-blue-500">Description</th>
              <th className="text-black p-2 border border-blue-500">Start Date</th>
              <th className="text-black p-2 border border-blue-500">End Date</th>
              <th className="text-black p-2 border border-blue-500">Status</th>
              <th className="text-black p-2 border border-blue-500">Priority</th>
              <th className="text-black p-2 border border-blue-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData?.map((task) => (
              <tr key={task.id}>
                <td className="border border-blue-500 p-2">{task.title}</td>
                <td className="border border-blue-500 p-2">{task.description}</td>
                <td className="border border-blue-500 p-2">{task.start_date}</td>
                <td className="border border-blue-500 p-2">{task.end_date}</td>
                <td className="border border-blue-500 p-2">{task.status}</td>
                <td className="border border-blue-500 p-2">{task.priority}</td>
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
