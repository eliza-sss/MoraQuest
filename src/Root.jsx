
import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import Auth from "./Auth.jsx";
import App from "./App.jsx";

export default function Root() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      const { data, error } = await supabase.auth.getSession();

      if (!mounted) return;

      if (error) {
        console.error("Session error:", error.message);
      }

      setSession(data?.session ?? null);
      setLoading(false);
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return <p style={{ textAlign: "center", padding: 40 }}>Loading MoraQuest... 🌷</p>;
  }

  return session ? <App /> : <Auth />;
}
