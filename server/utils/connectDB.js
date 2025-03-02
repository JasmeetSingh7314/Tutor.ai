const mongoose = require("mongoose");

async function connectDB(mongoURL) {
  return await mongoose
    .connect(mongoURL)
    .then(() => {
      console.log("mongodb connected");
    })
    .catch((err) => {
      console.log(err);
    });
}

module.exports = { connectDB };
