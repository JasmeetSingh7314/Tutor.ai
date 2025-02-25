import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../components/Dashboard/Sidebar";
import { Navbar } from "../components/Navbar";
import Footer from "@/components/Footer";
import getUser from "@/apis/users/getUser";

import Lessons from "@/components/Dashboard/Lessons";
import ProfileHeader from "@/components/Dashboard/ProfileHeader";

const address: string = localStorage.getItem("walletAddress");
const userId: string = localStorage.getItem("userId");

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("progress");
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [userData, setUserData] = useState<any>();

  useEffect(() => {
    const getUserData = async () => {
      const user = await getUser(address);
      console.log(user.data);
      setUserData(user.data);

      localStorage.setItem("userDetails", JSON.stringify(user.data));
    };
    getUserData();
    setIsLoaded(true);
  }, []);

  function switchLogic(activeTab: string) {
    switch (activeTab) {
      case "progress":
        return <ProfileHeader data={userData} />;
      case "lessons":
        {
          console.log("Lesson activated");
        }
        return <Lessons userId={userId} />;
      case "quizzes":
        return;
    }
  }

  return (
    <main>
      <Navbar />

      <div className="flex min-h-screen p-48 bg-[#0a0a0a] text-white">
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          progress={userData?.knownWords?.length}
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
                    Welcome back, {userData?.fullName}!
                  </motion.h1>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-green-500"
                  >
                    Your {userData?.targetLanguage} lesson is due today!
                  </motion.div>
                </header>

                {switchLogic(activeTab)}
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
