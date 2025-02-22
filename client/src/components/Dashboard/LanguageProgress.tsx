import React from "react";
import { motion } from "framer-motion";
import type { Language } from "../../lib/types";

interface LanguageProgressProps {
  language: Language;
}

const LanguageProgress: React.FC<any> = ({ language ,level,wordsProgress}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black/30 backdrop-blur-sm p-6 rounded-xl"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-white">{language}</h3>
        <span className="text-green-500">Tier: {level}</span>
      </div>

      <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${wordsProgress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute h-full bg-green-500 rounded-full"
        />
      </div>

      <div className="mt-4 flex justify-between text-sm text-gray-400">
        <span>{wordsProgress} words learned</span>
        <span>{wordsProgress}% complete</span>
      </div>
    </motion.div>
  );
};

export default LanguageProgress;
