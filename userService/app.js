var express = require("express");
var cors = require("cors");
var mongoose = require("mongoose");
var users = require("./models/model.user");

var app = express();

app.use(express.json());
app.use(cors());

//KẾT NỐI DB
mongoose
  .connect("mongodb://localhost:27017/userdb")
  .then(() => console.log("Mongodb connected userdb"))
  .catch((err) => console.error(err));

//ĐĂNG NHẬP
app.post("/", async (req, res) => {
  const { phone, password } = req.body;
  if (!phone || !password) {
    return res.status(400).json({
      message: "Thiếu phone hoặc password",
    });
  }

  const user = await users.findOne({ phone: phone, password: password });

  if (!user) {
    return res.status(401).json({
      message: "Sai tài khoản hoặc mật khẩu",
    });
  }

  res.status(200).json({
    id: user.id,
    role: user.role,
  });
});

//ĐĂNG KÝ
app.post("/register", async (req, res) => {
  const { name, phone, password } = req.body;
  if (!phone || !password) {
    return res.status(400).json({
      message: "Thiếu phone hoặc password",
    });
  }

  try {
    const user = new users({ name, phone, password });
    await user.save();

    res.status(201).json({
      id: user.id,
      role: user.role,
    });
  } catch (error) {
    res.status(400).json({
      message: "Số điện thoại đã tồn tại",
    });
  }
});

app.listen(3001, () => {
  console.log("Frontend server running at http://localhost:3001");
});
