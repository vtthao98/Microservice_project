var jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  //Lấy header Authorization
  const authHeader = req.headers["authorization"];

  //Kiểm tra có token không
  if (!authHeader) {
    return res.status(401).json({
      message: "Chưa đăng nhập",
    });
  }

  //Tách token
  const token = authHeader.split(" ")[1];

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
