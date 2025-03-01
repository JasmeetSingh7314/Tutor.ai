const express = require("express");
const LessonController = require("../controllers/lessonController");
const router = express.Router();

router.get("/next-lesson/:userId", LessonController.getNextLesson);


router.post("/complete-lesson/:userId", LessonController.markLessonAsCompleted);

module.exports = router;

