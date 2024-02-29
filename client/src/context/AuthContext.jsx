import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext({
  user: null,
  setUser: () => {},
  isAuthenticated: false,
  setAuthenticated: () => {},
  logout: () => {},  // Adding logout function to the context
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'));
  const [isAuthenticated, setAuthenticated] = useState(!!localStorage.getItem('auth_token'));

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  useEffect(() => {
    setAuthenticated(!!localStorage.getItem('auth_token'));
  }, []);

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
    setUser(null);
    setAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, isAuthenticated, setAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
