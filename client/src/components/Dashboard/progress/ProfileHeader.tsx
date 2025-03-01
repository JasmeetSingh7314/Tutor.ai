import { UserProgress } from "@/lib/types";
import LanguageProgress from "./LanguageProgress";
import { motion } from "framer-motion";
import { Brain, Globe, Sparkles } from "lucide-react";
import ChatArea from "./ChatArea";

const mockProgress: UserProgress = {
  totalXp: 2500,
  nextLevelXp: 3000,
  currentLevel: 15,
  streak: 7,
};

const ProfileHeader = (userData: any) => {
  console.log(userData);
  return (
    <main className="flex flex-col gap-x-5">
      <section className="space-y-6">
        <h2 className="text-2xl font-bold mb-6">Language Progress</h2>

        <LanguageProgress
          key={userData?.data?.targetLanguage}
          language={userData?.data?.targetLanguage}
          level={userData?.data?.priorExperience}
          wordsProgress={userData?.data?.knownWords?.length}
        />
      </section>
    </main>
  );
};

export default ProfileHeader;
