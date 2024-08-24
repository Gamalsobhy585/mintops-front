import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const CreateTeam: React.FC = () => {
  const [teamName, setTeamName] = useState('');
  const navigate = useNavigate();

  const handleCreateTeam = async () => {
    const token = localStorage.getItem('userToken'); 

    try {
      const response = await axios.post(
        'http://localhost:8000/api/v1/teams/create',
        { name: teamName },
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success('Team created successfully!', {
          position: 'bottom-right',
          autoClose: 5000,
        });

        setTimeout(() => {
          navigate('/teams');
        }, 5000);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        Swal.fire({
          icon: 'error',
          title: 'Unauthorized',
          text: "Unfortunately, you are not authorized to create a team as you are not a team leader.",
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: "An unexpected error occurred. Please try again later.",
        });
      }
    }
  };

  return (
    <><Helmet>
      <meta charSet="utf-8" />
      <title>Create New Team</title>
    </Helmet><div className="flex flex-col items-center mt-10">
        <label className="mb-2 text-lg font-medium">Team Name:</label>
        <input
                    aria-label='Team Name'
                    aria-required='true'
                    

          type="text"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          className="border border-gray-300 rounded p-2 w-full max-w-sm" />
        <button
        role='button'
          onClick={handleCreateTeam}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
        >
          Create Team
        </button>
        <ToastContainer />
      </div></>
  );
};

export default CreateTeam;
