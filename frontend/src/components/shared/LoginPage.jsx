import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');

  // Load users from localStorage or create empty array
  const getUsers = () => JSON.parse(localStorage.getItem('users')) || [];

  const saveUsers = (users) => {
    localStorage.setItem('users', JSON.stringify(users));
  };

  const handleLogin = () => {
    const users = getUsers();
    const foundUser = users.find(
      (u) => u.username === username && u.password === password
    );

    if (foundUser) {
      localStorage.setItem('username', foundUser.username);
      localStorage.setItem('role', foundUser.role);

      setUser({ username: foundUser.username, role: foundUser.role });
      navigate('/Dashboard');
    } else {
      alert('Invalid username or password');
    }
  };

  const handleRegister = () => {
    if (!username || !password || !role) {
      alert('Please fill all fields');
      return;
    }
    const users = getUsers();
    if (users.find((u) => u.username === username)) {
      alert('User already exists');
      return;
    }
    users.push({ username, password, role });
    saveUsers(users);
    alert('Registration successful! You can now log in.');
    setIsRegistering(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-blue-600">
          {isRegistering ? 'Create Account' : 'Welcome To KKzone Auto Engineering'}
        </h2>
        <form className="space-y-6 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Enter your username"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Enter your password"
              required
            />
          </div>
          {isRegistering && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="mt-1 w-full p-2 border border-gray-300 rounded-lg"
                required
              >
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="sales_rep">Sales Rep</option>
              </select>
            </div>
          )}
          <button
            type="button"
            onClick={isRegistering ? handleRegister : handleLogin}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {isRegistering ? 'Register' : 'Sign In'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-blue-600 hover:underline"
          >
            {isRegistering
              ? 'Already have an account? Sign In'
              : 'No account? Register here'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
