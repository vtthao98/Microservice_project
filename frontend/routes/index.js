var express = require("express");
var router = express.Router();
const checkAdmin = require("../middlewares/checkAdmin.js");
const checkAuth = require("../middlewares/checkAuth.js");

// Docker network service URLs
const USER_API = "http://user-service:3001";
const PRODUCT_API = "http://product-service:3002";
const ORDER_API = "http://order-service:3003";

//MỞ TRANG ĐĂNG NHẬP
router.get("/", (req, res) => {
  res.render("login", { title: "Đăng nhập" });
});

//ĐĂNG NHẬP
router.post("/", async (req, res) => {
  try {
    const loginData = req.body;
    const response = await fetch(USER_API + "/POST/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(loginData),
    });

    // Forward cookie cho browser
    const setCookie = response.headers.get("set-cookie");
    if (setCookie) {
      res.setHeader("set-cookie", setCookie);
    }

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: "Không kết nối được User Service",
      error: error.message,
    });
  }
});

//MỞ TRANG ĐĂNG KÝ
router.get("/register", (req, res) => {
  res.render("register", { title: "Đăng ký" });
});

//ĐĂNG KÝ
router.post("/register", async (req, res) => {
  try {
    const registerData = req.body;
    const response = await fetch(USER_API + "/POST/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(registerData),
    });

    // Forward cookie cho browser
    const setCookie = response.headers.get("set-cookie");
    if (setCookie) {
      res.setHeader("set-cookie", setCookie);
    }

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json(data);
    }
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({
      message: "Không kết nối được User Service",
      error: error.message,
    });
  }
});

//ĐĂNG XUẤT
router.post("/logout", async (req, res) => {
  try {
    const response = await fetch(USER_API + "/POST/logout", {
      method: "POST",
      headers: {
        cookie: req.headers.cookie || "",
      },
    });

    // forward clear-cookie về browser
    const setCookie = response.headers.get("set-cookie");
    if (setCookie) {
      res.setHeader("set-cookie", setCookie);
    }

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ message: "Logout error" });
  }
});

//MỞ TRANG ORDER
router.get("/order", checkAuth, async (req, res) => {
  res.render("order", { title: "Đặt hàng" });
});

//LẤY DANH SÁCH SẢN PHẨM CHO TRANG ORDER
router.get("/api/order", async (req, res) => {
  try {
    const response = await fetch(PRODUCT_API + "/GET/product", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        cookie: req.headers.cookie,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: "Không kết nối được Product Service",
      error: error.message,
    });
  }
});

//LẤY THÔNG TIN USER ĐỂ ĐẶT HÀNG
router.get("/me", async (req, res) => {
  try {
    const response = await fetch(USER_API + "/GET/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        cookie: req.headers.cookie,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: "Không kết nối được User Service",
      error: error.message,
    });
  }
});

//THÊM ĐƠN HÀNG
router.post("/order", async (req, res) => {
  try {
    const orderData = req.body;
    const response = await fetch(ORDER_API + "/POST/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: req.headers.cookie,
      },
      body: JSON.stringify(orderData),
    });
    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json(data);
    }
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({
      message: "Không kết nối được Order Service",
      error: error.message,
    });
  }
});

//MỞ TRANG HISTORY
router.get("/history", checkAuth, async (req, res) => {
  res.render("history", { title: "Lịch sử đặt hàng" });
});

//LẤY LỊCH SỬ ĐƠN HÀNG CHO TRANG HISTORY
router.get("/api/history", async (req, res) => {
  try {
    const response = await fetch(ORDER_API + "/GET/order_history", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        cookie: req.headers.cookie,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json(data);
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: "Không kết nối được Order Service",
      error: error.message,
    });
  }
});

//LẤY CHI TIẾT ĐƠN HÀNG CHO TRANG HISTORY
router.get("/api/history/:orderId", async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const response = await fetch(ORDER_API + `/GET/order_detail/${orderId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        cookie: req.headers.cookie,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json(data);
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: "Không kết nối được Order Service",
      error: error.message,
    });
  }
});

//MỞ TRANG QUẢN LÝ
router.get("/management", checkAdmin, (req, res) => {
  res.render("management", { title: "Quản lý" });
});

//LẤY TẤT CẢ SẢN PHẨM VÀ ĐƠN HÀNG CHO TRANG MANAGEMENT
router.get("/api/management", async (req, res) => {
  try {
    const [productRes, orderRes] = await Promise.all([
      fetch(PRODUCT_API + "/GET/product", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          cookie: req.headers.cookie,
        },
      }),
      fetch(ORDER_API + "/GET/order", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          cookie: req.headers.cookie,
        },
      }),
    ]);

    const products = await productRes.json();
    const orders = await orderRes.json();

    if (!productRes.ok) {
      return res.status(productRes.status).json(products);
    }

    if (!orderRes.ok) {
      return res.status(orderRes.status).json(orders);
    }

    res.status(200).json({
      products: products,
      orders: orders,
    });
  } catch (error) {
    res.status(500).json({
      message: "Không kết nối được service",
      error: error.message,
    });
  }
});

//THÊM MỚI SẢN PHẨM
router.post("/management", async (req, res) => {
  try {
    const productData = req.body;
    const response = await fetch(PRODUCT_API + "/POST/product", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: req.headers.cookie,
      },
      body: JSON.stringify(productData),
    });
    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json(data);
    }
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({
      message: "Không kết nối được Product Service",
      error: error.message,
    });
  }
});

//SỬA SẢN PHẨM
router.put("/management/product/:id", async (req, res) => {
  try {
    const productData = req.body;
    const productId = req.params.id;
    const response = await fetch(PRODUCT_API + `/PUT/product/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        cookie: req.headers.cookie,
      },
      body: JSON.stringify(productData),
    });
    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json(data);
    }
    console.log(102);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({
      message: "Không kết nối được Product Service",
      error: error.message,
    });
  }
});

//SỬA TÌNH TRẠNG ĐƠN HÀNG
router.patch("/management/order/:id", async (req, res) => {
  try {
    const orderData = req.body;
    const orderId = req.params.id;
    const response = await fetch(ORDER_API + `/PATCH/order/${orderId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        cookie: req.headers.cookie,
      },
      body: JSON.stringify(orderData),
    });
    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json(data);
    }
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({
      message: "Không kết nối được Order Service",
      error: error.message,
    });
  }
});

//XÓA SẢN PHẨM
router.delete("/management/product/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const response = await fetch(PRODUCT_API + `/DELETE/product/${productId}`, {
      method: "DELETE",
      headers: {
        cookie: req.headers.cookie,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json(data);
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: "Không kết nối được Product Service",
      error: error.message,
    });
  }
});

//XÓA ĐƠN HÀNG
router.delete("/management/order/:id", async (req, res) => {
  try {
    const orderId = req.params.id;
    const response = await fetch(ORDER_API + `/DELETE/order/${orderId}`, {
      method: "DELETE",
      headers: {
        cookie: req.headers.cookie,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json(data);
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: "Không kết nối được Order Service",
      error: error.message,
    });
  }
});

module.exports = router;
