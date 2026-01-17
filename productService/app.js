var express = require("express");
var cookieParser = require("cookie-parser");
var cors = require("cors");
var mongoose = require("mongoose");
var indexRoutes = require("./routes/index");
require("dotenv").config();

var app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

//KẾT NỐI DB
mongoose
  .connect("mongodb://mongodb:27017/productdb")
  .then(() => console.log("Mongodb connected productdb"))
  .catch((err) => console.error(err));

app.use("/", indexRoutes);

app.listen(3002, () => {
  console.log("Product Service running at http://localhost:3002");
});
