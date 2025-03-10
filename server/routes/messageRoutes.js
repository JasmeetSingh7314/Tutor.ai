const express = require("express");
const MessageHandler = require("../controllers/messageController");
const User = require("../models/user");
const Material = require("../models/material");
const Progress = require("../models/progress");
const router = express.Router();
const handler = new MessageHandler(User, Material, Progress);

router.post("/send-message/:id", (req, res) => {
  handler.messageIntent(req, res);
});

router.put("/update-messages", (req, res) => {
  handler.addConversation(req, res);
});
router.get("/get-messages/:id", (req, res) => {
  handler.getConversations(req, res);
});

module.exports = router;
