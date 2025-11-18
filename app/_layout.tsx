import { Stack } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AuthProvider } from './contexts/AuthContext';
import "../global.css";

export default function RootLayout() {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <SafeAreaView className="flex-1 bg-white">
          <Stack
            screenOptions={{
              headerShown: false,
              headerTransparent: true,    // ✅ Makes header background clear
              headerTitle: "",            // Optional: remove title text
              headerShadowVisible: false, // Optional: remove bottom shadow/border
            }}
          />
        </SafeAreaView>
      </SafeAreaProvider>
    </AuthProvider>
  );
}
