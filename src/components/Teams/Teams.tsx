import React, { useState } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import SyncLoader from 'react-spinners/SyncLoader';
import UserSelectPopup from '../UserSelectPopup/UserSelectPopup';
import RemoveMemberPopup from '../RemoveMemberPopup/RemoveMemberPopup';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';


const fetchTeams = async () => {
  const token = localStorage.getItem('userToken');
  const response = await axios.get('http://localhost:8000/api/v1/teams/', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log(response.data);
  return response.data;
};

const Teams: React.FC = () => {
  const { data, isError, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['getTeams'],
    queryFn: fetchTeams,
    refetchInterval: 5* 60 * 1000, 
    staleTime : 5* 60 * 1000
  });

  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
  const [isRemovePopupOpen, setIsRemovePopupOpen] = useState(false); 
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);



  const handleDeleteTeam = async (teamId: number) => {
    const token = localStorage.getItem('userToken');
    
    try {
      await axios.delete(`http://localhost:8000/api/v1/teams/${teamId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success('Team deleted successfully!');
      refetch();
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Failed to delete the team. Please try again later.',
        icon: 'error',
        confirmButtonText: 'Ok',
      });
    }
  };



  const handleAddMemberClick = (teamId: number) => {
    setSelectedTeamId(teamId);
    setIsAddPopupOpen(true);
  };

  const handleRemoveMemberClick = (teamId: number) => { 
    setSelectedTeamId(teamId);
    setIsRemovePopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsAddPopupOpen(false);
    setIsRemovePopupOpen(false);
    setSelectedTeamId(null);
  };

  const handleAddMember = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <SyncLoader color="blue" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Failed to load teams. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-10">
      <table className="min-w-full bg-white">
        <thead className="bg-blue-500 text-white">
          <tr>
            <th className="w-1/4 py-2 text-left pl-4">Team Name</th>
            <th className="w-1/2 py-2 text-center">Team Members</th> 
            <th className="w-1/4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.data.map((team: any) => (
            <tr key={team.id} className="even:bg-gray-100 odd:bg-white text-left">
              <td className="w-1/4 py-2 pl-4 font-semibold">{team.name}</td>
              <td className="w-1/2 py-2 text-center">
                {team.members && team.members.length > 0 ? (
                  <>
                    <span className="font-semibold pl-4">{team.members[0]?.name}</span>
                    <ul className="pl-4 mt-2">
                      {team.members.slice(1).map((member: any) => (
                        <li key={member.id} className="italic font-semibold">
                          {member.name}
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <p className="italic">No members found</p>
                )}
              </td>
              <div className="flex flex-col items-center">
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 w-[10rem] px-3 rounded m-1 min-w-[120px]"
                    onClick={() => handleAddMemberClick(team.id)}
                  >
                    Add Member
                  </button>
                  <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded m-1 w-[10rem] min-w-[120px]">
                    Remove Member
                  </button>
                  <button
                    className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-1 px-3 rounded m-1 w-[10rem] min-w-[120px]"
                    onClick={() => handleDeleteTeam(team.id)}
                  >
                    Delete Team
                  </button>
                </div>
            </tr>
          ))}
        </tbody>
      </table>
      {isFetching && (
        <div className="flex justify-center items-center mt-4">
          <p className="text-blue-500">Updating teams...</p>
        </div>
      )}
      {isAddPopupOpen && selectedTeamId !== null && (
        <UserSelectPopup
          teamId={selectedTeamId}
          onClose={handleClosePopup}
          onAddMember={handleAddMember}
        />
      )}
      {isRemovePopupOpen && selectedTeamId !== null && (
        <RemoveMemberPopup
          teamId={selectedTeamId}
          onClose={handleClosePopup}
          onRemoveMember={handleAddMember}
        />
      )}
    </div>
  );
};

export default Teams;
