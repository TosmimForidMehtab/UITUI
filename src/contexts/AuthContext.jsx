import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';

const AuthContext = createContext(undefined);
const host = import.meta.env.VITE_API_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUser({ 
          id: decodedToken._id, 
          role: decodedToken.role,
          token 
        });
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password, isAdmin = false) => {
    setLoading(true);
    try {
      const response = await axios.post(`${host}/auth/signin`, { email, password, role: isAdmin ? 'ADMIN' : 'USER' });
      
      const { data } = response.data;
      const decodedToken = jwtDecode(data);
      localStorage.setItem('token', data);
      setUser({ 
        id: decodedToken._id, 
        role: decodedToken.role,
        token: data
      });
      toast.success(`Logged in ${isAdmin ? 'as admin' : ''} successfully!`);
      return true
    } catch (error) {
      toast.error(error.response.data.message || 'Failed to log in. Please try again.');
      return false
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.info('Logged out successfully.');
  };

  const signup = async (email, password) => {
    setLoading(true);
    try {
      const response = await axios.post(`${host}/auth/signup`, { email, password, role: 'USER' });
      toast.success('Signed up successfully! Please log in.');
      return true
    } catch (error) {
      toast.error(error.response.data.message || 'Failed to sign up. Please try again.');
      return false
    } finally {
      setLoading(false);
    }
  };

  const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signup, loading, useAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

