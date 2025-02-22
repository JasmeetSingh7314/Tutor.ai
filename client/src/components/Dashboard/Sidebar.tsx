import React from "react";
import { motion } from "framer-motion";
import { Brain, Book, Trophy, Star } from "lucide-react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Link } from "react-router-dom";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
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
    { id: "quizzes", icon: Star, label: "Quizzes", link: "" },
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
      className="w-96 bg-black/50 backdrop-blur-lg h-screen p-6 flex flex-col gap-8 border-r border-[#959595] border-opacity-20"
    >
      <div className="w-32 h-32 mx-auto">
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

      <nav className="flex flex-col gap-4 divide-y gap-y-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Link to={tab.link} className="w-full">
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center w-full gap-3 px-4 py-3 rounded-lg transition-colors mt-2 ${
                  activeTab === tab.id
                    ? "bg-green-600 text-white"
                    : "text-gray-400 hover:bg-green-600/10"
                }`}
                onClick={() => onTabChange(tab.id)}
              >
                <Icon size={20} />
                <span>{tab.label}</span>
              </motion.button>
            </Link>
          );
        })}
      </nav>
    </motion.div>
  );
};

export default Sidebar;
