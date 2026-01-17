module.exports = async function checkAdmin(req, res, next) {
  try {
    console.log("check admin");
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

    const user = await response.json();

    if (user.role !== "admin") {
      return res.redirect("/");
    }

    next();
  } catch (err) {
    return res.redirect("/");
  }
};
