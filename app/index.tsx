import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";

export default function Index() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) router.replace("/auth/login");
    else if (user.role === "partner") router.replace("/(partner)");
    else router.replace("/(user)");
  }, [loading, user]);

  return null;
}
