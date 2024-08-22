import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: number;
  name: string;
}

interface RemoveMemberPopupProps {
  teamId: number;
  onClose: () => void;
  onRemoveMember: () => void;
}

const RemoveMemberPopup: React.FC<RemoveMemberPopupProps> = ({ teamId, onClose, onRemoveMember }) => {
  const [members, setMembers] = useState<User[]>([]);
  const [selectedMember, setSelectedMember] = useState<User | null>(null);

  useEffect(() => {
    const fetchMembers = async () => {
      const token = localStorage.getItem('userToken');
      const response = await axios.get(`http://localhost:8000/api/v1/teams/${teamId}/members`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Correctly access the members data from the response
      setMembers(response.data.data); 
    };

    fetchMembers();
  }, [teamId]);

  const handleRemoveMember = async () => {
    if (selectedMember) {
      const token = localStorage.getItem('userToken');
      await axios.delete(
        `http://localhost:8000/api/v1/teams/${teamId}/members/${selectedMember.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onRemoveMember();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white w-11/12 md:w-7/12 p-6 rounded shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Select a Member to Remove</h2>
        <ul>
          {members.map(member => (
            <li
              key={member.id}
              className={`py-2 px-4 border-b hover:bg-gray-200 cursor-pointer ${selectedMember?.id === member.id ? 'bg-sky-300' : ''}`}
              onClick={() => setSelectedMember(member)}
            >
              {member.name}
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-end">
          <button
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            onClick={handleRemoveMember}
          >
            Remove
          </button>
        </div>
        <button
          className="absolute top-2 right-2 text-2xl border border-blue-500 rounded-full p-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default RemoveMemberPopup;
