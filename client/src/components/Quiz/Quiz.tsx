import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import type { QuizQuestion, QuizAnswer } from "../../lib/types";
import { Checkbox } from "../ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";

interface QuizProps {
  onComplete: (answers: QuizAnswer[]) => void;
  questions: any;
}

const Quiz: React.FC<QuizProps> = ({ onComplete, questions }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const { register, handleSubmit, reset, watch, setValue } = useForm();
  const [isSelected, setIsSelected] = React.useState(false);

  const onSubmit = (data: any) => {
    const selectedAnswer = data.answer;
    const isCorrect = selectedAnswer === questions[currentQuestion].ans;

    const newAnswer: QuizAnswer = {
      questionIndex: currentQuestion,
      selectedAnswer,
      isCorrect,
    };

    setAnswers([...answers, newAnswer]);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      reset();
    } else {
      onComplete([...answers, newAnswer]);
    }
  };
  const selectedAnswer = watch("answer");

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ type: "spring", stiffness: 100, duration: "0.2" }}
          className="w-full max-w-2xl bg-black/30 backdrop-blur-md p-8 rounded-2xl shadow-xl"
        >
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              Question {currentQuestion + 1} of {questions.length}
            </h2>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all duration-300"
                style={{
                  width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                }}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <p className="text-2xl font-medium text-white">
                {questions[currentQuestion].ques}
              </p>
              <p className="text-xl text-gray-400">
                {questions[currentQuestion].simplified_ques}
              </p>
              <p className="text-lg text-gray-500 italic">
                {questions[currentQuestion].translation}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 mt-8">
              <RadioGroup
                // Update form state
                value={selectedAnswer} // Bind the selected value
                onValueChange={(value) => setValue("answer", value)}
                className="space-y-4"
              >
                {questions[currentQuestion].options.map((option: any) => (
                  <label
                    key={option.word}
                    className="relative flex gap-x-5 items-center p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group"
                  >
                    <RadioGroupItem
                      value={option.word} // Set the value for each radio button
                      id={option.word} // Unique ID for each radio button
                      className="w-6 h-6" // Custom size
                    />
                    <Label
                      htmlFor={option.word}
                      className="flex flex-col cursor-pointer"
                    >
                      <p className="text-lg font-medium text-white group-hover:text-green-500 transition-colors">
                        {option.word}
                      </p>
                      <p className="text-sm text-gray-400">
                        {option.reading} • {option.meaning}
                      </p>
                    </Label>
                  </label>
                ))}
              </RadioGroup>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 px-6 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-lg transition-colors"
              type="submit"
            >
              {currentQuestion === questions.length - 1
                ? "Finish Quiz"
                : "Next Question"}
            </motion.button>
          </form>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Quiz;
