module.exports = async function checkAuth(req, res, next) {
  try {
    const response = await fetch("http://user-service:3001/GET/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        cookie: req.headers.cookie,
      },
    });

    if (!response.ok) {
      return res.redirect("/");
    }

    next();
  } catch {
    res.redirect("/");
  }
};
