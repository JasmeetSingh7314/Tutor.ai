import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../components/Dashboard/Sidebar";
import { Navbar } from "../components/common/Navbar";
import Footer from "@/components/common/Footer";
import getUser from "@/apis/users/getUser";
import Lessons from "@/components/Dashboard/lessons/Lessons";
import ProfileHeader from "@/components/Dashboard/progress/ProfileHeader";
import Quizzes from "@/components/Dashboard/quiz/Quizzes";
import { Brain, Globe, Sparkles } from "lucide-react";
import ChatArea from "@/components/Dashboard/progress/ChatArea";
import { getProgress } from "@/apis/users/getProgress";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { getBalance } from "@/apis/users/getBalance";

// const address: string = localStorage.getItem("walletAddress");
// const userId: string = localStorage.getItem("userId");

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("progress");
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [userData, setUserData] = useState<any>();
  const [userProgress, setUserProgress] = useState<any>();
  const [userBalance, setUserBalance] = useState<any>();

  useEffect(() => {
    const getUserData = async () => {
      const address = localStorage.getItem("walletAddress") as string;

      const user = await getUser(address);
      console.log(user.data);
      setUserData(user.data);

      const progress = await getProgress(user.data._id);
      console.log("The progress is:", progress.data);
      setUserProgress(progress.data);

      const userBalance = await getBalance(address);
      console.log(userBalance);
      setUserBalance(userBalance.result);

      localStorage.setItem("userDetails", JSON.stringify(user.data));
    };
    getUserData();
    setIsLoaded(true);
  }, []);

  const userId = localStorage.getItem("userId") as string;

  function switchLogic(activeTab: string) {
    switch (activeTab) {
      case "progress":
        return <ProfileHeader userData={userData} progress={userProgress} />;
      case "lessons":
        console.log("Lesson activated");
        return <Lessons />;
      case "quizzes":
        console.log("Quizzes");
        return <Quizzes userId={userId} />;
    }
  }

  return (
    <main>
      <Navbar />

      <main className="flex items-start min-h-screen md:px-64 py-32 bg-[#0a0a0a] text-white font-nunito ">
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          progress={userData?.knownWords?.length}
        />
        <section className="flex-1 relative  ">
          <AnimatePresence>
            {isLoaded && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-5xl mx-auto bg-zinc-900/50 rounded-md"
              >
                <header className=" flex  flex-col justify-center gap-y-5  px-16 pt-16">
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
                    <span className="font-semibold font-nunito text-[#40c540] flex gap-x-2 mx-6">
                      {" "}
                      Balance:<span>{userBalance} $TAI</span>
                    </span>
                  </article>
                  <section className="flex items-center justify-center gap-x-48 mb-8 w">
                    <motion.div className=" backdrop-blur-sm p-2 rounded-xl flex items-center gap-4">
                      <div className="p-3 bg-green-500/10 rounded-lg">
                        <Brain className="w-5 h-5 text-green-500" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold">Total XP</h3>
                        <p className="text-sm font-bold text-green-500">
                          {userProgress?.xp}
                        </p>
                      </div>
                    </motion.div>

                    <motion.div className=" backdrop-blur-sm p-2 rounded-xl flex items-center gap-4">
                      <div className="p-3 bg-green-500/10 rounded-lg">
                        <Sparkles className="w-5 h-5 text-green-500" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold">Current Level</h3>
                        <p className="text-sm font-bold text-green-500">
                          {userProgress?.level}
                        </p>
                      </div>
                    </motion.div>

                    <motion.div className=" backdrop-blur-sm p-2 rounded-xl flex items-center gap-4">
                      <div className="p-3 bg-green-500/10 rounded-lg">
                        <Globe className="w-5 h-5 text-green-500" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold">XP needed:</h3>
                        <p className="text-sm font-bold text-green-500">
                          {userProgress?.xpRequiredForNextLevel -
                            userProgress?.xp}
                        </p>
                      </div>
                    </motion.div>
                  </section>
                </header>
                <ChatArea data={userData} />

                <section className="p-12">{switchLogic(activeTab)}</section>

                <ToastContainer
                  position="bottom-right"
                  autoClose={5000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick={false}
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="dark"
                  transition={Bounce}
                />
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
