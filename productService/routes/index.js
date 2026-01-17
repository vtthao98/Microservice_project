var express = require("express");
var products = require("../models/model.product");
var authMiddleware = require("../middlewares/auth");
var isAdmin = require("../middlewares/authorizate");

var router = express.Router();

//LẤY TẤT CẢ SẢN PHẨM
router.get("/GET/product", authMiddleware, async (req, res) => {
  try {
    const productsData = await products.find();
    res.status(200).json(productsData);
  } catch (error) {
    res.status(400).json({
      message: "Tải sản phẩm không thành công",
      error: error.message,
    });
  }
});

//THÊM SẢN PHẨM
router.post("/POST/product", authMiddleware, isAdmin, async (req, res) => {
  const { name, image, price } = req.body;
  if (!name || !image || !price) {
    return res.status(400).json({
      message: "Thiếu thông tin sản phẩm",
    });
  }

  try {
    const product = new products({ name, image, price });
    await product.save();

    res.status(201).json({
      message: "Thêm đố uống thành công",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "Thêm sản phẩm thất bại",
    });
  }
});

//SỬA THÔNG TIN SẢN PHẨM
router.put("/PUT/product/:id", authMiddleware, isAdmin, async (req, res) => {
  const { name, image, price } = req.body;
  const productId = req.params.id;

  if (!name || !image || !price) {
    return res.status(400).json({
      message: "Thiếu thông tin sản phẩm",
    });
  }

  try {
    const product = await products.findByIdAndUpdate(
      productId,
      {
        name: name,
        image: image,
        price: price,
      },
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({
        message: "Không tìm thấy sản phẩm",
      });
    }

    res.status(200).json({
      message: "Sửa sản phẩm thành công",
    });
  } catch (error) {
    res.status(400).json({
      message: "Sửa sản phẩm không thành công",
      error: error.message,
    });
  }
});

//XÓA SẢN PHẨM
router.delete(
  "/DELETE/product/:id",
  authMiddleware,
  isAdmin,
  async (req, res) => {
    const productId = req.params.id;
    try {
      const product = await products.findByIdAndDelete(productId);

      if (!product) {
        return res.status(404).json({
          message: "Không tìm thấy sản phẩm",
        });
      }

      res.status(200).json({
        message: "Xóa sản phẩm thành công",
      });
    } catch (error) {
      res.status(400).json({
        message: "Xóa sản phẩm không thành công",
        error: error.message,
      });
    }
  }
);

module.exports = router;
