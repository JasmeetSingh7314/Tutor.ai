const express = require("express");
const UserHandler = require("../controllers/userController");
const User = require("../models/user");

const router = express.Router();

const handler = new UserHandler(User);

router.post("/create-user", (req, res) => {
  handler.createUser(req, res);
});
router.post("/update-user/:id", (req, res) => {
  handler.updateUser(req, res);
  const fieldName = req.query.fieldName;
  handler.getMaterial(req, res, id, fieldName);
});
module.exports = router;
