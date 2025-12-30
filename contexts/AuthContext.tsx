import { createContext, useContext, useEffect, useState } from "react";
import { saveSecure, getSecure, deleteSecure } from "@/hooks/useSecureStore";
import axios from "axios";
import { BASE_URL } from "@/env.js";
import { connectSocket, disconnectSocket } from '@/utils/socket'

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  console.log('user from context ', user)
  
  useEffect(() => {
    if (user && user._id) {
      connectSocket(user._id);
    }
  }, [user?._id]);

  const loadAuth = async () => {
    const savedToken = await getSecure("token");
    if (!savedToken) {
      setLoading(false);
      return;
    }
  
    try {
      const { data } = await axios.get(`${BASE_URL}/api/user/me`, {
        headers: { Authorization: `Bearer ${savedToken}` },
      });
      setUser(data.user);
      setToken(savedToken);
      await saveSecure("user", JSON.stringify(data.user));
    } catch (e) {
      await deleteSecure("user");
      await deleteSecure("token");
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false); // <-- only mark loading done here
    }
  };
  
  const updateUser = async (userData) => {
    setUser(userData);
    await saveSecure("user", JSON.stringify(userData));
  };
  
  const login = async (userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);
    await saveSecure("user", JSON.stringify(userData));
    await saveSecure("token", tokenData);
  };

  const logout = async () => {
    disconnectSocket();
    setUser(null);
    setToken(null);
    await deleteSecure("user");
    await deleteSecure("token");
  };

  useEffect(() => {
    loadAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
