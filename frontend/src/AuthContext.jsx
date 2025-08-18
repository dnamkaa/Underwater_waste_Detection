import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');

    if (token && username && role) {
      setUser({ username, role });
    }
  }, []);

  const logout = () => {
    setUser(null); // Clear user data on logout
    localStorage.removeItem('token'); // Optionally clear the token
    localStorage.removeItem('username'); // Optionally clear the username
    localStorage.removeItem('role'); // Optionally clear the role
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}> {/* Include logout here */}
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
