import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import SyncLoader from 'react-spinners/SyncLoader';

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

const CreateTask: React.FC = () => {
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
      user_id: Yup.string().required('User is required when a team is selected'), // Update to make it required
    }),
    onSubmit: async (values) => {
      try {
        await axios.post('http://localhost:8000/api/v1/tasks', values, {
          headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` },
        });
      } catch (error) {
      }
    },
  });

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
    <div className="border border-blue-200 p-4 rounded">
      <form onSubmit={formik.handleSubmit}>
        {/* Title */}
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            className="mt-1 block w-full border-black border rounded-md shadow-sm"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.title && formik.errors.title ? (
            <div className="text-red-600 text-sm">{formik.errors.title}</div>
          ) : null}
        </div>
  
        {/* Description */}
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            name="description"
            rows={4}
            className="mt-1 block w-full border-black border rounded-md shadow-sm"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.description && formik.errors.description ? (
            <div className="text-red-600 text-sm">{formik.errors.description}</div>
          ) : null}
        </div>
  
        {/* Start Date */}
        <div className="mb-4">
          <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">Start Date</label>
          <input
            type="date"
            id="start_date"
            name="start_date"
            className="mt-1 block w-full border-black border rounded-md shadow-sm"
            value={formik.values.start_date}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.start_date && formik.errors.start_date ? (
            <div className="text-red-600 text-sm">{formik.errors.start_date}</div>
          ) : null}
        </div>
  
        {/* End Date */}
        <div className="mb-4">
          <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">End Date</label>
          <input
            type="date"
            id="end_date"
            name="end_date"
            className="mt-1 block w-full border-black border rounded-md shadow-sm"
            value={formik.values.end_date}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.end_date && formik.errors.end_date ? (
            <div className="text-red-600 text-sm">{formik.errors.end_date}</div>
          ) : null}
        </div>
  
        {/* Status */}
        <div className="mb-4">
          <label htmlFor="status" className="block text-sm  font-medium text-gray-700">Status</label>
          <select
            id="status"
            name="status"
            className="mt-1 block w-full border-black border rounded-md shadow-sm"
            value={formik.values.status}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="not started">Not Started</option>
            <option value="in progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          {formik.touched.status && formik.errors.status ? (
            <div className="text-red-600 text-sm">{formik.errors.status}</div>
          ) : null}
        </div>
  
        {/* Priority */}
        <div className="mb-4">
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority</label>
          <select
            id="priority"
            name="priority"
            className="mt-1 block w-full border-black border rounded-md shadow-sm"
            value={formik.values.priority}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          {formik.touched.priority && formik.errors.priority ? (
            <div className="text-red-600 text-sm">{formik.errors.priority}</div>
          ) : null}
        </div>
  
        {/* Category */}
        <div className="mb-4">
          <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">Category</label>
          <select
            id="category_id"
            name="category_id"
            className="mt-1 block w-full border-black border rounded-md shadow-sm"
            value={formik.values.category_id}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="">Select a category</option>
            {categories?.map((category: Category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {formik.touched.category_id && formik.errors.category_id ? (
            <div className="text-red-600 text-sm">{formik.errors.category_id}</div>
          ) : null}
        </div>
  
       {/* Team */}
       <div className="mb-4">
          <label htmlFor="team_id" className="block text-sm font-medium text-gray-700">Team</label>
          <select
            id="team_id"
            name="team_id"
            className="mt-1 block w-full border-black border rounded-md shadow-sm"
            value={formik.values.team_id}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="">Select a team</option>
            {teams?.map((team: Team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
          {formik.touched.team_id && formik.errors.team_id ? (
            <div className="text-red-600 text-sm">{formik.errors.team_id}</div>
          ) : null}
        </div>

        {/* User */}
        <div className="mb-4">
          <label htmlFor="user_id" className="block text-sm font-medium text-gray-700">User (optional)</label>
          <select
            id="user_id"
            name="user_id"
            className="mt-1 block w-full border-black border rounded-md shadow-sm"
            value={formik.values.user_id}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="">Select a user</option>
            {members?.map((member: Member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
          {formik.touched.user_id && formik.errors.user_id ? (
            <div className="text-red-600 text-sm">{formik.errors.user_id}</div>
          ) : null}
        </div>

        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">Create Task</button>
      </form>
    </div>
  );
};

export default CreateTask;