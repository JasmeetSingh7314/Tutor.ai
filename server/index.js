const express = require("express");
require("dotenv").config();
const { connectDB } = require("./utils/connectDB");
const { initModel } = require("./services/aiModel");
const userRouter = require("./routes/userRoutes");
const materialRouter = require("./routes/materialRoutes");

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/users", userRouter);
app.use("/api/material", materialRouter);

connectDB(process.env.MONGO_URL);
// initModel();

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
