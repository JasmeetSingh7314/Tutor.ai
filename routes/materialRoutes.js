const express = require("express");
const MaterialHandler = require("../controllers/materialController");
const Material = require("../models/material");

const router = express.Router();
const handler = new MaterialHandler(Material);

router.post("/create-material", (req, res) => {
  handler.createMaterial(req, res);
});

module.exports = router;
