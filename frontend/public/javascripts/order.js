const userId = localStorage.getItem("userId");
if (!userId) {
  alert("Đăng nhập để tiếp tục");
  window.location.href = "/";
}
window.onload = loadProducts;

async function loadProducts() {
  try {
    const response = await fetch("/api/order");
    if (!response.ok) {
      throw new Error("Không lấy được danh sách sản phẩm");
    }

    const products = await response.json();

    const list = document.getElementById("list-product");

    list.innerHTML = "";

    products.forEach((product) => {
      list.innerHTML += `
        <div class="item">
          <div class="img">
            <img src="${product.image}" alt="" />
          </div>
          <div class="content">
            <div class="product-name">${product.name}</div>
            <div class="price">${product.price}</div>
            <button
              class="add-cart"
              onclick="addToCart({id: ${product.id}, name: '${product.name}', price: ${product.price},})"
            >
              Mua
            </button>
          </div>
        </div>

      `;
    });
  } catch (error) {
    alert(error.message);
    console.error(error);
  }
}

// XỬ LÝ CÁC SỰ KIỆN LIÊN QUAN ĐẾN GIỎ HÀNG
let cart = [];

//THÊM SẢN PHẨM VÀO GIỎ
function addToCart(product) {
  let item = cart.find((p) => p.id === product.id);

  if (item) {
    alert("Sản phẩm đã tồn tại trong giỏ hàng!");
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      number: 1,
    });
    renderCart();
  }
}

//TĂNG SỐ LƯỢNG SẢN PHẨM
function increaseNumberOfProduct(id) {
  let item = cart.find((p) => p.id === id);
  if (item) {
    item.number++;
    renderCart();
  }
}

//GIẢM SỐ LƯỢNG SẢN PHẨM
function decreaseNumberOfProduct(id) {
  let item = cart.find((p) => p.id === id);
  if (item) {
    if (item.number > 1) {
      item.number--;
    } else {
      cart = cart.filter((p) => p !== item);
    }
    renderCart();
  }
}

//TÍNH TỔNG TIỀN
function getTotalPrice() {
  return cart.reduce((total, item) => {
    return total + item.price * item.number;
  }, 0);
}

//THAY ĐỔI ĐƠN HÀNG
function renderCart() {
  const orderList = document.getElementById("orderList");
  const totalPrice = document.getElementById("totalPrice");

  orderList.innerHTML = "";

  if (cart.length === 0) {
    totalPrice.innerText = "";
    return;
  }

  cart.forEach((item) => {
    let itemTotalPrice = item.price * item.number;
    orderList.innerHTML += `
        <tr>
          <td class="name">${item.name}</td>
          <td class="change_number">
              <button class="btn-change_number" onclick="increaseNumberOfProduct(${item.id})">+</button>
              <div class="number">${item.number}</div>
              <button class="btn-change_number" onclick="decreaseNumberOfProduct(${item.id})">-</button>
          </td>
          <td class="price">${itemTotalPrice}đ</td>
        </tr>
    `;
  });

  totalPrice.innerText = "Tổng: " + getTotalPrice() + "đ";
}

//ĐẶT HÀNG
async function submitOrder() {
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const address = document.getElementById("address").value;

  if (cart.length === 0) {
    alert("Giỏ hàng trống!");
    return;
  }

  if (!name || !phone || !address) {
    alert("Nhập đầy đủ thông tin đặt hàng!");
    return;
  }

  try {
    const response = await fetch("/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
        phone: phone,
        name: name,
        address: address,
        items: cart,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Đặt hàng thất bại");
    }

    const data = await response.json();
    console.log("Order:", data);
    alert("Đặt hàng thành công");
  } catch (error) {
    alert(error.message);
    console.error("Error: ", error);
  }
}
