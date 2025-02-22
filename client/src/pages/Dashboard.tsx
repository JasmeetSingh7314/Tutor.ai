import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../components/Dashboard/Sidebar";
import LanguageProgress from "../components/Dashboard/LanguageProgress";
import { Brain, Sparkles, Globe } from "lucide-react";
import type { Language, UserProgress } from "../lib/types";
import { Navbar } from "../components/Navbar";
import Footer from "@/components/Footer";
import getUser from "@/apis/users/getUser";

const mockLanguages: any[] = [
  { name: "Spanish", progress: 65, wordsLearned: 500, level: 4 },
  { name: "French", progress: 35, wordsLearned: 250, level: 2 },
  { name: "German", progress: 20, wordsLearned: 150, level: 1 },
];

const mockProgress: UserProgress = {
  totalXp: 2500,
  nextLevelXp: 3000,
  currentLevel: 15,
  streak: 7,
};

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("lessons");
  const [isLoaded, setIsLoaded] = useState(false);
  const [userData, setUserData] = useState();

  useEffect(() => {
    const getUserData = async () => {
      const user = await getUser(localStorage.getItem("userId"));
      console.log(user.data);
      setUserData(user.data);

      localStorage.setItem("userDetails", JSON.stringify(user.data));
    };
    getUserData();
    setIsLoaded(true);
  }, []);

  return (
    <main>
      <Navbar />

      <div className="flex min-h-screen p-48 bg-[#0a0a0a] text-white">
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          progress={75}
        />

        <main className="flex-1 p-8">
          <AnimatePresence>
            {isLoaded && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-5xl mx-auto"
              >
                <header className="mb-12">
                  <motion.h1
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-4xl font-bold mb-4"
                  >
                    Welcome back, Learner!
                  </motion.h1>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-green-500"
                  >
                    Your Spanish lesson is due today!
                  </motion.div>
                </header>

                <section className="grid grid-cols-3 gap-6 mb-12">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-black/30 backdrop-blur-sm p-6 rounded-xl flex items-center gap-4"
                  >
                    <div className="p-3 bg-green-500/10 rounded-lg">
                      <Brain className="w-8 h-8 text-green-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Total XP</h3>
                      <p className="text-2xl font-bold text-green-500">
                        {mockProgress.totalXp}
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-black/30 backdrop-blur-sm p-6 rounded-xl flex items-center gap-4"
                  >
                    <div className="p-3 bg-green-500/10 rounded-lg">
                      <Sparkles className="w-8 h-8 text-green-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Current Level</h3>
                      <p className="text-2xl font-bold text-green-500">
                        {mockProgress.currentLevel}
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-black/30 backdrop-blur-sm p-6 rounded-xl flex items-center gap-4"
                  >
                    <div className="p-3 bg-green-500/10 rounded-lg">
                      <Globe className="w-8 h-8 text-green-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Day Streak</h3>
                      <p className="text-2xl font-bold text-green-500">
                        {mockProgress.streak}
                      </p>
                    </div>
                  </motion.div>
                </section>

                <section className="space-y-6">
                  <h2 className="text-2xl font-bold mb-6">Language Progress</h2>
                  {mockLanguages.map((language) => (
                    <LanguageProgress key={language.name} language={language} />
                  ))}
                </section>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
      <Footer />
    </main>
  );
};

export default Dashboard;
