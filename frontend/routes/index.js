var express = require("express");

var router = express.Router();

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
    const response = await fetch(USER_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
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

//MỞ TRANG ĐĂNG KÝ
router.get("/register", (req, res) => {
  res.render("register", { title: "Đăng ký" });
});

//ĐĂNG KÝ
router.post("/register", async (req, res) => {
  try {
    const registerData = req.body;
    const response = await fetch(USER_API + "/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registerData),
    });
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

//MỞ TRANG ORDER
router.get("/order", async (req, res) => {
  res.render("order", { title: "Đặt hàng" });
});

//LẤY DANH SÁCH SẢN PHẨM CHO TRANG ORDER
router.get("/api/order", async (req, res) => {
  try {
    const auth = req.headers["authorization"];
    if (!auth) {
      return res.status(401).json({
        message: "Không có Authorization",
      });
    }
    const token = auth.split(" ")[1];
    const response = await fetch(PRODUCT_API, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
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
    const auth = req.headers["authorization"];
    if (!auth) {
      return res.status(401).json({
        message: "Không có Authorization",
      });
    }
    const token = auth.split(" ")[1];
    const response = await fetch(USER_API + "/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
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
    const auth = req.headers["authorization"];
    if (!auth) {
      return res.status(401).json({
        message: "Không có Authorization",
      });
    }
    const token = auth.split(" ")[1];
    const orderData = req.body;
    const response = await fetch(ORDER_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
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

router.get("/history", async (req, res) => {
  res.render("history", { title: "Lịch sử đặt hàng" });
});

//LẤY LỊCH SỬ ĐƠN HÀNG CHO TRANG HISTORY
router.get("/api/history", async (req, res) => {
  try {
    const auth = req.headers["authorization"];
    if (!auth) {
      return res.status(401).json({
        message: "Không có Authorization",
      });
    }
    const token = auth.split(" ")[1];
    const response = await fetch(ORDER_API + "/history", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
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
    const auth = req.headers["authorization"];
    if (!auth) {
      return res.status(401).json({
        message: "Không có Authorization",
      });
    }
    const token = auth.split(" ")[1];
    const orderId = req.params.orderId;
    const response = await fetch(ORDER_API + `/history/${orderId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
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

router.get("/management", async (req, res) => {
  res.render("management", { title: "Quản lý" });
});

//LẤY TẤT CẢ ĐƠN HÀNG CHO TRANG MANAGEMENT
router.get("/api/management", async (req, res) => {
  try {
    const auth = req.headers["authorization"];
    if (!auth) {
      return res.status(401).json({
        message: "Không có Authorization",
      });
    }
    const token = auth.split(" ")[1];
    const [productRes, orderRes] = await Promise.all([
      fetch(PRODUCT_API, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }),
      fetch(ORDER_API, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
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
    const auth = req.headers["authorization"];
    if (!auth) {
      return res.status(401).json({
        message: "Không có Authorization",
      });
    }
    const token = auth.split(" ")[1];
    const productData = req.body;
    const response = await fetch(PRODUCT_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
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
    const auth = req.headers["authorization"];
    if (!auth) {
      return res.status(401).json({
        message: "Không có Authorization",
      });
    }
    const token = auth.split(" ")[1];
    const productData = req.body;
    const productId = req.params.id;
    const response = await fetch(PRODUCT_API + `/${productId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
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
    const auth = req.headers["authorization"];
    if (!auth) {
      return res.status(401).json({
        message: "Không có Authorization",
      });
    }
    const token = auth.split(" ")[1];
    const orderData = req.body;
    const orderId = req.params.id;
    const response = await fetch(ORDER_API + `/${orderId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
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
    const auth = req.headers["authorization"];
    if (!auth) {
      return res.status(401).json({
        message: "Không có Authorization",
      });
    }
    const token = auth.split(" ")[1];
    const productId = req.params.id;
    const response = await fetch(PRODUCT_API + `/${productId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
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
    const auth = req.headers["authorization"];
    if (!auth) {
      return res.status(401).json({
        message: "Không có Authorization",
      });
    }
    const token = auth.split(" ")[1];
    const orderId = req.params.id;
    const response = await fetch(ORDER_API + `/${orderId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
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
