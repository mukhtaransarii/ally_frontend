import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { BASE_URL } from "@/env.js";
import { connectSocket, disconnectSocket } from "@/utils/socket";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  
  console.log('AuthContext token :', token)
  
  useEffect(() => {
    if (user?._id) connectSocket(user._id);
    return () => disconnectSocket();
  }, [user?._id]);

  const loadAuth = async () => {
    const savedToken = await SecureStore.getItemAsync("token");
    if (!savedToken) return setLoading(false);

    try {
      const { data } = await axios.get(`${BASE_URL}/api/user/me`, {
        headers: { Authorization: `Bearer ${savedToken}` },
      });

      setUser(data.user);
      setToken(savedToken);
      await SecureStore.setItemAsync("user", JSON.stringify(data.user));
    } catch {
      await SecureStore.deleteItemAsync("user");
      await SecureStore.deleteItemAsync("token");
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);
    await SecureStore.setItemAsync("user", JSON.stringify(userData));
    await SecureStore.setItemAsync("token", tokenData);
  };

  const updateUser = async (userData) => {
    setUser(userData);
    await SecureStore.setItemAsync("user", JSON.stringify(userData));
  };

  const logout = async () => {
    disconnectSocket();
    setUser(null);
    setToken(null);
    await SecureStore.deleteItemAsync("user");
    await SecureStore.deleteItemAsync("token");
  };

  useEffect(() => {
    loadAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);