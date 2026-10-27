
import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import "./App.css";

const quests = [
  {
    id: 1,
    title: "Getting to Know Each Other",
    description: "Tell Us a Little About Yourself",
    reward: 50,
    xp: 20,
    icon: "💌",
    category: "Social",
  },
  {
    id: 2,
    title: "Creative Challenge",
    description: "Create Something Unusual",
    reward: 100,
    xp: 40,
    icon: "🎨",
    category: "Creative",
  },
  {
    id: 3,
    title: "New Experience",
    description: "Try Something You’ve Never Done Before",
    reward: 75,
    xp: 30,
    icon: "✨",
    category: "Adventure",
  },
];

const achievements = [
  {
    id: "first-steps",
    title: "First Steps",
    description: "Complete your first quest",
    icon: "🌱",
    reward: 20,
    condition: (completed, ownedItems) =>
      completed.length >= 1,
  },
  {
    id: "fashionista",
    title: "Fashionista",
    description: "Buy your first item",
    icon: "🛍️",
    reward: 30,
    condition: (completed, ownedItems) =>
      ownedItems.some((id) => id !== "cat"),
  },
  {
    id: "quest-lover",
    title: "Quest Lover",
    description: "Complete all current quests",
    icon: "🏆",
    reward: 50,
    condition: (completed, ownedItems) =>
      completed.length === quests.length,
  },
];

const dailyQuests = [
  {
    id: "daily-quest",
    title: "Quest of the Day",
    description: "Complete any regular quest",
    icon: "✨",
    reward: 15,
    xp: 10,
  },
  {
    id: "daily-gift",
    title: "Daily Gift",
    description: "Claim your daily reward",
    icon: "🎁",
    reward: 15,
    xp: 10,
  },
  {
    id: "daily-fashion",
    title: "Fashion Time",
    description: "Visit your wardrobe",
    icon: "🎀",
    reward: 15,
    xp: 10,
  },
];

const shopItems = [
  {
    id: "cat",
    name: "My cat",
    category: "pets",
    price: 0,
    icon: "🐱",
    description: "Your First Gaming Buddy",
    slot: "pet",
  },
  {
    id: "pink-bow",
    name: "Pink bow",
    category: "hats",
    price: 30,
    icon: "🎀",
    description: "A Cute Bow for Every Day",
    slot: "head",
  },
  {
    id: "crown",
    name: "Princess Crown",
    category: "hats",
    price: 100,
    icon: "👑",
    description: "For the Most Important Kitty",
    slot: "head",
  },
  {
    id: "blue-cap",
    name: "Blue Cap",
    category: "hats",
    price: 50,
    icon: "🧢",
    description: "Sporty Style",
    slot: "head",
  },
  {
    id: "pink-glasses",
    name: "Pink Glasses",
    category: "accessories",
    price: 45,
    icon: "🕶️",
    description: "A Stylish Look",
    slot: "face",
  },
  {
    id: "heart-glasses",
    name: "Heart-Shapped Glasses",
    category: "accessories",
    price: 65,
    icon: "💗",
    description: "For a Romantic Mood",
    slot: "face",
  },
  {
    id: "pearl-necklace",
    name: "Pearl Necklace",
    category: "accessories",
    price: 80,
    icon: "📿",
    description: "An Elegant Accessory",
    slot: "neck",
  },
  {
    id: "pink-shirt",
    name: "Pink T-Shirt",
    category: "clothes",
    price: 70,
    icon: "👚",
    description: "A Soft Pink Look",
    slot: "clothes",
  },
  {
    id: "princess-dress",
    name: "Princess Dress",
    category: "clothes",
    price: 150,
    icon: "👗",
    description: "A Festive Dress",
    slot: "clothes",
  },
  {
    id: "flower",
    name: "Little Flower",
    category: "accessories",
    price: 25,
    icon: "🌸",
    description: "A Little Detail to Complete Your Look",
    slot: "decoration",
  },
];

function App() {
  const [profile, setProfile] = useState(null);
const [profileLoading, setProfileLoading] = useState(true);
const [profileError, setProfileError] = useState("");
  const [activeTestQuest, setActiveTestQuest] = useState(null);
  const [testQuestions, setTestQuestions] = useState([]);
  const [testAnswers, setTestAnswers] = useState({});
  const [testLoading, setTestLoading] = useState(false);
  const [testSubmitting, setTestSubmitting] = useState(false);
  const [testError, setTestError] = useState("");
  const [testResult, setTestResult] = useState(null);
  const [passedTests, setPassedTests] = useState([]);
  const [coins, setCoins] = useState(120);
  const [completingQuests, setCompletingQuests] = useState([]);
const [completed, setCompleted] = useState(() => {
  return JSON.parse(
    localStorage.getItem("mora-completed") || "[]"
  );
});


useEffect(() => {
  async function loadCompletedQuests() {
    const { data: userData, error: userError } =
      await supabase.auth.getUser();

    if (userError || !userData.user) return;

    const { data, error } = await supabase
      .from("user_quests")
      .select("quest_id")
      .eq("user_id", userData.user.id);

    if (error) {
      console.error("Couldn't load completed quests:", error.message);
      return;
    }

    setCompleted(data.map((item) => {
      const id = Number(item.quest_id);
      return Number.isNaN(id) ? item.quest_id : id;
    }));
  }

  loadCompletedQuests();
}, []);

useEffect(() => {
  async function loadPassedTests() {
    const { data: userData, error: userError } =
      await supabase.auth.getUser();

    if (userError || !userData.user) return;

    const { data, error } = await supabase
      .from("user_test_progress")
      .select("quest_id")
      .eq("user_id", userData.user.id)
      .eq("passed", true);

    if (error) {
      console.error("Couldn't load passed tests:", error.message);
      return;
    }

    setPassedTests(
      (data || []).map((item) => {
        const id = Number(item.quest_id);
        return Number.isNaN(id) ? item.quest_id : id;
      })
    );
  }

  loadPassedTests();
}, []);

useEffect(() => {
  async function loadAchievements() {
    const { data: userData, error: userError } =
      await supabase.auth.getUser();

    if (userError || !userData.user) return;

    const { data, error } = await supabase
      .from("user_achievements")
      .select("achievement_id")
      .eq("user_id", userData.user.id);

    if (error) {
      console.error("Couldn't load achievements:", error.message);
      return;
    }

    setUnlockedAchievements(
      data.map((item) => item.achievement_id)
    );
  }

  loadAchievements();
}, []);



const [page, setPage] = useState("quests");

const [unlockedAchievements, setUnlockedAchievements] =
  useState(() => {
    return JSON.parse(
      localStorage.getItem("mora-achievements") || "[]"
    );
  });

  const [dailyData, setDailyData] = useState(() => {
  return JSON.parse(
    localStorage.getItem("mora-daily") ||
      '{"lastClaim":"","streak":0}'
  );
});

const [dailyQuestData, setDailyQuestData] = useState(() => {
  return JSON.parse(
    localStorage.getItem("mora-daily-quests") || "null"
  ) || {
    date: new Date().toLocaleDateString("en-CA"),
    completedIds: [],
  };
});

const [dailyMessage, setDailyMessage] = useState("");

const [xp, setXp] = useState(0);

useEffect(() => {
  localStorage.setItem("mora-xp", String(xp));
}, [xp]);

useEffect(() => {
  localStorage.setItem(
    "mora-achievements",
    JSON.stringify(unlockedAchievements)
  );
}, [unlockedAchievements]);

useEffect(() => {
  localStorage.setItem(
    "mora-daily",
    JSON.stringify(dailyData)
  );
}, [dailyData]);

useEffect(() => {
  localStorage.setItem(
    "mora-daily-quests",
    JSON.stringify(dailyQuestData)
  );
}, [dailyQuestData]);

const [profileRetry, setProfileRetry] = useState(0);
useEffect(() => {
  async function loadProfile() {
    try {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError) throw userError;

      const user = userData.user;

      if (!user) {
        setProfileError("Please log in again.");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, coins, xp")
        .eq("id", user.id)
        .single();

      if (error) throw error;

      setProfile({
        ...data,
        email: user.email,
      });

      setCoins(data.coins);
      setXp(data.xp);
    } catch (error) {
  console.error("Couldn't load profile:", error);

  setProfileError(
    "Couldn't load your profile. Please check your connection and try again 💗"
  );
} finally {
  setProfileLoading(false);
}
  }

  loadProfile();
}, [profileRetry]);

useEffect(() => {
  async function loadWardrobe() {
    const { data: userData, error: userError } =
      await supabase.auth.getUser();

    if (userError || !userData.user) return;

    const { data, error } = await supabase
      .from("user_items")
      .select("item_id, is_equipped")
      .eq("user_id", userData.user.id);

    if (error) {
      console.error("Couldn't load wardrobe:", error.message);
      return;
    }

    const savedItems = data.map((item) => item.item_id);
    const savedEquipped = {};

    data.forEach((item) => {
      if (!item.is_equipped) return;

      const shopItem = shopItems.find(
        (shopItem) => shopItem.id === item.item_id
      );

      if (shopItem) {
        savedEquipped[shopItem.slot] = shopItem.id;
      }
    });

    setOwnedItems(
      savedItems.includes("cat")
        ? savedItems
        : ["cat", ...savedItems]
    );

    setEquippedItems(savedEquipped);
  }

  loadWardrobe();
}, []);


useEffect(() => {
  async function loadDailyProgress() {
    const { data: userData, error: userError } =
      await supabase.auth.getUser();

    if (userError || !userData.user) return;

    const today = getToday();

    const [
      { data: progress, error: progressError },
      { data: dailyRows, error: dailyError },
    ] = await Promise.all([
      supabase
        .from("daily_progress")
        .select("last_claim, streak")
        .eq("user_id", userData.user.id)
        .maybeSingle(),

      supabase
        .from("user_daily_quests")
        .select("quest_id")
        .eq("user_id", userData.user.id)
        .eq("quest_date", today),
    ]);

    if (progressError) {
      console.error(
        "Couldn't load daily progress:",
        progressError.message
      );
    } else {
      setDailyData({
        lastClaim: progress?.last_claim || "",
        streak: progress?.streak || 0,
      });
    }

    if (dailyError) {
      console.error(
        "Couldn't load daily quests:",
        dailyError.message
      );
    } else {
      setDailyQuestData({
        date: today,
        completedIds: (dailyRows || []).map(
          (row) => row.quest_id
        ),
      });
    }
  }

  loadDailyProgress();
}, []);

const xpPerLevel = 100;

const level = Math.floor(xp / xpPerLevel) + 1;

const currentLevelXp = xp % xpPerLevel;

const xpProgress = (currentLevelXp / xpPerLevel) * 100;

const [ownedItems, setOwnedItems] = useState(() => {
  return JSON.parse(
    localStorage.getItem("mora-owned-items") || '["cat"]'
  );
});

const [equippedItems, setEquippedItems] = useState(() => {
  return JSON.parse(
    localStorage.getItem("mora-equipped-items") || "{}"
  );
});

const [wardrobeTab, setWardrobeTab] = useState("shop");
const [shopCategory, setShopCategory] = useState("all");
const [shopMessage, setShopMessage] = useState("");

useEffect(() => {
  localStorage.setItem("mora-coins", String(coins));
}, [coins]);

useEffect(() => {
  localStorage.setItem(
    "mora-owned-items",
    JSON.stringify(ownedItems)
  );
}, [ownedItems]);

useEffect(() => {
  localStorage.setItem(
    "mora-equipped-items",
    JSON.stringify(equippedItems)
  );
}, [equippedItems]);

useEffect(() => {
  localStorage.setItem(
    "mora-completed",
    JSON.stringify(completed)
  );
}, [completed]);

  function checkAchievements(
  nextCompleted,
  nextOwnedItems
) {
  

achievements.forEach(async (achievement) => {
  const alreadyUnlocked =
    unlockedAchievements.includes(achievement.id);

  const conditionMet = achievement.condition(
    nextCompleted,
    nextOwnedItems
  );

  if (!alreadyUnlocked && conditionMet) {
    const { data, error } = await supabase.rpc(
      "unlock_achievement",
      {
        p_achievement_id: achievement.id,
      }
    );

    if (error) {
      console.error(
        "Couldn't unlock achievement:",
        error.message
      );
      return;
    }

    if (!data.success) return;

    setUnlockedAchievements((current) =>
      current.includes(achievement.id)
        ? current
        : [...current, achievement.id]
    );

    setCoins(data.coins);

    setProfile((current) =>
      current
        ? { ...current, coins: data.coins }
        : current
    );
  }
});

}

function getToday() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}




async function claimDailyReward() {
  const today = getToday();

  if (dailyData.lastClaim === today) {
    setDailyMessage("You've already claimed today's gift 💗");
    return;
  }

  const { data, error } = await supabase.rpc(
    "claim_daily_reward"
  );

  if (error) {
    console.error("Daily reward error:", error.message);
    setDailyMessage("Couldn't claim your gift. Please try again 💗");
    return;
  }

  if (!data?.success) {
    setDailyMessage("You've already claimed today's gift 💗");
    return;
  }

  setDailyData({
    lastClaim: today,
    streak: data.streak,
  });

  setCoins(data.coins);
  setXp((current) => current + 10);

  setProfile((current) =>
    current
      ? {
          ...current,
          coins: data.coins,
          xp: current.xp + 10,
        }
      : current
  );

  setDailyQuestData((current) => {
    const completedToday =
      current.date === today ? current.completedIds : [];

    return {
      date: today,
      completedIds: completedToday.includes("daily-gift")
        ? completedToday
        : [...completedToday, "daily-gift"],
    };
  });

  setDailyMessage(
    `Day ${data.streak}! You received ${data.bonus} coins! 🎁`
  );
}

async function markDailyQuest(id) {
  const today = getToday();

  const completedToday =
    dailyQuestData.date === today
      ? dailyQuestData.completedIds
      : [];

  if (completedToday.includes(id)) return;

  if (id === "daily-gift") return;

  if (id !== "daily-quest" && id !== "daily-fashion") return;

  const { data, error } = await supabase.rpc(
    "complete_daily_quest",
    { p_quest_id: id }
  );

  if (error) {
    console.error("Daily quest error:", error.message);
    return;
  }

  if (!data?.success) return;

  setDailyQuestData({
    date: today,
    completedIds: [...completedToday, id],
  });

  setCoins((current) => current + data.coins_reward);
  setXp((current) => current + data.xp_reward);

  setProfile((current) =>
    current
      ? {
          ...current,
          coins: current.coins + data.coins_reward,
          xp: current.xp + data.xp_reward,
        }
      : current
  );
}

async function loadQuestTest(quest) {
  setActiveTestQuest(quest);
  setTestQuestions([]);
  setTestAnswers({});
  setTestResult(null);
  setTestError("");
  setTestLoading(true);
  setPage("test");

  try {
    const request = supabase.rpc(
  "get_quest_test",
  { p_quest_id: String(quest.id) }
);

const timeout = new Promise((_, reject) => {
  setTimeout(() => {
    reject(new Error("Test loading timed out"));
  }, 15000);
});

const { data, error } = await Promise.race([
  request,
  timeout,
]);

    if (error) throw error;

    if (!data || !Array.isArray(data.questions)) {
      throw new Error("Test questions could not be loaded.");
    }

    if (data.questions.length === 0) {
      throw new Error("This test has no questions yet.");
    }

    setTestQuestions(data.questions);
  } catch (error) {
  console.error("loadQuestTest error:", error);

  setTestError(
    error.message === "Test loading timed out"
      ? "The test is taking too long to load. Please try again 💗"
      : "Couldn't load the test. Please check your connection and try again 💗"
  );
} finally {
  setTestLoading(false);
}
}



async function submitQuestTest() {
  if (!activeTestQuest || testSubmitting) return;

  if (testQuestions.some((question) => !testAnswers[question.id])) {
    setTestError("Please answer every question first 💗");
    return;
  }

  const questId = activeTestQuest.id;

  setTestSubmitting(true);
  setTestError("");
  setTestResult(null);

  try {
    const answers = testQuestions.map((question) => ({
      question_id: question.id,
      answer: testAnswers[question.id],
    }));

    const { data, error } = await supabase.rpc(
      "submit_quest_test",
      {
        p_quest_id: String(questId),
        p_answers: answers,
      }
    );

    if (error) throw error;

    if (!data || typeof data !== "object") {
      throw new Error("The server returned an invalid response.");
    }

    setTestResult(data);

    if (data.test_passed || data.passed) {
      setPassedTests((current) =>
        current.includes(questId)
          ? current
          : [...current, questId]
      );
    }
  } catch (error) {
    console.error("submit_quest_test error:", error);

    setTestError(
      "Couldn't submit your answers. Please check your connection and try again 💗"
    );
  } finally {
    setTestSubmitting(false);
  }
}

async function completeQuest(quest) {
  if (
    completed.includes(quest.id) ||
    completingQuests.includes(quest.id)
  ) {
    return;
  }

  setCompletingQuests((current) => [...current, quest.id]);

  try {
    const { data, error } = await supabase.rpc(
      "complete_quest",
      { p_quest_id: String(quest.id) }
    );

    if (error) {
      console.error("complete_quest error:", error);
      alert("Couldn't complete the quest. Please try again 💗");
      return;
    }

    if (!data?.success) {
      const messages = {
        "Test not passed":
          "Please pass the test before completing this quest 💗",
        "Quest already completed":
          "This quest has already been completed 💗",
      };

      alert(
        messages[data?.message] ||
          "Couldn't complete this quest. Please try again 💗"
      );
      return;
    }

    const nextCompleted = [...completed, quest.id];

    setCompleted(nextCompleted);
    setCoins((current) => current + data.coins_reward);
    setXp((current) => current + data.xp_reward);

    setProfile((current) =>
      current
        ? {
            ...current,
            coins: current.coins + data.coins_reward,
            xp: current.xp + data.xp_reward,
          }
        : current
    );

    checkAchievements(nextCompleted, ownedItems);

    // Completing a normal quest also completes the daily quest.
    await markDailyQuest("daily-quest");
  } catch (err) {
    console.error("Unexpected quest completion error:", err);
    alert("Something went wrong. Check your connection and try again 💗");
  } finally {
    setCompletingQuests((current) =>
      current.filter((id) => id !== quest.id)
    );
  }
}
  
async function buyItem(item) {
  if (ownedItems.includes(item.id)) {
    setShopMessage("This Item Has Already Been Purchased 💗");
    return;
  }

  const { data, error } = await supabase.rpc(
    "buy_shop_item",
    { p_item_id: item.id }
  );

  if (error) {
    setShopMessage("Purchase failed: " + error.message);
    return;
  }

  if (!data.success) {
    if (data.message === "Not enough coins") {
      setShopMessage("Not Enough Coins Yet 🥹");
    } else {
      setShopMessage("This Item Has Already Been Purchased 💗");
    }
    return;
  }
  const [buyingItemId, setBuyingItemId] = useState(null);
  const nextOwnedItems = [...ownedItems, item.id];

  setOwnedItems(nextOwnedItems);
  setCoins(data.coins);

  setProfile((current) =>
    current
      ? { ...current, coins: data.coins }
      : current
  );

  checkAchievements(completed, nextOwnedItems);

  setShopMessage(`You Bought: ${item.name}! 🎉`);
}


async function equipItem(item) {
  if (!ownedItems.includes(item.id)) return;

  const { data, error } = await supabase.rpc(
    "equip_shop_item",
    {
      p_item_id: item.id,
      p_equipped: true,
    }
  );

  if (error) {
    setShopMessage("Couldn't equip item: " + error.message);
    return;
  }

  if (!data.success) return;

  setEquippedItems((current) => ({
    ...current,
    [item.slot]: item.id,
  }));

  setShopMessage(`${item.name} Now on Your Kitty! 🩷`);
}

async function removeItem(item) {
  const { data, error } = await supabase.rpc(
    "equip_shop_item",
    {
      p_item_id: item.id,
      p_equipped: false,
    }
  );

  if (error) {
    setShopMessage("Couldn't remove item: " + error.message);
    return;
  }

  if (!data.success) return;

  setEquippedItems((current) => {
    const updated = { ...current };
    delete updated[item.slot];
    return updated;
  });

  setShopMessage(`${item.name} Removed 🐾`);
}

const visibleItems = shopItems.filter((item) => {
  if (shopCategory === "all") return true;
  return item.category === shopCategory;
});

  return (
    <div className="app">
      <header className="topbar">
        <a className="logo" href="#home">
          ✿ MoraQuest
        </a>

        <div className="profile">
          <span className="coin">🪙 {coins}</span>
          <span className="avatar">🐱</span>
        </div>
      </header>

      <main className="container">
        <section className="welcome">
          <div>
            <p className="eyebrow">Your Little Adventure</p>
            <h1>
              Hello, Player!! <span>♡</span>
            </h1>
            <p className="subtitle">
              Complete quests, collect coins
               and unlock new possibilities.
            </p>
          </div>

          <div className="hero-character">🐱</div>
        </section>

        <section className="level-card">
  <div className="level-info">
    <div>
      <span className="level-label">YOUR ADVENTURE</span>
      <h2>Level {level} ✨</h2>
    </div>

    <span className="xp-counter">
      {currentLevelXp} / {xpPerLevel} XP
    </span>
  </div>

  <div className="xp-bar">
    <div
      className="xp-fill"
      style={{ width: `${xpProgress}%` }}
    />
  </div>

  <p>
    {xpPerLevel - currentLevelXp} XP until Level {level + 1} ♡
  </p>
</section>

<section className="daily-card">
  <div className="daily-card-icon">🎁</div>

  <div className="daily-card-content">
    <span className="daily-label">YOUR DAILY GIFT</span>
    <h2>Daily Reward 🌷</h2>

    <p>
      🔥 {dailyData.streak} day
      {dailyData.streak === 1 ? "" : "s"} in a row
    </p>

    <p className="daily-description">
      Come back every day for more coins!
    </p>

    {dailyMessage && (
      <p className="daily-message">{dailyMessage}</p>
    )}
  </div>

  <button
    className="daily-button"
    disabled={dailyData.lastClaim === getToday()}
    onClick={claimDailyReward}
  >
    {dailyData.lastClaim === getToday()
      ? "Claimed ✓"
      : "Claim Gift"}
  </button>
</section>

        <section className="stats">
          <div className="stat-card">
            <span>🌷</span>
            <div>
              <strong>{completed.length}</strong>
              <small>Quests Completed</small>
            </div>
          </div>

          <div className="stat-card">
            <span>⭐</span>
            <div>
              <strong>{coins}</strong>
              <small>Your Coins</small>
            </div>
          </div>
        </section>

        <nav className="tabs">
          <button
            className={page === "quests" ? "active" : ""}
            onClick={() => setPage("quests")}
          >
            ♡ Quests
          </button>

          <button
  className={page === "daily" ? "active" : ""}
  onClick={() => setPage("daily")}
>
  ♡ Daily
</button>

          <button
            className={page === "wardrobe" ? "active" : ""}
            onClick={() => {
  setPage("wardrobe");
  markDailyQuest("daily-fashion");
}}
          >
            ♡ Wardrobe
          </button>

          <button
  className={page === "achievements" ? "active" : ""}
  onClick={() => setPage("achievements")}
>
  ♡ Achievements
</button>

          <button
            className={page === "profile" ? "active" : ""}
            onClick={() => setPage("profile")}
          >
            ♡ Profile
          </button>
        </nav>

        {page === "test" && (
  <section className="quest-test-page">
    <div className="section-heading">
      <div>
        <h2>{activeTestQuest?.title} 💗</h2>
        <p>Answer the questions to complete your quest!</p>
      </div>
    </div>

    {testLoading && <p>Loading your test... 🌷</p>}

    {testError && (
      <p className="shop-message">{testError}</p>
    )}

    {!testLoading && !testResult && testQuestions.length > 0 && (
      <div className="test-question-list">
        {testQuestions.map((question, index) => (
          <article className="quest-card" key={question.id}>
            <div className="quest-info">
              <span className="category">
                Question {index + 1} of {testQuestions.length}
              </span>

              <h3>{question.question_text}</h3>

              <div className="test-options">
                {question.options.map((option) => (
                  <label
                    className={`test-option ${
                      testAnswers[question.id] === option.value
                        ? "selected"
                        : ""
                    }`}
                    key={option.value}
                  >
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={option.value}
                      checked={
                        testAnswers[question.id] === option.value
                      }
                      onChange={() =>
                        setTestAnswers((current) => ({
                          ...current,
                          [question.id]: option.value,
                        }))
                      }
                    />

                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </article>
        ))}

        <button
          className="quest-button"
          disabled={testSubmitting}
          onClick={submitQuestTest}
        >
          {testSubmitting ? "Checking answers..." : "Check My Answers ♡"}
        </button>
      </div>
    )}

    {testResult && (
      <div className="quest-card test-result">
        <div className="quest-icon">
          {testResult.passed ? "🎉" : "🌷"}
        </div>

        <div className="quest-info">
          <h3>
            {testResult.passed
              ? "You Passed the Test!"
              : "Almost There!"}
          </h3>

          <p>
            Your score: {testResult.score}/{testResult.total}
          </p>

          <p>
            Result: {testResult.percent}%
          </p>

          <p>
            Passing score: {testResult.passing_percent}%
          </p>

          {testResult.passed ? (
            <p>You can now complete your quest! 💗</p>
          ) : (
            <p>Try again to unlock your quest reward.</p>
          )}
        </div>

        {!testResult.passed && (
          <button
            className="quest-button"
            onClick={() => loadQuestTest(activeTestQuest)}
          >
            Try Again
          </button>
        )}
      </div>
    )}

    <button
      className="shop-action"
      onClick={() => {
        setPage("quests");
        setTestError("");
      }}
    >
      ← Back to Quests
    </button>
  </section>
)}

        {page === "achievements" && (
  <section className="achievements-page">
    <div className="section-heading">
      <div>
        <h2>My Achievements 🏆</h2>
        <p>Every Little Step Deserves a Reward</p>
      </div>

      <span className="counter">
        {unlockedAchievements.length}/{achievements.length}
      </span>
    </div>

    <div className="achievement-grid">
      {achievements.map((achievement) => {
        const unlocked = unlockedAchievements.includes(
          achievement.id
        );

        return (
          <article
            className={`achievement-card ${
              unlocked ? "unlocked" : "locked"
            }`}
            key={achievement.id}
          >
            <div className="achievement-icon">
              {achievement.icon}
            </div>

            <h3>{achievement.title}</h3>
            <p>{achievement.description}</p>

            <span className="reward">
              🪙 +{achievement.reward}
            </span>

            <div className="achievement-status">
              {unlocked ? "✓ Unlocked" : "🔒 Locked"}
            </div>
          </article>
        );
      })}
    </div>
  </section>
)}
        {page === "quests" && (
          <section>
            <div className="section-heading">
              <div>
                <h2>Your Quests</h2>
                <p>Small Tasks, Big Experiences</p>
              </div>
              <span className="counter">
                {completed.length}/{quests.length}
              </span>
            </div>

            <div className="quest-list">
              {quests.map((quest) => {
                const done = completed.includes(quest.id);
                const testPassed = passedTests.includes(quest.id);

                return (
                  <article className="quest-card" key={quest.id}>
                    <div className="quest-icon">
                      {quest.icon}
                    </div>

                    <div className="quest-info">
                      <span className="category">
                        {quest.category}
                      </span>
                      <h3>{quest.title}</h3>
                      <p>{quest.description}</p>
                      <div className="reward">
  🪙 +{quest.reward}
  <span> · ⭐ +{quest.xp} XP</span>
</div>
                    </div>
  
<div className="quest-actions">
  <button
    className="quest-button"
    disabled={done}
    onClick={() => loadQuestTest(quest)}
  >
    {done
      ? "Test Completed ✓"
      : testPassed
        ? "Test Passed ✓"
        : "Take Test ♡"}
  </button>

  <button
    className={done ? "done-button" : "quest-button"}
    disabled={done || !testPassed}
    onClick={() => completeQuest(quest)}
  >
    {done
      ? "Quest Completed ✓"
      : "Complete Quest"}
  </button>
</div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        
{page === "wardrobe" && (
  <section className="wardrobe-page">
    <div className="section-heading">
      <div>
        <h2>Kitty’s Little World 🐱</h2>
        <p>Create a Look You Love</p>
      </div>
      <span className="counter">🪙 {coins}</span>
    </div>

    <div className="cat-showcase">
      <div className="cat-avatar">
        <span className="cat-base">🐱</span>

        {equippedItems.head && (
          <span className="cat-item head-item">
            {shopItems.find(
              (item) => item.id === equippedItems.head
            )?.icon}
          </span>
        )}

        
{equippedItems.face && (
  <span className="cat-item face-item">
    {equippedItems.face === "heart-glasses" ? (
      <svg viewBox="0 0 100 42" width="100" height="42">
        <path
          d="M4 8 L46 8 L46 23
             C46 38 24 42 15 30
             C8 22 7 15 4 8 Z"
          fill="#ff9bc9"
          stroke="#bd387c"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          d="M54 8 L96 8
             C93 15 92 22 85 30
             C76 42 54 38 54 23 Z"
          fill="#ff9bc9"
          stroke="#bd387c"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          d="M46 15 Q50 11 54 15"
          fill="none"
          stroke="#bd387c"
          strokeWidth="3"
        />
        <path
          d="M12 2 L18 2 M82 2 L88 2"
          stroke="#bd387c"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    ) : (
      shopItems.find(
        (item) => item.id === equippedItems.face
      )?.icon
    )}
  </span>
)}

        {equippedItems.neck && (
          <span className="cat-item neck-item">
            {shopItems.find(
              (item) => item.id === equippedItems.neck
            )?.icon}
          </span>
        )}

        {equippedItems.clothes && (
          <span className="cat-item clothes-item">
            {shopItems.find(
              (item) => item.id === equippedItems.clothes
            )?.icon}
          </span>
        )}

        {equippedItems.decoration && (
          <span className="cat-item decoration-item">
            {shopItems.find(
              (item) => item.id === equippedItems.decoration
            )?.icon}
          </span>
        )}
      </div>

      <h3>Your Fluffy Friend</h3>
      <p>Every Accessory Makes Your Look Special!</p>
    </div>

    <div className="wardrobe-tabs">
      <button
        className={wardrobeTab === "shop" ? "active" : ""}
        onClick={() => {
          setWardrobeTab("shop");
          setShopMessage("");
        }}
      >
        🛍️ Shop
      </button>

      <button
        className={wardrobeTab === "closet" ? "active" : ""}
        onClick={() => {
          setWardrobeTab("closet");
          setShopMessage("");
        }}
      >
        🎀 My Items ({ownedItems.length - 1})
      </button>
    </div>

    {shopMessage && (
      <p className="shop-message">{shopMessage}</p>
    )}

    {wardrobeTab === "shop" && (
      <>
        <div className="shop-categories">
          {[
            ["all", "All"],
            ["hats", "Hats"],
            ["clothes", "Clothing"],
            ["accessories", "Accessories"],
          ].map(([id, label]) => (
            <button
              key={id}
              className={shopCategory === id ? "selected" : ""}
              onClick={() => setShopCategory(id)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="shop-grid">
          {visibleItems.map((item) => {
            const owned = ownedItems.includes(item.id);
            const equipped =
              equippedItems[item.slot] === item.id;

            return (
              <article className="shop-card" key={item.id}>
                <div className="shop-item-icon">
                  {item.icon}
                </div>

                <h3>{item.name}</h3>
                <p>{item.description}</p>

                <div className="shop-price">
                  🪙 {item.price}
                </div>

                {owned ? (
                  <button
                    className="shop-action"
                    onClick={() =>
                      equipped
                        ? removeItem(item)
                        : equipItem(item)
                    }
                    disabled={item.id === "cat"}
                  >
                    {item.id === "cat"
                      ? "Your Friend"
                      : equipped
                        ? "Take Off"
                        : "Put On"}
                  </button>
                ) : (
                  <button
                    className="shop-action"
                    onClick={() => buyItem(item)}
                  >
                    Buy
                  </button>
                )}
              </article>
            );
          })}
        </div>
      </>
    )}

    {wardrobeTab === "closet" && (
      <>
        <h3>Your Collection 💕</h3>

        <div className="shop-grid">
          {shopItems
            .filter(
              (item) =>
                ownedItems.includes(item.id) &&
                item.id !== "cat"
            )
            .map((item) => {
              const equipped =
                equippedItems[item.slot] === item.id;

              return (
                <article className="shop-card" key={item.id}>
                  <div className="shop-item-icon">
                    {item.icon}
                  </div>

                  <h3>{item.name}</h3>

                  <button
                    className="shop-action"
                    onClick={() =>
                      equipped
                        ? removeItem(item)
                        : equipItem(item)
                    }
                  >
                    {equipped ? "Take Off" : "Put On"}
                  </button>
                </article>
              );
            })}
        </div>
      </>
    )}
  </section>
)}

{page === "daily" && (
  <section className="daily-quests-page">
    <div className="section-heading">
      <div>
        <h2>Daily Quests 🌷</h2>
        <p>A Little Progress Every Day</p>
      </div>

      <span className="counter">
        {
          (
            dailyQuestData.date === getToday()
              ? dailyQuestData.completedIds
              : []
          ).length
        }/{dailyQuests.length}
      </span>
    </div>

    <div className="daily-quest-list">
      {dailyQuests.map((quest) => {
        const completedToday =
          dailyQuestData.date === getToday()
            ? dailyQuestData.completedIds
            : [];

        const done = completedToday.includes(quest.id);

        return (
          <article
            className={`daily-quest-card ${done ? "daily-done" : ""}`}
            key={quest.id}
          >
            <div className="daily-quest-icon">
              {quest.icon}
            </div>

            <div className="daily-quest-info">
              <h3>{quest.title}</h3>
              <p>{quest.description}</p>

              <span className="daily-quest-reward">
                🪙 +{quest.reward} · ⭐ +{quest.xp} XP
              </span>
            </div>

            <span className="daily-quest-status">
              {done ? "✓ Done" : "In progress"}
            </span>
          </article>
        );
      })}
    </div>

    <p className="daily-reset-note">
      ♡ New daily quests are available tomorrow.
    </p>
  </section>
)}

        {page === "profile" && (
          <section className="extra-page">
            <div className="big-avatar">🐱</div>
            <h2>My Profile</h2>
            {profileLoading ? (
  <p>Loading profile... 🌷</p>
) : profileError ? (
  <>
    <p>{profileError}</p>
    <button
      className="quest-button"
      onClick={() => {
        setProfileError("");
        setProfileLoading(true);
        setProfileRetry((current) => current + 1);
      }}
    >
      Try Again ♡
    </button>
  </>
) : (
  <>
    <p>Account: {profile?.email}</p>
    <p>Profile ID: {profile?.id}</p>
    <p>Database Coins: {profile?.coins}</p>
    <p>Database XP: {profile?.xp}</p>
  </>
)}
            <p>Quests Completed: {completed.length}</p>
            <p>Balance: {coins} coins</p>
          </section>
        )}

        <footer>made with ♡ just for you</footer>
      </main>
    </div>
  );
}

export default App;
