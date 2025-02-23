import React, { useEffect, useState } from "react";
import Quiz from "../components/quiz/Quiz";
import Results from "../components/quiz/Results";
import type { QuizAnswer } from "../lib/types";
import { createQuiz } from "@/apis/materials/createQuiz";

const mockQuestions = [
  {
    ques: "新しい______を積むことが大切です。",
    simplified_ques: "あたらしい______をつむことがたいせつです。",
    translation: "It is important to accumulate new ______.",
    ans: "経験",
    options: [
      { word: "経験", reading: "けいけん", meaning: "experience" },
      { word: "努力", reading: "どりょく", meaning: "effort" },
      { word: "知識", reading: "ちしき", meaning: "knowledge" },
      { word: "技術", reading: "ぎじゅつ", meaning: "skill" },
    ],
  },
  {
    ques: "新しい______を積むことが大切です。",
    simplified_ques: "あたらしい______をつむことがたいせつです。",
    translation: "It is important to accumulate new ______.",
    ans: "経験",
    options: [
      { word: "経験", reading: "けいけん", meaning: "experience" },
      { word: "努力", reading: "どりょく", meaning: "effort" },
      { word: "知識", reading: "ちしき", meaning: "knowledge" },
      { word: "技術", reading: "ぎじゅつ", meaning: "skill" },
    ],
  },
];

const QuizPage: React.FC = () => {
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  useEffect(() => {
    const getQuiz = async () => {
      const quiz = createQuiz(localStorage.getItem("userId"));
      console.log(quiz);
    };
    getQuiz();
  }, []);

  const handleQuizComplete = (quizAnswers: QuizAnswer[]) => {
    setAnswers(quizAnswers);
    setIsQuizComplete(true);
  };

  const handleRetry = () => {
    setIsQuizComplete(false);
    setAnswers([]);
  };

  return (
    <>
      {!isQuizComplete ? (
        <Quiz onComplete={handleQuizComplete} />
      ) : (
        <Results
          answers={answers}
          questions={mockQuestions}
          onRetry={handleRetry}
        />
      )}
    </>
  );
};

export default QuizPage;
