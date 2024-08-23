import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import SyncLoader from 'react-spinners/SyncLoader';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Helmet } from 'react-helmet';

interface Category {
  id: number;
  name: string;
}

interface Team {
  id: number;
  name: string;
}

interface Member {
  id: number;
  name: string;
}

interface Task {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  status: string;
  priority: string;
  category_id: number;
  team_id: number;
  user_id: number;
}

interface ApiResponse {
  data: Task;
}

const fetchCategories = async (): Promise<Category[]> => {
  const { data } = await axios.get('http://localhost:8000/api/v1/categories', {
    headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` },
  });
  return data.data;
};

const fetchTeams = async (): Promise<Team[]> => {
  const { data } = await axios.get('http://localhost:8000/api/v1/teams', {
    headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` },
  });
  return data.data;
};

const EditTask: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [members, setMembers] = useState<Member[]>([]);

  const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const { data: teams, isLoading: teamsLoading } = useQuery<Team[]>({
    queryKey: ['teams'],
    queryFn: fetchTeams,
  });

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      start_date: '',
      end_date: '',
      status: 'not started',
      priority: 'medium',
      category_id: '',
      team_id: '',
      user_id: '',
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required'),
      description: Yup.string().required('Description is required'),
      start_date: Yup.date().required('Start date is required'),
      end_date: Yup.date().min(Yup.ref('start_date'), 'End date must be after start date').required('End date is required'),
      status: Yup.string().oneOf(['not started', 'in progress', 'completed'], 'Invalid status').required('Status is required'),
      priority: Yup.string().oneOf(['low', 'medium', 'high'], 'Invalid priority').required('Priority is required'),
      category_id: Yup.string().required('Category is required'),
      team_id: Yup.string().required('Team is required'),
      user_id: Yup.string().required('User is required when a team is selected'),
    }),
    onSubmit: async (values) => {
      try {
        await axios.put(`http://localhost:8000/api/v1/tasks/${id}`, values, {
          headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` },
        });
        toast.success('Task updated successfully!', {
          position: 'bottom-right',
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
        navigate('/');
      } catch (error) {
        toast.error('Failed to update task.', {
          position: 'bottom-right',
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
      }
    },
  });

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get<ApiResponse>(`http://localhost:8000/api/v1/tasks/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` },
        });
        const taskData = response.data.data; 
        formik.setValues({
          title: taskData.title,
          description: taskData.description,
          start_date: taskData.start_date,
          end_date: taskData.end_date,
          status: taskData.status,
          priority: taskData.priority,
          category_id: String(taskData.category_id),
          team_id: String(taskData.team_id),
          user_id: String(taskData.user_id),
        });
      } catch (error) {
        toast.error('Failed to fetch task details.', {
          position: 'bottom-right',
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
      }
    };

    fetchTask();
  }, [id]);

  useEffect(() => {
    if (formik.values.team_id) {
      axios
        .get(`http://localhost:8000/api/v1/teams/${formik.values.team_id}/members`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` },
        })
        .then((response) => {
          setMembers(response.data.data);
          formik.setFieldValue('user_id', response.data.data.length > 0 ? response.data.data[0].id : '');
        })
        .catch((error) => {
          console.error('Error fetching team members:', error);
        });
    } else {
      setMembers([]);
      formik.setFieldValue('user_id', '');
    }
  }, [formik.values.team_id]);

  if (categoriesLoading || teamsLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <SyncLoader color="blue" />
      </div>
    );
  }

  return (

    <><Helmet>
      <meta charSet="utf-8" />
      <title>Edit Task</title>
    </Helmet><div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Edit Task</h2>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="mt-1 p-2 w-full border border-gray-300 rounded"
              required />
            {formik.touched.title && formik.errors.title ? (
              <div className="text-red-500 text-sm">{formik.errors.title}</div>
            ) : null}
          </div>
          {/* Description Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="mt-1 p-2 w-full border border-gray-300 rounded"
              required />
            {formik.touched.description && formik.errors.description ? (
              <div className="text-red-500 text-sm">{formik.errors.description}</div>
            ) : null}
          </div>
          {/* Start Date Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              name="start_date"
              value={formik.values.start_date}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="mt-1 p-2 w-full border border-gray-300 rounded"
              required />
            {formik.touched.start_date && formik.errors.start_date ? (
              <div className="text-red-500 text-sm">{formik.errors.start_date}</div>
            ) : null}
          </div>
          {/* End Date Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="date"
              name="end_date"
              value={formik.values.end_date}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="mt-1 p-2 w-full border border-gray-300 rounded"
              required />
            {formik.touched.end_date && formik.errors.end_date ? (
              <div className="text-red-500 text-sm">{formik.errors.end_date}</div>
            ) : null}
          </div>
          {/* Status Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              name="status"
              value={formik.values.status}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="mt-1 p-2 w-full border border-gray-300 rounded"
              required
            >
              <option value="not started">Not Started</option>
              <option value="in progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            {formik.touched.status && formik.errors.status ? (
              <div className="text-red-500 text-sm">{formik.errors.status}</div>
            ) : null}
          </div>
          {/* Priority Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Priority</label>
            <select
              name="priority"
              value={formik.values.priority}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="mt-1 p-2 w-full border border-gray-300 rounded"
              required
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            {formik.touched.priority && formik.errors.priority ? (
              <div className="text-red-500 text-sm">{formik.errors.priority}</div>
            ) : null}
          </div>
          {/* Category Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              name="category_id"
              value={formik.values.category_id}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="mt-1 p-2 w-full border border-gray-300 rounded"
              required
            >
              <option value="">Select a category</option>
              {categories?.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {formik.touched.category_id && formik.errors.category_id ? (
              <div className="text-red-500 text-sm">{formik.errors.category_id}</div>
            ) : null}
          </div>
          {/* Team Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Team</label>
            <select
              name="team_id"
              value={formik.values.team_id}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="mt-1 p-2 w-full border border-gray-300 rounded"
              required
            >
              <option value="">Select a team</option>
              {teams?.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
            {formik.touched.team_id && formik.errors.team_id ? (
              <div className="text-red-500 text-sm">{formik.errors.team_id}</div>
            ) : null}
          </div>
          {/* User/Member Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Member</label>
            <select
              name="user_id"
              value={formik.values.user_id}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="mt-1 p-2 w-full border border-gray-300 rounded"
              required
              disabled={!formik.values.team_id} // Disable if no team selected
            >
              <option value="">Select a member</option>
              {members?.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
            {formik.touched.user_id && formik.errors.user_id ? (
              <div className="text-red-500 text-sm">{formik.errors.user_id}</div>
            ) : null}
          </div>
          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Update Task
            </button>
          </div>
        </form>
        <ToastContainer />
      </div></>
  );
};

export default EditTask;
