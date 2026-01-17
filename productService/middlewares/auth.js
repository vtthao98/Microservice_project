var jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
  //Lấy header Authorization
  const token = req.cookies.token;

  //Kiểm tra có token không
  if (!token) {
    console.log("Product service không có token");
    return res.status(401).json({
      message: "Chưa đăng nhập",
    });
  }

  try {
    //Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //Gắn user vào request
    req.user = decoded;

    //Cho đi tiếp
    next();
  } catch (error) {
    return res.status(403).json({
      message: "Token không hợp lệ hoặc đã hết hạn",
    });
  }
};
