import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: number;
  name: string;
}

interface UserSelectPopupProps {
  teamId: number;
  onClose: () => void;
  onAddMember: () => void;
}

const UserSelectPopup: React.FC<UserSelectPopupProps> = ({ teamId, onClose, onAddMember }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('userToken');
      const response = await axios.get('http://localhost:8000/api/v1/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data.data); 
    };
    
    fetchUsers();
  }, []);

  const handleAddMember = async () => {
    if (selectedUser) {
      const token = localStorage.getItem('userToken');
      await axios.post(
        `http://localhost:8000/api/v1/teams/${teamId}/members/${selectedUser.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onAddMember();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800  bg-opacity-50 flex justify-center items-center">
      <div className="relative bg-white dark:bg-gray-800 w-11/12 md:w-7/12 p-6 rounded shadow-lg">
        <h2 className="text-xl dark:text-white font-semibold mb-4">Select a User to Add</h2>
        <ul>
          {users.map(user => (
            <li
              key={user.id}
              className={`py-2 dark:text-white px-4 border-b cursor-pointer ${selectedUser?.id === user.id ? 'bg-sky-300 dark:bg-sky-600' : 'hover:bg-gray-200 dark:hover:bg-sky-600'}`}
              onClick={() => setSelectedUser(user)}
            >
              {user.name}
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-end">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            onClick={handleAddMember}
          >
            Add
          </button>
        </div>
        <button
  className="absolute top-2 right-2 text-xl border border-blue-500 rounded-full w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700"
  onClick={onClose}
>
 X
</button>
      </div>
    </div>
  );
};

export default UserSelectPopup;
