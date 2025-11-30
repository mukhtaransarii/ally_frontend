import React, { createContext, useState, useContext, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      const savedToken = await SecureStore.getItemAsync("authToken");
      const savedUser = await SecureStore.getItemAsync("userData");

      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(savedUser);
        router.replace("/(tabs)");
      } else {
        router.replace("/Login");
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Send OTP
  const sendOtp = async (email) => {
    try {
      const { data } = await axios.post("http://localhost:5000/api/ally/send-otp", { email });
      return { success: data.success };
    } catch (err) {
      console.log("Send OTP Error:", err.message);
      return { success: false, error: err.message };
    }
  };

  // Verify OTP
  const verifyOtp = async (email, otp) => {
    try {
      const { data } = await axios.post("http://localhost:5000/api/ally/verify-otp", { email, otp });
      
      if (data.success) {
        setUser(data.ally);
        setToken(data.token);
        
        // Save to SecureStore
        await SecureStore.setItemAsync("authToken", data.token);
        await SecureStore.setItemAsync("userData", JSON.stringify(data.ally));
        
        return { 
          success: true, 
          profileEmpty: data.profileEmpty 
        };
      }
      return { success: false };
    } catch (err) {
      console.log("Verify OTP Error:", err.message);
      return { success: false, error: err.message };
    }
  };

  // LOGOUT
  const logout = async () => {
    setUser(null);
    setToken(null);
    await SecureStore.deleteItemAsync("authToken");
    await SecureStore.deleteItemAsync("userData");
    router.replace("/Login");
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      loading,
      sendOtp,
      verifyOtp,
      logout 
    }}>
      {!loading && children} 
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);