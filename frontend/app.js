var express = require("express");
var path = require("path");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Docker network service URLs
const USER_API = "http://localhost:3001";
const PRODUCT_API = "http://localhost:3002";
const ORDER_API = "http://localhost:3003";

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("login", { title: "Đăng nhập" });
});

app.post("/", async (req, res) => {
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

app.get("/register", (req, res) => {
  res.render("register", { title: "Đăng ký" });
});

app.post("/register", async (req, res) => {
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

app.get("/order", async (req, res) => {
  res.render("order", { title: "Đặt hàng" });
});

app.get("/api/order", async (req, res) => {
  try {
    const response = await fetch(PRODUCT_API);
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

//THÊM ĐƠN HÀNG
app.post("/order", async (req, res) => {
  try {
    const orderData = req.body;
    const response = await fetch(ORDER_API, {
      method: "POST",
      headers: {
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

app.get("/history", async (req, res) => {
  res.render("history", { title: "Lịch sử đặt hàng" });
});

//LẤY LỊCH SỬ ĐƠN HÀNG CHO TRANG HISTORY
app.get("/api/history", async (req, res) => {
  try {
    const userId = req.query.userId;
    const response = await fetch(ORDER_API + `/history?userId=${userId}`);
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
app.get("/api/history/:orderId", async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const response = await fetch(ORDER_API + `/history/${orderId}`);
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

app.get("/management", async (req, res) => {
  res.render("management", { title: "Quản lý" });
});

//LẤY TẤT CẢ ĐƠN HÀNG CHO TRANG MANAGEMENT
app.get("/api/management", async (req, res) => {
  try {
    const [productRes, orderRes] = await Promise.all([
      fetch(PRODUCT_API),
      fetch(ORDER_API),
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
app.post("/management", async (req, res) => {
  try {
    const productData = req.body;
    const response = await fetch(PRODUCT_API, {
      method: "POST",
      headers: {
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
app.put("/management/product/:id", async (req, res) => {
  try {
    const productData = req.body;
    const productId = req.params.id;
    const response = await fetch(PRODUCT_API + `/${productId}`, {
      method: "PUT",
      headers: {
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

//SỬA TÌNH TRẠNG ĐƠN HÀNG
app.put("/management/order/:id", async (req, res) => {
  try {
    const orderData = req.body;
    const orderId = req.params.id;
    const response = await fetch(ORDER_API + `/${orderId}`, {
      method: "PUT",
      headers: {
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

app.delete("/management/product/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const response = await fetch(PRODUCT_API + `/${productId}`, {
      method: "DELETE",
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

app.delete("/management/order/:id", async (req, res) => {
  try {
    const orderId = req.params.id;
    const response = await fetch(ORDER_API + `/${orderId}`, {
      method: "DELETE",
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

// module.exports = app;

app.listen(3000, () => {
  console.log("Frontend server running at http://localhost:3000");
});
