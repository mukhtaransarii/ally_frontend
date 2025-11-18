import { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [onboardingData, setOnboardingData] = useState({
    name: '',
    phone: '',
    password: '',
    workType: '',
    skills: [],
    assets: []
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      const userData = await SecureStore.getItemAsync('userData');
      
      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        
        if (parsedUser.isProfileComplete) {
          router.replace('/(tabs)');
        } else {
          router.replace('/(auth)/onboarding');
        }
      } else {
        router.replace('/(auth)/login');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      router.replace('/(auth)/login');
    }
  };

  const sendOtp = async (email) => {
    try {
      const response = await fetch('http://your-backend-ip:5000/api/ally/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Send OTP error:', error);
      return { success: false, message: 'Network error' };
    }
  };

  const verifyOtp = async (email, otp) => {
    try {
      const response = await fetch('http://your-backend-ip:5000/api/ally/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      
      if (data.success) {
        await SecureStore.setItemAsync('userToken', data.data.token);
        await SecureStore.setItemAsync('userData', JSON.stringify(data.data.ally));
        setUser(data.data.ally);
        
        if (data.data.ally.isProfileComplete) {
          router.replace('/(tabs)');
        } else {
          router.replace('/(auth)/onboarding');
        }
      }
      
      return data;
    } catch (error) {
      console.error('Verify OTP error:', error);
      return { success: false, message: 'Network error' };
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      
      const response = await fetch('http://your-backend-ip:5000/api/ally/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();
      
      if (data.success) {
        const completeUser = { ...data.data.ally, isProfileComplete: true };
        await SecureStore.setItemAsync('userData', JSON.stringify(completeUser));
        setUser(completeUser);
        router.replace('/(tabs)');
      }
      
      return data;
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, message: 'Network error' };
    }
  };

  const updateOnboarding = (data) => {
    setOnboardingData(prev => ({ ...prev, ...data }));
  };

  const completeOnboarding = async () => {
    const profileData = {
      personalInfo: {
        name: onboardingData.name,
        phone: onboardingData.phone,
        password: onboardingData.password
      },
      workProfile: {
        primaryWorkType: onboardingData.workType,
        skills: onboardingData.skills.map(skill => ({ skillName: skill }))
      },
      assets: onboardingData.assets.map(asset => ({ 
        assetType: 'vehicle', 
        vehicleInfo: { model: asset } 
      }))
    };

    return await updateProfile(profileData);
  };

  return (
    <AuthContext.Provider value={{
      user,
      onboardingData,
      sendOtp,
      verifyOtp,
      updateOnboarding,
      completeOnboarding
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);