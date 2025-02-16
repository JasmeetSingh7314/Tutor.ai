const express = require("express");
const UserHandler = require("../controllers/userController");
const User = require("../models/user");

const router = express.Router();

const handler = new UserHandler(User);

router.post("/create-user", (req, res) => {
  handler.createUser(req, res);
});

module.exports = router;
