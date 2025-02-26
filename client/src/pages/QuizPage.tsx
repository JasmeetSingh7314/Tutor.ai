import React, { useEffect, useState } from "react";
import Quiz from "../components/Quiz/Quiz";
import Results from "../components/Quiz/Results";
import type { QuizAnswer } from "../lib/types";
import { createQuiz } from "@/apis/materials/createQuiz";
import { useLocation } from "react-router-dom";

// const mockQuestions = [
//   {
//     ques: "新しい______を積むことが大切です。",
//     simplified_ques: "あたらしい______をつむことがたいせつです。",
//     translation: "It is important to accumulate new ______.",
//     ans: "経験",
//     options: [
//       { word: "経験", reading: "けいけん", meaning: "experience" },
//       { word: "努力", reading: "どりょく", meaning: "effort" },
//       { word: "知識", reading: "ちしき", meaning: "knowledge" },
//       { word: "技術", reading: "ぎじゅつ", meaning: "skill" },
//     ],
//   },
//   {
//     ques: "新しい______を積むことが大切です。",
//     simplified_ques: "あたらしい______をつむことがたいせつです。",
//     translation: "It is important to accumulate new ______.",
//     ans: "経験",
//     options: [
//       { word: "経験", reading: "けいけん", meaning: "experience" },
//       { word: "努力", reading: "どりょく", meaning: "effort" },
//       { word: "知識", reading: "ちしき", meaning: "knowledge" },
//       { word: "技術", reading: "ぎじゅつ", meaning: "skill" },
//     ],
//   },
// ];

const QuizPage: React.FC = () => {
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);

  const location = useLocation().state;

  const quizData = location.quiz;
  const isNew = location.isNew;

  // useEffect(() => {
  //   const getQuiz = async () => {
  //     const quiz = await createQuiz(localStorage.getItem("userId"));
  //     console.log(quiz);
  //   };
  //   getQuiz();
  // }, []);

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
        <Quiz onComplete={handleQuizComplete} questions={quizData} />
      ) : (
        <Results answers={answers} questions={quizData} onRetry={handleRetry} />
      )}
    </>
  );
};

export default QuizPage;
