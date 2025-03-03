const express = require("express");
const QuizController = require("../controllers/quizController");

const router = express.Router();

router.get("/next-quiz/:userId", QuizController.getNextQuiz);

router.post("/complete-quiz/:userId", QuizController.markQuizAsCompleted);

module.exports = router;
