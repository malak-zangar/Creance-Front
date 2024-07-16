// AuthProvider.js
import React, { useState } from "react";
import axios from "axios";
import AuthContext from "./AuthContext";
import { useNavigate } from "react-router-dom";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const login = async (userData) => {
    try {
      console.log("Logging in with data:", userData);
      const response = await axios.post('http://localhost:5555/auth/login', userData);
      console.log("Login response:", response.data);
      if (response.data === "admin logged in") {
        setUser(userData); 
        console.log(user);
        return true; 
      } else {
        throw new Error('Invalid username or password');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      throw new Error('Error logging in: Please check your username and password');
    }
  };

  const logout = () => {
     axios.get('http://localhost:5555/auth/logout');
    setUser(null); 
    navigate("/login");

  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;