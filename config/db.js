const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to the database.");
  } catch (error) {
    console.error("Error connecting to the database: ", error);
    process.exit(1);
  }
};

module.exports = connectDb;
