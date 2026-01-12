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
  .connect("mongodb://mongodb:27017/orderdb")
  .then(() => console.log("mongodb connected orderdb"))
  .catch((err) => console.error(err));

app.use("/", indexRoutes);

app.listen(3003, () => {
  console.log("Order Service running at http://localhost:3003");
});
