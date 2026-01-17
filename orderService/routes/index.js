var express = require("express");
var orders = require("../models/model.order");
var authMiddleware = require("../middlewares/auth");
var isAdmin = require("../middlewares/authorizate");

var router = express.Router();

//LẤY TẤT CẢ ĐƠN HÀNG CHO TRANG MANAGEMENT
router.get("/GET/order", authMiddleware, isAdmin, async (req, res) => {
  try {
    const ordersData = await orders.find().sort({ time: -1 });
    res.status(200).json(ordersData);
  } catch (error) {
    res.status(400).json({
      message: "Tải đơn hàng không thành công",
      error: error.message,
    });
  }
});

//LẤY LỊCH SỬ ĐẶT HÀNG CHO TRANG HISTORY
router.get("/GET/order_history", authMiddleware, async (req, res) => {
  userId = req.user.id;
  try {
    const orderHistory = await orders.find({ userId: userId });
    return res.status(200).json(orderHistory);
  } catch (error) {
    res.status(400).json({
      message: "Tải đơn hàng không thành công",
      error: error.message,
    });
  }
});

//LẤY CHI TIẾT ĐƠN HÀNG CHO TRANG HISTORY
router.get("/GET/order_detail/:id", authMiddleware, async (req, res) => {
  const orderId = req.params.id;
  try {
    const order = await orders.findById(orderId);
    if (order) {
      const detail = order.detail;
      return res.status(200).json(detail);
    }
    return res.status(404).json({
      message: "Không tìm thấy đơn hàng",
    });
  } catch (error) {
    res.status(400).json({
      message: "Tải chi tiết đơn hàng không thành công",
    });
  }
});

//THÊM ĐƠN HÀNG
router.post("/POST/order", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const orderData = req.body;
  if (!orderData) {
    return res.status(401).json({
      message: "Thiếu thông tin đơn hàng",
    });
  }

  const totalPrice = orderData.items.reduce((total, item) => {
    return total + item.price * item.number;
  }, 0);
  try {
    const order = new orders({
      userId: userId,
      phone: orderData.phone,
      name: orderData.name,
      address: orderData.address,
      totalPrice: totalPrice,
      detail: orderData.items,
    });
    await order.save();
    res.status(201).json({
      message: "Thêm đơn hàng thành công",
    });
  } catch (error) {
    return res.status(400).json({
      message: "Thêm đơn hàng không thành công",
    });
  }
});

//SỬA TÌNH TRẠNG ĐƠN HÀNG
router.patch("/PATCH/order/:id", authMiddleware, isAdmin, async (req, res) => {
  const { orderStatus } = req.body;
  const orderId = req.params.id;

  if (!orderStatus) {
    return res.status(400).json({
      message: "Thiếu thông tin đơn hàng",
    });
  }

  try {
    const order = await orders.findByIdAndUpdate(
      orderId,
      { status: orderStatus },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({
        message: "Không tìm thấy đơn hàng",
      });
    }

    res.status(200).json({
      message: "Sửa đơn hàng thành công",
    });
  } catch (error) {
    res.status(400).json({
      message: "Sửa đơn hàng không thành công",
      error: error.message,
    });
  }
});

router.delete(
  "/DELETE/order/:id",
  authMiddleware,
  isAdmin,
  async (req, res) => {
    const orderId = req.params.id;
    try {
      const order = await orders.findByIdAndDelete(orderId);

      if (!order) {
        return res.status(404).json({
          message: "Không tìm thấy đơn hàng",
        });
      }

      res.status(200).json({
        message: "Xóa đơn hàng thành công",
      });
    } catch (error) {
      res.status(400).json({
        message: "Xóa đơn hàng không thành công",
        error: error.message,
      });
    }
  }
);

module.exports = router;
