require("dotenv/config");
const mongoose = require("mongoose");
const ConnectDB = async () => {
  mongoose
    .connect(process.env.MONGO_CONNECTION_URL, {
      useUnifiedTopology: true,
    })
    .then(console.log("Connected to the server"))
    .catch((err) => console.log(err));
};

module.exports = ConnectDB;
