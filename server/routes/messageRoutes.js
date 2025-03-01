const express = require("express");
const MessageHandler = require("../controllers/messageController");

const router = express.Router();
const handler = new MessageHandler();

router.post("/send-message", (req, res) => {
  handler.messageIntent(req, res);
});

module.exports = router;
