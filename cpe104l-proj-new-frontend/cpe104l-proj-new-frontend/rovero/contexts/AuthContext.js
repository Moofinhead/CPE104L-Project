"use client";
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  //initialize user state and loading status
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    //retrieve user data from localStorage if it exists
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
    setIsLoading(false); //set loading complete
  }, []); //end useEffect

  //login function to set user and save to localStorage
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  }; //end login function

  //logout function to clear user and remove from localStorage
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  }; //end logout function

  return (
    //provide authentication values to child components
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  ); //end AuthContext.Provider
}; //end AuthProvider

//custom hook to access AuthContext
export const useAuth = () => useContext(AuthContext); //end useAuth
