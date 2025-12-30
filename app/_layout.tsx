import { useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import "../global.css";

import { AuthProvider } from "@/contexts/AuthContext";
import { UserProvider } from "@/contexts/UserContext";
import { PartnerProvider } from "@/contexts/PartnerContext";
import { TripProvider } from "@/contexts/TripContext";
import Toast from "react-native-toast-message";

export default function RootLayout() {
  
  return (
    <AuthProvider>
      <UserProvider>
        <TripProvider>
          <PartnerProvider>
            <SafeAreaProvider>
              <SafeAreaView style={{ flex: 1 }}>
                <Stack screenOptions={{ headerShown: false }} />
                <Toast />
              </SafeAreaView>
            </SafeAreaProvider>
          </PartnerProvider>
        </TripProvider>
      </UserProvider>
    </AuthProvider>
  );
}