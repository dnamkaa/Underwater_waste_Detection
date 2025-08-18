import React, { useEffect, useState } from 'react';
import { useAuth } from '../../AuthContext';
import { useNavigate } from 'react-router-dom';
import { HiOutlineTrash } from 'react-icons/hi';
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
const NewUser = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [users, setUsers] = useState([]); // Store user list
  const [showPassword, setShowPassword] = useState(false);

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users'); // Replace with your API endpoint
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched users:', data);
          setUsers(data);
        } else {
          console.error('Failed to fetch users');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  // Handle user creation
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, role }),
      });

      if (response.ok) {
        alert('User created successfully!');
        setUsername(''); // Clear the form
        setPassword('');
        setRole('user');
        const newUser = await response.json();
        setUsers([...users, newUser]); // Add the new user to the list
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error creating user:', error);
      alert('An error occurred while creating the user.');
    }
  };

  // Handle user deletion
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setUsers(users.filter((user) => user.id !== id)); // Remove the deleted user from the list
        alert('User deleted successfully!');
      } else {
        alert('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('An error occurred while deleting the user.');
    }
  };

  if (!user || user.role !== 'admin') {
    return <div>You do not have permission to access this page.</div>;
  }

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center sm:text-left">Create New User</h2>
      <form onSubmit={handleSubmit} className="flex flex-col max-w-md mx-auto">
        <label className="mb-2 text-sm sm:text-base">
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="border rounded p-2 w-full mt-1 sm:mt-2"
          />
        </label>
        <label className="mb-2 relative">
          Password:
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border rounded p-2 w-full pr-10 items-center" // Extra padding to fit the icon
          />
          <span
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
          >
            {showPassword ? <HiOutlineEyeOff size={20} /> : <HiOutlineEye size={20} />}
          </span>
        </label>
        <label className="mb-2 text-sm sm:text-base">
          Role:
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border rounded p-2 w-full mt-1 sm:mt-2"
          >
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="salesrep">Sales Representative</option>
          </select>
        </label>
        <button
          type="submit"
          className="bg-blue-500 text-white rounded py-2 mt-4 text-sm sm:text-base hover:bg-blue-600 transition-colors"
        >
          Create User
        </button>
      </form>

      <h3 className="text-xl font-bold mt-8 mb-4 text-center sm:text-left">User List</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">Username</th>
             
              <th className="px-4 py-2 border-b">Role</th>
              <th className="px-4 py-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="text-center">
                <td className="px-4 py-2 border-b">{user.username}</td>
               
                <td className="px-4 py-2 border-b">{user.role}</td>
                <td className="px-4 py-2 border-b">
                <button
                  onClick={() => handleDelete(user.id)}
                  className="text-red-500 hover:text-red-600 transition-colors"
                  aria-label="Delete user"
                >
                  <HiOutlineTrash size={16} />
                </button>
              </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NewUser;
