const express = require("express");
const ProgressController = require("../controllers/progressController");
const Progress = require("../models/progress");
const User = require("../models/user");

const router = express.Router();
const progressController = new ProgressController(Progress, User);

router.post("/add-xp", (req, res) => progressController.addXP(req, res));

router.post("/get-lesson-nft", (req, res) =>
  progressController.getLessonNFT(req, res)
);

router.get("/get-progress/:userId", (req, res) =>
  progressController.getProgress(req, res)
);

module.exports = router;
