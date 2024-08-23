import React from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { SyncLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  
  const { data, isError, isLoading, refetch } = useQuery({
    queryKey: ['getTasks'],
    queryFn: fetchTasks,
    refetchInterval: 5 * 60 * 1000, 
    staleTime: 5 * 60 * 1000,
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
    <div className="container mx-auto p-4">
      <div className="flex justify-end mb-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => navigate('/tasks/create')}
        >
          Create Task
        </button>
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
          {data?.map((task) => (
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
    </div>
  );
};

export default Home;
