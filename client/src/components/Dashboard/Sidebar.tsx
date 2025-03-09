import React from "react";
import { motion } from "framer-motion";
import { Brain, Book, Trophy, Star } from "lucide-react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface SidebarProps {
  activeTab: string;
  onTabChange: any;
  progress: number;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  progress,
}) => {
  const tabs = [
    { id: "lessons", icon: Book, label: "Lessons", link: "/lesson" },
    { id: "progress", icon: Brain, label: "Progress", link: "" },
    { id: "quizzes", icon: Star, label: "Quizzes", link: "/quiz" },
    {
      id: "achievements",
      icon: Trophy,
      label: "Achievements",
      link: "",
    },
  ];

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-96  bg-zinc-900/50 rounded-lg backdrop-blur-lg h-fit p-12 flex flex-col gap-y-8  border-[#959595] border-opacity-20 font-nunito"
    >
      <div className="w-32 h-32 mx-auto font-playwrite text-lg">
        <CircularProgressbar
          value={progress}
          text={`${progress}%`}
          styles={buildStyles({
            pathColor: "#22c55e",
            textColor: "#22c55e",
            trailColor: "#1a1a1a",
          })}
        />
      </div>

      <nav className="flex flex-col gap-4 divide-y gap-y-6 ">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center w-full gap-3 px-4 py-3 rounded-lg transition-colors mt-2 ${
                activeTab === tab.id
                  ? "bg-green-600 text-white"
                  : "text-gray-400 bg-zinc-500/15 hover:bg-green-600/10"
              }`}
              onClick={() => onTabChange(tab.id)}
            >
              <Icon size={20} />
              <span>{tab.label}</span>
            </motion.button>
          );
        })}
      </nav>
    </motion.div>
  );
};

export default Sidebar;
