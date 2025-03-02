const express = require("express");
const MessageHandler = require("../controllers/messageController");
const User = require("../models/user");
const Material = require("../models/material");

const router = express.Router();
const handler = new MessageHandler(User, Material);

router.post("/send-message/:id", (req, res) => {
  handler.messageIntent(req, res);
});

router.post("/update-messages", (req, res) => {
  handler.updateMessages(req, res);
});

module.exports = router;
