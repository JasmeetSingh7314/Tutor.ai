import { motion } from "framer-motion";
import React from "react";
import { useNavigate } from "react-router-dom";
type QuizCardProps = {
  quiz: any;
  index: number;
};
const QuizCard = ({ quiz, index }: QuizCardProps) => {
  console.log(quiz.quiz, index);
  const navigate = useNavigate();
  const handleCardOnClick = () => {
    navigate("/quiz", { state: { quiz: quiz.quiz.quiz, isNew: false } });
  };
  return (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.1 }}
      whileHover={{ scale: 1.001 }}
      className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl hover:border hover: border-gray-200/55 p-6 group h-fit cursor-pointer font-nunito "
      onClick={() => handleCardOnClick()}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <h3 className="text-xl font-semibold text-white mb-2">{`Quiz ${
        index + 1
      }`}</h3>
      <p className="text-gray-400/55 mb-4">Words covered:</p>
      <ul className="flex flex-col gap-y-5 list-disc px-6">
        {quiz.quiz.quiz.map((detail: any, index: number) => (
          <li key={index} className="text-gray-400 text-xl flex gap-x-5 ">
            {detail?.ans}
            {detail?.category}
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

export default QuizCard;
