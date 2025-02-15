const express = require("express");
require("dotenv").config();
const { connectDB } = require("./utils/connectDB");
const { initModel } = require("./services/aiModel");

const app = express();
const port = process.env.PORT;

connectDB(process.env.MONGO_URL);
initModel();

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
