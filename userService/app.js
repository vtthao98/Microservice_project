var express = require("express");
var cors = require("cors");
var mongoose = require("mongoose");
var indexRoutes = require("./routes/index");
require("dotenv").config();

var app = express();

app.use(express.json());
app.use(cors());

//KẾT NỐI DB
mongoose
  .connect("mongodb://mongodb:27017/userdb")
  .then(() => console.log("Mongodb connected userdb"))
  .catch((err) => console.error(err));

app.use("/", indexRoutes);

// mongoose
//   .connect("mongodb://localhost:27017/userdb")
//   .then(() => console.log("Mongodb connected userdb"))
//   .catch((err) => console.error(err));

app.listen(3001, () => {
  console.log("User server running at http://localhost:3001");
});
