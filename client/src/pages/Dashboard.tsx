import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../components/Dashboard/Sidebar";
import { Navbar } from "../components/common/Navbar";
import Footer from "@/components/common/Footer";
import getUser from "@/apis/users/getUser";

import Lessons from "@/components/Dashboard/lessons/Lessons";
import ProfileHeader from "@/components/Dashboard/progress/ProfileHeader";
import QuizPage from "./QuizPage";
import Quizzes from "@/components/Dashboard/quiz/Quizzes";
import { Brain, Globe, Sparkles } from "lucide-react";
import ChatArea from "@/components/Dashboard/progress/ChatArea";

// const address: string = localStorage.getItem("walletAddress");
// const userId: string = localStorage.getItem("userId");

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("progress");
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [userData, setUserData] = useState<any>();

  useEffect(() => {
    const getUserData = async () => {
      const address: string = localStorage.getItem("walletAddress");

      const user = await getUser(address);
      console.log(user.data);
      setUserData(user.data);

      localStorage.setItem("userDetails", JSON.stringify(user.data));
    };
    getUserData();
    setIsLoaded(true);
  }, []);

  const userId: string = localStorage.getItem("userId");
  function switchLogic(activeTab: string) {
    switch (activeTab) {
      case "progress":
        return <ProfileHeader data={userData} />;
      case "lessons":
        console.log("Lesson activated");
        return <Lessons userId={userId} />;
      case "quizzes":
        console.log("Quizzes");
        return <Quizzes userId={userId} />;
    }
  }

  return (
    <main>
      <Navbar />

      <main className="flex items-start  min-h-screen md:px-64 py-32 bg-[#0a0a0a] text-white font-nunito ">
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          progress={userData?.knownWords?.length}
        />

        <section className="flex-1 ">
          <AnimatePresence>
            {isLoaded && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-5xl mx-auto bg-zinc-900/50 rounded-md"
              >
                <header className=" flex flex-col justify-center gap-y-5  px-16 pt-16">
                  <article>
                    <motion.h1
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-4xl font-playwrite font-bold mb-12"
                    >
                      Welcome back, {userData?.fullName}!
                    </motion.h1>
                    {/* <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="text-green-500"
                    >
                      Your {userData?.targetLanguage} lesson is due today!
                    </motion.div> */}
                  </article>
                  <section className="flex items-center justify-center gap-x-48 mb-8 w">
                    <motion.div className=" backdrop-blur-sm p-2 rounded-xl flex items-center gap-4">
                      <div className="p-3 bg-green-500/10 rounded-lg">
                        <Brain className="w-5 h-5 text-green-500" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold">Total XP</h3>
                        <p className="text-sm font-bold text-green-500">{15}</p>
                      </div>
                    </motion.div>

                    <motion.div className=" backdrop-blur-sm p-2 rounded-xl flex items-center gap-4">
                      <div className="p-3 bg-green-500/10 rounded-lg">
                        <Sparkles className="w-5 h-5 text-green-500" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold">Current Level</h3>
                        <p className="text-sm font-bold text-green-500">{5}</p>
                      </div>
                    </motion.div>

                    <motion.div className=" backdrop-blur-sm p-2 rounded-xl flex items-center gap-4">
                      <div className="p-3 bg-green-500/10 rounded-lg">
                        <Globe className="w-5 h-5 text-green-500" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold">Day Streak</h3>
                        <p className="text-sm font-bold text-green-500">{2}</p>
                      </div>
                    </motion.div>
                  </section>
                </header>
                <ChatArea />

                <section className="p-12">{switchLogic(activeTab)}</section>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>
      <Footer />
    </main>
  );
};

export default Dashboard;
