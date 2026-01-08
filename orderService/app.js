var express = require("express");
var cors = require("cors");

var app = express();

app.use(express.json());
app.use(cors());

/**
 * Fake database sản phẩm
 */
const orders = [
  {
    id: 1,
    userId: 1,
    time: "10:00 13/02/2024",
    phone: "0123456789",
    name: "abc",
    address: "12 Hùng Vương, phường Tam Kỳ",
    status: "Đã hoàn thành",
    detail: [
      { id: 1, name: "Trà sữa", price: 25000, number: 2 },
      { id: 2, name: "Đá bào", price: 35000, number: 1 },
    ],
  },
  {
    id: 2,
    userId: 2,
    time: "18:00 27/12/2025",
    phone: "9876543210",
    name: "xyz",
    address: "123 Điện Biên Phủ, xã Nam Phước",
    status: "Đã hoàn thành",
    detail: [
      { id: 3, name: "Trà trái cây", price: 25000, number: 1 },
      { id: 4, name: "Bạc xỉu đá", price: 30000, number: 3 },
    ],
  },
];

//LẤY TẤT CẢ ĐƠN HÀNG CHO TRANG MANAGEMENT
app.get("/", (req, res) => {
  orders.forEach((order) => {
    order.totalPrice = order.detail.reduce((total, item) => {
      return total + item.price * item.number;
    }, 0);
  });
  res.status(200).json(orders);
});

//LẤY LỊCH SỬ ĐẶT HÀNG CHO TRANG HISTORY
app.get("/history", (req, res) => {
  userId = req.query.userId;
  const orderHistory = orders.filter((o) => o.userId == userId);
  orderHistory.forEach((order) => {
    order.totalPrice = order.detail.reduce((total, item) => {
      return total + item.price * item.number;
    }, 0);
  });
  return res.status(200).json(orderHistory);
});

//LẤY CHI TIẾT ĐƠN HÀNG CHO TRANG HISTORY
app.get("/history/:id", (req, res) => {
  const orderId = req.params.id;
  const order = orders.find((o) => o.id == orderId);
  if (order) {
    const detail = order.detail;
    return res.status(200).json(detail);
  }
  return res.status(401).json({
    message: "Thiếu id đơn hàng",
  });
});

//THÊM ĐƠN HÀNG
app.post("/", (req, res) => {
  const orderData = req.body;
  if (!orderData) {
    return res.status(401).json({
      message: "Thiếu thông tin đơn hàng",
    });
  }

  let now = new Date(); //LẤY THỜI GIAN HIỆN TẠI (NGÀY GIỜ)
  orders.push({
    id: orders.length + 1,
    userId: orderData.userId,
    time: now.toLocaleString("vi-VN"), //FORMAT THỜI GIAN HIỆN TẠI THEO KIỂU VIỆT NAM
    phone: orderData.phone,
    name: orderData.name,
    address: orderData.address,
    status: "Chưa hoàn thành",
    detail: orderData.items,
  });

  res.status(201).json({
    message: "Thêm đơn hàng thành công",
  });
});

//SỬA TÌNH TRẠNG ĐƠN HÀNG
app.put("/:id", (req, res) => {
  const { orderStatus } = req.body;
  const orderId = req.params.id;

  if (!orderStatus) {
    return res.status(401).json({
      message: "Thiếu thông tin đơn hàng",
    });
  }

  const orderIndex = orders.findIndex((p) => p.id == orderId);

  if (orderIndex != -1) {
    orders[orderIndex].status = orderStatus;
  }
  res.status(200).json({
    message: "Sửa đơn hàng thành công",
  });
});

app.delete("/:id", (req, res) => {
  const orderId = req.params.id;
  const index = orders.findIndex((p) => (p.id = orderId));
  if (index != -1) {
    orders.splice(index, 1);
  }
  res.status(200).json({
    message: "Xóa đơn hàng thành công",
  });
});

app.listen(3003, () => {
  console.log("Order Service running at http://localhost:3003");
});
