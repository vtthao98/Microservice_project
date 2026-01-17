var express = require("express");
var cookieParser = require("cookie-parser");
var cors = require("cors");
var mongoose = require("mongoose");
var indexRoutes = require("./routes/index");
require("dotenv").config();

var User = require("./models/model.user");

var app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

// ===== SEED ADMIN =====
const seedAdmin = async () => {
  try {
    const count = await User.countDocuments();
    if (count === 0) {
      await User.create({
        name: "admin",
        phone: "admin",
        password: "123",
        role: "admin",
      });
      console.log("Seed admin created");
    }
  } catch (err) {
    console.error("Seed admin error:", err.message);
  }
};

//KẾT NỐI DB
mongoose
  .connect("mongodb://mongodb:27017/userdb")
  .then(() => {
    console.log("Mongodb connected userdb");
    seedAdmin();
  })
  .catch((err) => console.error(err));

app.use("/", indexRoutes);

app.listen(3001, () => {
  console.log("User server running at http://localhost:3001");
});
