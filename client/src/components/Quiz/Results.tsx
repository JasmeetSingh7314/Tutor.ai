import React from 'react';
import { motion } from 'framer-motion';
import type { QuizAnswer, QuizQuestion } from '../types/quiz';
import { CheckCircle, XCircle } from 'lucide-react';

interface ResultsProps {
  answers: QuizAnswer[];
  questions: QuizQuestion[];
  onRetry: () => void;
}

const Results: React.FC<ResultsProps> = ({ answers, questions, onRetry }) => {
  const correctAnswers = answers.filter(answer => answer.isCorrect).length;
  const score = (correctAnswers / questions.length) * 100;

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-black/30 backdrop-blur-md p-8 rounded-2xl shadow-xl"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Quiz Results</h2>
          <p className="text-xl text-gray-400">
            You scored {score.toFixed(0)}% ({correctAnswers} out of {questions.length})
          </p>
        </div>

        <div className="space-y-6">
          {answers.map((answer, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 rounded-lg p-6 space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-xl font-medium text-white">
                    {questions[index].ques}
                  </p>
                  <p className="text-gray-400">
                    {questions[index].simplified_ques}
                  </p>
                  <p className="text-gray-500 italic">
                    {questions[index].translation}
                  </p>
                </div>
                {answer.isCorrect ? (
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                )}
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-sm text-gray-400 mb-1">Your answer:</p>
                  <p className={`text-lg font-medium ${answer.isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                    {answer.selectedAnswer}
                  </p>
                </div>
                {!answer.isCorrect && (
                  <div className="flex-1">
                    <p className="text-sm text-gray-400 mb-1">Correct answer:</p>
                    <p className="text-lg font-medium text-green-500">
                      {questions[index].ans}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onRetry}
          className="w-full mt-8 py-4 px-6 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-lg transition-colors"
        >
          Try Again
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Results;