require("dotenv").config();
const mongoose = require("mongoose");
function handleError() {
  console.log("DataBase not connected ");
}
 function connectDB() {
  // DataBase Connection
  try {
     mongoose.connect(process.env.MONGO_CONNECTION_URL, {
      useNewUrlParser: true,
        // useCreateIndex: true,
      useUnifiedTopology: true,
        // useFindAndModify: true,
    });
    console.log("Database Connected")
  } catch (error) {
    handleError(error);
  }
}
module.exports = connectDB;
