var express = require("express");
var users = require("../models/model.user");
var jwt = require("jsonwebtoken");
var authMiddleware = require("../middlewares/auth");

var router = express.Router();

//test
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await users.findById(req.user.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({
      message: "Tải thông tin người dùng không thành công",
      error: error.message,
    });
  }
});

//ĐĂNG NHẬP
router.post("/", async (req, res) => {
  const { phone, password } = req.body;
  if (!phone || !password) {
    return res.status(400).json({
      message: "Thiếu phone hoặc password",
    });
  }

  const user = await users.findOne({
    phone: phone,
    password: password,
  });

  if (!user) {
    return res.status(401).json({
      message: "Sai số điện thoại hoặc mật khẩu",
    });
  }
  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.status(200).json({
    token: token,
    role: user.role,
  });
});

//ĐĂNG KÝ
router.post("/register", async (req, res) => {
  const { name, phone, password } = req.body;
  if (!phone || !password) {
    return res.status(400).json({
      message: "Thiếu phone hoặc password",
    });
  }

  try {
    const user = new users({ name, phone, password });
    await user.save();

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      token: token,
      role: user.role,
    });
  } catch (error) {
    res.status(400).json({
      message: "Số điện thoại đã tồn tại",
    });
  }
});

module.exports = router;
