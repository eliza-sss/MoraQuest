
import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export default function SupabaseTest() {
  const [status, setStatus] = useState("Connecting...");
  const [quests, setQuests] = useState([]);

  useEffect(() => {
    async function testConnection() {
      const { data, error } = await supabase
        .from("quests")
        .select("id, title, reward")
        .order("id");

      if (error) {
        setStatus("Error: " + error.message);
        return;
      }

      setQuests(data);
      setStatus("Connected successfully!");
    }

    testConnection();
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h2>MoraQuest Database Test 🌷</h2>
      <p>{status}</p>

      {quests.map((quest) => (
        <p key={quest.id}>
          {quest.title} — 🪙 {quest.reward}
        </p>
      ))}
    </div>
  );
}
