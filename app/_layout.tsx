import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/authStore";
import { Stack, useRouter } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import "../global.css";
import { UserProvider } from '@/contexts/UserContext'
import { PartnerProvider } from '@/contexts/PartnerContext'

export default function RootLayout() {
  const router = useRouter();
  const { user, loadAuth } = useAuth();
  const [ready, setReady] = useState(false); // track if auth is loaded

  useEffect(() => {
    const init = async () => {
      await loadAuth();
      setReady(true); // now we can safely navigate
    };
    init();
  }, []);
  
  useEffect(() => {
    if (!ready) return; // wait until auth is loaded

    if (!user) {
      router.replace("/auth/login");
      return;
    }

    if (user.role === "user") {
      router.replace("/(user)");
    } else if (user.role === "partner") {
      router.replace("/(partner)");
    } else {
      router.replace("/auth/login"); // fallback
    }

  }, [user, ready]);

  

  return (
    <UserProvider>
      <PartnerProvider>
        <SafeAreaProvider>
          <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: "#fff" },
              }}
            />
          </SafeAreaView>
        </SafeAreaProvider>
      </PartnerProvider>
    </UserProvider>
  );
}
