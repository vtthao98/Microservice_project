var express = require("express");
var users = require("../models/model.user");
var jwt = require("jsonwebtoken");
var authMiddleware = require("../middlewares/auth");
var logout = require("../middlewares/logout");

var router = express.Router();

//test
router.get("/GET/me", authMiddleware, async (req, res) => {
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
router.post("/POST/login", async (req, res) => {
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

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    role: user.role,
  });
});

//ĐĂNG KÝ
router.post("/POST/register", async (req, res) => {
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

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      role: user.role,
    });
  } catch (error) {
    res.status(400).json({
      message: "Số điện thoại đã tồn tại",
    });
  }
});

//ĐĂNG XUẤT
router.post("/POST/logout", logout);

module.exports = router;
