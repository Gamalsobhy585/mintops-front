import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SyncLoader } from 'react-spinners';

const fetchDeletedTasks = async () => {
  const { data } = await axios.get('http://localhost:8000/api/v1/tasks/deleted', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('userToken')}`,
    },
  });
  return data.filter((task: any) => task.deleted_at !== null);
};

const restoreTask = async (id: number) => {
  const { data } = await axios.patch(`http://localhost:8000/api/v1/tasks/${id}/restore`, null, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('userToken')}`,
    },
  });
  return data;
};

const DeletedTasks: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading, isError } = useQuery({
    queryKey: ['getDeletedTasks'],
    queryFn: fetchDeletedTasks,
    staleTime: 30 * 60 * 1000, // 30 minutes
    refetchInterval: 30 * 60 * 1000, // 30 minutes
  });

  const mutation = useMutation({
    mutationFn: restoreTask,
    onSuccess: () => {
      toast.success('Task restored successfully', {
        position: 'bottom-right',
        className: 'bg-green-500 text-white',
      });
      queryClient.invalidateQueries({ queryKey: ['getDeletedTasks'] });
    },
    onError: () => {
      toast.error('Failed to restore task', {
        position: 'bottom-right',
        className: 'bg-red-500 text-white',
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <SyncLoader color="blue" />
      </div>
    );
  }

  if (isError) return <div>Error loading tasks</div>;

  return (
    <div className="container mx-auto p-4">
      <table className="min-w-full bg-white border border-blue-500">
        <thead>
          <tr className="bg-sky-300">
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
          {tasks.map((task: any) => (
            <tr key={task.id}>
              <td className="border border-blue-500 p-2">{task.title}</td>
              <td className="border border-blue-500 p-2">{task.description}</td>
              <td className="border border-blue-500 p-2">{task.start_date}</td>
              <td className="border border-blue-500 p-2">{task.end_date}</td>
              <td className="border border-blue-500 p-2">{task.status}</td>
              <td className="border border-blue-500 p-2">{task.priority}</td>
              <td className="border border-blue-500 p-2">
                <button
                  className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                  onClick={() => mutation.mutate(task.id)}
                >
                  Restore
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

export default DeletedTasks;
