import { updateMaterial } from "@/apis/materials/updateMaterial";
import { Button } from "@heroui/react";
import { stat } from "fs";
import { ArrowRight } from "lucide-react";
import type React from "react";
import { useNavigate } from "react-router-dom";

interface WordDetailsProps {
  wordDetails: {
    word: string;
    reading: string;
    meaning: string;
    components?: string[];
    component_meanings?: string[];
    literal_meaning?: string;
  };
  words: any;
}

const LangCard: React.FC<WordDetailsProps> = ({ wordDetails, words }) => {
  const navigate = useNavigate();
  const handlePress = async () => {
    navigate("/lesson", { state: { lesson: words, isNew: true } });
  };
  return (
    <div className="flex flex-col float-left w-96 relative max-w-md mx-auto my-4 overflow-hidden rounded-xl backdrop-blur-md bg-white/10 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-green-400/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-400/20 rounded-full blur-3xl"></div>

      <div className="relative p-6 z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="text-5xl font-bold text-white">
            {wordDetails?.word}
          </div>
          <div className="text-xl text-green-300 font-medium">
            {wordDetails?.reading}
          </div>
        </div>

        <div className="mb-4">
          <div className="text-sm uppercase tracking-wider text-white/60 mb-1">
            Meaning
          </div>
          <div className="text-xl text-white">{wordDetails?.meaning}</div>
        </div>

        {wordDetails?.components && (
          <div className="flex gap-2 mt-4">
            {wordDetails?.components.map((component, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="text-lg text-white/80">{component}</div>
                {wordDetails.component_meanings && (
                  <div className="text-xs text-white/60">
                    {wordDetails.component_meanings[index]}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {wordDetails?.literal_meaning && (
          <div className="mt-3 text-sm text-white/70 italic">
            {wordDetails.literal_meaning}
          </div>
        )}
      </div>
      <Button
        variant="ghost"
        className="justify-end"
        onPress={() => {
          handlePress();
        }}
      >
        <span className="text-gray-200">Click </span>
        <ArrowRight></ArrowRight>
      </Button>
    </div>
  );
};

export default LangCard;
