var express = require("express");
var cookieParser = require("cookie-parser");
var path = require("path");
var indexRoutes = require("./routes/index");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRoutes);

app.listen(3000, () => {
  console.log("Frontend server running at http://localhost:3000");
});
