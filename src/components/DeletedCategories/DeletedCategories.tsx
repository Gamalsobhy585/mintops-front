import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SyncLoader } from 'react-spinners';
import { Helmet } from 'react-helmet';

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
    staleTime: 5 * 1000, 
    refetchInterval: 5 * 1000, 
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

    <><Helmet>
      <meta charSet="utf-8" />
      <title>Deleted Tasks</title>
    </Helmet><div className="container mx-auto p-4">
    <table className="min-w-full bg-white border border-blue-500">
  <thead>
    <tr className="bg-sky-300">
      {/* Title - Always Visible */}
      <th className="text-black p-2 border border-blue-500">Title</th>

      {/* Description - Hidden on Mobile */}
      <th className="text-black p-2 border border-blue-500 hidden sm:table-cell">Description</th>

      {/* Start Date - Hidden on Mobile */}
      <th className="text-black p-2 border border-blue-500 hidden sm:table-cell">Start Date</th>

      {/* End Date - Always Visible */}
      <th className="text-black p-2 border border-blue-500">End Date</th>

      {/* Status - Hidden on Mobile */}
      <th className="text-black p-2 border border-blue-500 hidden sm:table-cell">Status</th>

      {/* Priority - Hidden on Mobile */}
      <th className="text-black p-2 border border-blue-500 hidden sm:table-cell">Priority</th>

      {/* Actions - Always Visible */}
      <th className="text-black p-2 border border-blue-500">Actions</th>
    </tr>
  </thead>
  <tbody>
    {tasks.map((task: any) => (
      <tr key={task.id}>
        {/* Title - Always Visible */}
        <td className="border border-blue-500 p-2">{task.title}</td>

        {/* Description - Hidden on Mobile */}
        <td className="border border-blue-500 p-2 hidden sm:table-cell">{task.description}</td>

        {/* Start Date - Hidden on Mobile */}
        <td className="border border-blue-500 p-2 hidden sm:table-cell">{task.start_date}</td>

        {/* End Date - Always Visible */}
        <td className="border border-blue-500 p-2">{task.end_date}</td>

        {/* Status - Hidden on Mobile */}
        <td className="border border-blue-500 p-2 hidden sm:table-cell">{task.status}</td>

        {/* Priority - Hidden on Mobile */}
        <td className="border border-blue-500 p-2 hidden sm:table-cell">{task.priority}</td>

        {/* Actions - Always Visible */}
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
      </div></>
  );
};

export default DeletedTasks;
