
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '@/types/user';
import axios from '@/api/axios';

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  signIn: (token: string) => Promise<void>;
  signOut: () => void;
  updateUser: (user: Partial<User>) => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType>({} as UserContextType);

export const useUser = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const setAuthToken = (token: string | null) => {
    if (token) {
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  const fetchUser = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/auth/me');
      setUser(response.data);
    } catch (error) {
      setUser(null);
      setAuthToken(null); // Clear invalid token
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
      fetchUser();
    } else {
      setIsLoading(false);
    }
  }, [fetchUser]);

  const signIn = async (token: string) => {
    setAuthToken(token);
    await fetchUser();
  };

  const signOut = () => {
    setUser(null);
    setAuthToken(null);
  };

  const updateUser = (updatedUserData: Partial<User>) => {
    setUser(prevUser => {
      if (!prevUser) return null;
      const newUser = { ...prevUser, ...updatedUserData };
      return newUser;
    });
  };

  return (
    <UserContext.Provider value={{ 
      user,
      isAuthenticated: !!user,
      signIn,
      signOut,
      updateUser,
      isLoading
    }}>
      {children}
    </UserContext.Provider>
  );
};
