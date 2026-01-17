const formatterVND = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  minimumFractionDigits: 0, // Số chữ số thập phân
});

window.onload = loadProducts;

async function loadProducts() {
  try {
    const response = await fetch("/api/order", {
      method: "GET",
      credentials: "include",
    });
    const products = await response.json();

    if (!response.ok) {
      throw new Error(products.message);
    }

    const list = document.getElementById("list-product");

    list.innerHTML = "";

    products.forEach((product) => {
      const price = formatterVND.format(product.price);
      list.innerHTML += `
        <div class="item">
          <div class="img">
            <img src="${product.image}" alt="" />
          </div>
          <div class="content">
            <div class="product-name">${product.name}</div>
            <div class="price">${price}</div>
            <button
              class="add-cart"
              onclick="addToCart({id: '${product.id}', name: '${product.name}', price: ${product.price},})"
            >
              Mua
            </button>
          </div>
        </div>

      `;
    });

    getUserInfo();
  } catch (error) {
    alert(error.message);
    console.error(error);
  }
}

async function getUserInfo() {
  try {
    const response = await fetch("/me", {
      method: "GET",
      credentials: "include",
    });
    const user = await response.json();

    if (!response.ok) {
      throw new Error(user.message);
    }

    document.getElementById("name").value = user.name;
    document.getElementById("phone").value = user.phone;
  } catch (error) {
    alert(error.message);
    console.error(error);
  }
}

// XỬ LÝ CÁC SỰ KIỆN LIÊN QUAN ĐẾN GIỎ HÀNG
let cart = [];

//THÊM SẢN PHẨM VÀO GIỎ
window.addToCart = function (product) {
  let item = cart.find((p) => p.product_id === product.id);

  if (item) {
    alert("Sản phẩm đã tồn tại trong giỏ hàng!");
  } else {
    cart.push({
      product_id: product.id,
      name: product.name,
      price: product.price,
      number: 1,
    });
    renderCart();
  }
};

//TĂNG SỐ LƯỢNG SẢN PHẨM
window.increaseNumberOfProduct = function (id) {
  let item = cart.find((p) => p.product_id === id);
  if (item) {
    item.number++;
    renderCart();
  }
};

//GIẢM SỐ LƯỢNG SẢN PHẨM
window.decreaseNumberOfProduct = function (id) {
  let item = cart.find((p) => p.product_id === id);
  if (item) {
    if (item.number > 1) {
      item.number--;
    } else {
      cart = cart.filter((p) => p !== item);
    }
    renderCart();
  }
};

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
    let itemTotalPrice = formatterVND.format(item.price * item.number);
    orderList.innerHTML += `
        <tr>
          <td class="name">${item.name}</td>
          <td class="change_number">
              <button class="btn-change_number" onclick="increaseNumberOfProduct('${item.product_id}')">+</button>
              <div class="number">${item.number}</div>
              <button class="btn-change_number" onclick="decreaseNumberOfProduct('${item.product_id}')">-</button>
          </td>
          <td class="price">${itemTotalPrice}</td>
        </tr>
    `;
  });

  totalPrice.innerText = "Tổng: " + formatterVND.format(getTotalPrice());
}

//ĐẶT HÀNG
window.submitOrder = async function () {
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
      credentials: "include",
      body: JSON.stringify({
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
    cart = [];
    renderCart();
  } catch (error) {
    alert(error.message);
    console.error("Error: ", error);
  }
};
