const formatterVND = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  minimumFractionDigits: 0, // Số chữ số thập phân
});

window.onload = loadData;

async function loadData() {
  try {
    const response = await fetch("/api/management", {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Không lấy được dữ liệu");
    }

    const data = await response.json();

    renderProducts(data.products);
    renderOrders(data.orders);
  } catch {}
}

function renderProducts(products) {
  const productTable = document.getElementById("productTable");

  productTable.innerHTML = `
        <th>Tên sản phẩm</th>
        <th>Hình ảnh</th>
        <th>Đơn giá</th>
        <th>Trạng thái</th>
    `;

  products.forEach((element) => {
    let price = formatterVND.format(element.price);
    productTable.innerHTML += `
        <tr>
            <td>${element.name}</td>
            <td><img src="${element.image}" alt="" /></td>
            <td>${price}</td>
            <td>
            <button
                onclick="openUpdateProductModal({
                  id: '${element.id}', 
                  name: '${element.name}', 
                  image: '${element.image}', 
                  price: ${element.price}})"
            >
                Sửa
            </button>
            <button onclick="openDeleteModal('product', '${element.id}', '${element.name}')">
                Xóa
            </button>
            </td>
        </tr>
    `;
  });
}

function renderOrders(orders) {
  const orderTable = document.getElementById("orderTable");

  orderTable.innerHTML = `
        <th>Mã đơn hàng</th>
        <th>ID đặt hàng</th>
        <th>Thời gian đặt hàng</th>
        <th>SĐT đặt hàng</th>
        <th>Địa chỉ giao hàng</th>
        <th>Tổng tiền</th>
        <th>Tình trạng</th>
        <th>Trạng thái</th>
    `;

  orders.forEach((element) => {
    const time = new Date(element.time).toLocaleString("vi-VN");
    const totalPrice = formatterVND.format(element.totalPrice);
    orderTable.innerHTML += `
        <tr>
            <td>
              <button class="openOrderDetailManagement" onclick="openOrderDetail('${element.id}')">
                ${element.id}
              </button>
            </td>
            <td>${element.userId}</td>
            <td>${time}</td>
            <td>${element.phone}</td>
            <td>${element.address}</td>
            <td>${totalPrice}</td>
            <td>${element.status}</td>
            <td>
              <button onclick="openUpdateOrderModal('${element.id}', '${element.status}')">Sửa</button>
              <button onclick="openDeleteModal('order', '${element.id}')">Xóa</button>
            </td>
        </tr>
    `;
  });
}

//THAY ĐỔI TAB
window.changeTab = function (element, contentID) {
  //Lấy tất cả các tab
  const tabs = document.querySelectorAll(".tab-item");
  const panels = document.querySelectorAll(".content-panel");

  //Xóa class active ở tất cả các tab
  tabs.forEach((tab) => tab.classList.remove("active"));
  panels.forEach((panel) => panel.classList.remove("active"));

  //Thêm class active vào tab vừa nhấn
  element.classList.add("active");
  document.getElementById(contentID).classList.add("active");
};

//MỞ MODAL XÓA
let deleteType = "";
let currentDeleteId = "";
const deleteBtn = document.getElementById("deleteBtn");
deleteBtn.addEventListener("click", () => {
  if (deleteType === "product") {
    deleteProduct(currentDeleteId);
  } else if (deleteType === "order") {
    deleteOrder(currentDeleteId);
  }
});

window.openDeleteModal = function (type, ID, name) {
  document.getElementById("deleteModal").style.display = "block";
  let IDDelete = document.getElementById("IDDelete");
  deleteType = type;
  currentDeleteId = ID;
  if (type === "order") {
    IDDelete.innerText = "đơn hàng " + ID;
  } else if (type === "product") {
    IDDelete.innerText = name;
  }
};

//MỞ MODAL THÊM SẢN PHẨM
window.openAddProductModal = function () {
  document.getElementById("addProductName").value = "";
  document.getElementById("addProductImage").value = "";
  document.getElementById("addProductPrice").value = "";
  document.getElementById("addProductModal").style.display = "block";
};

//MỞ MODAL SỬA SẢN PHẨM
window.openUpdateProductModal = function (product) {
  document.getElementById("updateProductName").value = product.name;
  document.getElementById("updateProductImage").value = product.image;
  document.getElementById("updateProductPrice").value = product.price;
  document.getElementById("btn-saveUpdateProduct").innerHTML = `
    <button class="save-btn" onclick="updateProduct('${product.id}')">Lưu</button>
  `;
  document.getElementById("updateProductModal").style.display = "block";
};

//MỞ MODAL SỬA TÌNH TRẠNG ĐƠN HÀNG
window.openUpdateOrderModal = function (orderID, status) {
  const orderStatus = document.getElementById("orderStatus");
  orderStatus.value = status;
  document.getElementById("updateOrderModal").style.display = "block";
  let maDonHang = document.getElementById("IDOrder");
  maDonHang.innerText = orderID;
};

//MỞ MODAL CHI TIẾT ĐƠN HÀNG
window.openOrderDetail = async function (orderID) {
  try {
    const response = await fetch(`/api/history/${orderID}`, {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Không lấy được chi tiết đơn hàng");
    }

    const orderDetails = await response.json();
    const detailTable = document.getElementById("modal-body");
    detailTable.innerHTML = `
          <th>Đồ uống</th>
          <th>Đơn giá</th>
          <th>Số lượng</th>

    `;
    orderDetails.forEach((element) => {
      let price = formatterVND.format(element.price);
      detailTable.innerHTML += `
        <tr>
          <td>${element.name}</td>
          <td>${price}</td>
          <td>${element.number}</td>
        </tr>

      `;
    });
    document.getElementById("orderDetailModal").style.display = "block";
    let maDonHang = document.getElementById("orderID");
    maDonHang.innerText = orderID;
  } catch (error) {
    alert(error.message);
    console.error(error);
  }
};

window.closeModal = function (name) {
  document.getElementById(name).style.display = "none";
};

//THÊM MỚI SẢN PHẨM
window.addProduct = async function () {
  const name = document.getElementById("addProductName").value;
  const image = document.getElementById("addProductImage").value;
  const price = document.getElementById("addProductPrice").value;

  if (!name || !image || !price) {
    alert("Nhập đầy đủ thông tin sản phẩm");
    return;
  }

  try {
    const response = await fetch("/management", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        name: name,
        image: image,
        price: price,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Thêm đồ uống thất bại");
    }

    // const data = await response.json();
    // console.log("Product:", data);
    alert("Thêm đồ uống thành công");
    location.reload();
  } catch (error) {
    alert(error.message);
    console.error("Error: ", error);
  }
};

//SỬA SẢN PHẨM
window.updateProduct = async function (productID) {
  const name = document.getElementById("updateProductName").value;
  const image = document.getElementById("updateProductImage").value;
  const price = document.getElementById("updateProductPrice").value;

  if (!name || !image || !price) {
    alert("Nhập đầy đủ thông tin sản phẩm");
    return;
  }

  try {
    const response = await fetch(`/management/product/${productID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        name: name,
        image: image,
        price: price,
      }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Sửa sản phẩm thất bại");
    }
    // const data = await response.json();
    // console.log("Product:", data);
    alert("Sửa sản phẩm thành công");
    location.reload();
  } catch (error) {
    alert(error.message);
    console.error("Error: ", error);
  }
};

//SỬA TÌNH TRẠNG ĐƠN HÀNG
window.updateOrder = async function () {
  const orderId = document.getElementById("IDOrder").innerText;
  const orderStatus = document.getElementById("orderStatus").value;
  try {
    const response = await fetch(`/management/order/${orderId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        orderStatus: orderStatus,
      }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Sửa đơn hàng thất bại");
    }

    const data = await response.json();
    console.log(data);
    alert("Sửa đơn hàng thành công");
    location.reload();
  } catch (error) {
    alert(error.message);
    console.error("Error: ", error);
  }
};

window.deleteProduct = async function (id) {
  try {
    const response = await fetch(`/management/product/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Xóa sản phẩm thất bại");
    }
    alert("Xóa sản phẩm thành công");
    location.reload();
  } catch (error) {
    alert(error.message);
    console.error("Error: ", error);
  }
};

window.deleteOrder = async function (id) {
  try {
    const response = await fetch(`/management/order/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Xóa đơn hàng thất bại");
    }
    alert("Xóa đơn hàng thành công");
    location.reload();
  } catch (error) {
    alert(error.message);
    console.error("Error: ", error);
  }
};
