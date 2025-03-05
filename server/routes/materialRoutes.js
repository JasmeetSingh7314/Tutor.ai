const express = require("express");
const MaterialHandler = require("../controllers/materialController");
const Material = require("../models/material");

const router = express.Router();
const handler = new MaterialHandler(Material);

router.put("/create-material", (req, res) => {
  handler.createMaterial(req, res);
});
router.get("/get-material/:id", (req, res) => {
  const id = req.params.id;
  handler.getMaterial(req, res, id);
});
router.put("/update-material", (req, res) => {
  handler.updateMaterial(req, res);
});

module.exports = router;
