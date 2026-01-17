module.exports = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  res.json({ message: "Đã đăng xuất" });
};
