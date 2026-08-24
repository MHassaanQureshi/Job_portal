import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('job_portal_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [loading, setLoading] = useState(false);

  const loginUser = (userData) => {
    setUser(userData);
    localStorage.setItem('job_portal_user', JSON.stringify(userData));
  };

  const logoutUser = async () => {
    try {
      await api.get('/user/logout');
    } catch (err) {
      console.error('Logout error', err);
    } finally {
      setUser(null);
      localStorage.removeItem('job_portal_user');
    }
  };

  const updateUserProfile = (updatedProfile) => {
    setUser((prev) => {
      const newUser = { ...prev, profile: { ...prev?.profile, ...updatedProfile } };
      localStorage.setItem('job_portal_user', JSON.stringify(newUser));
      return newUser;
    });
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loginUser, logoutUser, updateUserProfile, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
