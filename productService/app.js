var express = require("express");
var cors = require("cors");

var app = express();

app.use(express.json());
app.use(cors());

/**
 * Fake database sản phẩm
 */
const products = [
  {
    id: 1,
    name: "Trà sữa",
    image: "/images/TraSua.png",
    price: 25000,
  },
  {
    id: 2,
    name: "Đá bào",
    image: "/images/daBao.png",
    price: 35000,
  },
  {
    id: 3,
    name: "Trà trái cây",
    image: "/images/traTraiCay.png",
    price: 25000,
  },
  {
    id: 4,
    name: "Bạc xỉu đá",
    image: "/images/bacXiuDa.png",
    price: 30000,
  },
];

app.get("/", (req, res) => {
  res.status(200).json(products);
});

app.post("/", (req, res) => {
  const { name, image, price } = req.body;
  if (!name || !image || !price) {
    return res.status(401).json({
      message: "Thiếu thông tin sản phẩm",
    });
  }

  const product = products.find((p) => p.name === name);
  if (product) {
    return res.status(400).json({
      message: "Tên đồ uống đã tồn tại",
    });
  }

  products.push({
    id: products.length + 1,
    name: name,
    image: image,
    price: price,
  });

  res.status(201).json({
    message: "Thêm đố uống thành công",
  });
});

app.put("/:id", (req, res) => {
  const { name, image, price } = req.body;
  const productId = req.params.id;

  if (!name || !image || !price) {
    return res.status(401).json({
      message: "Thiếu thông tin sản phẩm",
    });
  }

  const productIndex = products.findIndex((p) => p.id == productId);

  if (productIndex != -1) {
    products[productIndex].name = name;
    products[productIndex].image = image;
    products[productIndex].price = price;
    return res.status(200).json({
      message: "Sửa sản phẩm thành công",
    });
  }
});

app.delete("/:id", (req, res) => {
  const productId = req.params.id;
  const index = products.findIndex((p) => (p.id = productId));
  if (index != -1) {
    products.splice(index, 1);
  }
  res.status(200).json({
    message: "Xóa sản phẩm thành công",
  });
});

app.listen(3002, () => {
  console.log("Product Service running at http://localhost:3002");
});
