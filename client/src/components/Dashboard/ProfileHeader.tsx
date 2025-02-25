import { UserProgress } from "@/lib/types";
import LanguageProgress from "./LanguageProgress";
import { motion } from "framer-motion";
import { Brain, Globe, Sparkles } from "lucide-react";

const mockProgress: UserProgress = {
  totalXp: 2500,
  nextLevelXp: 3000,
  currentLevel: 15,
  streak: 7,
};

const ProfileHeader = (userData: any) => {
  console.log(userData);
  return (
    <div>
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
              {userData?.data?.knownWords?.length *15}
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
              {5}
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

        <LanguageProgress
          key={userData?.data?.targetLanguage}
          language={userData?.data?.targetLanguage}
          level={userData?.data?.priorExperience}
          wordsProgress={userData?.data?.knownWords?.length}
        />
      </section>
    </div>
  );
};

export default ProfileHeader;
