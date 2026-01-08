window.onload = loadData;

async function loadData() {
  try {
    const response = await fetch("/api/management");
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
    productTable.innerHTML += `
        <tr>
            <td>${element.name}</td>
            <td><img src="${element.image}" alt="" /></td>
            <td>${element.price}</td>
            <td>
            <button
                onclick="openAddProductModal({id: ${element.id}, name: '${element.name}', image: '${element.image}', price: ${element.price}})"
            >
                Sửa
            </button>
            <button onclick="openDeleteModal('product', '${element.name}')">
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
    orderTable.innerHTML += `
        <tr>
            <td>
              <button class="openOrderDetailManagement" onclick="openOrderDetail('${element.id}')">
                ${element.id}
              </button>
            </td>
            <td>${element.userId}</td>
            <td>${element.time}</td>
            <td>${element.phone}</td>
            <td>${element.address}</td>
            <td>${element.totalPrice}</td>
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
function changeTab(element, contentID) {
  //Lấy tất cả các tab
  const tabs = document.querySelectorAll(".tab-item");
  const panels = document.querySelectorAll(".content-panel");

  //Xóa class active ở tất cả các tab
  tabs.forEach((tab) => tab.classList.remove("active"));
  panels.forEach((panel) => panel.classList.remove("active"));

  //Thêm class active vào tab vừa nhấn
  element.classList.add("active");
  document.getElementById(contentID).classList.add("active");
}

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

function openDeleteModal(type, ID) {
  document.getElementById("deleteModal").style.display = "block";
  let IDDelete = document.getElementById("IDDelete");
  deleteType = type;
  currentDeleteId = ID;
  if (type === "order") {
    IDDelete.innerText = "đơn hàng " + ID;
  } else if (type === "product") {
    IDDelete.innerText = "đồ uống " + ID;
  }
}

//MỞ MODAL THÊM/SỬA SẢN PHẨM
let productIdToUpdate = null;
const btnSave = document.getElementById("saveProduct-btn");
btnSave.addEventListener("click", () => {
  if (!productIdToUpdate) {
    addProduct();
  } else {
    updateProduct(productIdToUpdate);
  }
});

function openAddProductModal(product) {
  if (product) {
    document.getElementById("productName").value = product.name;
    document.getElementById("productImage").value = product.image;
    document.getElementById("productPrice").value = product.price;
    productIdToUpdate = product.id;
  } else {
    document.getElementById("productName").value = "";
    document.getElementById("productImage").value = "";
    document.getElementById("productPrice").value = "";
    productIdToUpdate = null;
  }
  document.getElementById("addProductModal").style.display = "block";
}

//MỞ MODAL SỬA TÌNH TRẠNG ĐƠN HÀNG
function openUpdateOrderModal(orderID, status) {
  const orderStatus = document.getElementById("orderStatus");
  orderStatus.value = status;
  document.getElementById("updateOrderModal").style.display = "block";
  let maDonHang = document.getElementById("IDOrder");
  maDonHang.innerText = orderID;
}

//MỞ MODAL CHI TIẾT ĐƠN HÀNG
async function openOrderDetail(orderID) {
  try {
    const response = await fetch(`/api/history/${orderID}`);
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
      detailTable.innerHTML += `
        <tr>
          <td>${element.name}</td>
          <td>${element.price}</td>
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
}

function closeModal(name) {
  document.getElementById(name).style.display = "none";
}

//THÊM MỚI SẢN PHẨM
async function addProduct() {
  const name = document.getElementById("productName").value;
  const image = document.getElementById("productImage").value;
  const price = document.getElementById("productPrice").value;

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
}

//SỬA SẢN PHẨM
async function updateProduct(productID) {
  const name = document.getElementById("productName").value;
  const image = document.getElementById("productImage").value;
  const price = document.getElementById("productPrice").value;

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
}

//SỬA TÌNH TRẠNG ĐƠN HÀNG
async function updateOrder() {
  const orderId = document.getElementById("IDOrder").innerText;
  const orderStatus = document.getElementById("orderStatus").value;
  try {
    const response = await fetch(`/management/order/${orderId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
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
}

async function deleteProduct(id) {
  try {
    const response = await fetch(`/management/product/${id}`, {
      method: "DELETE",
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
}

async function deleteOrder(id) {
  try {
    const response = await fetch(`/management/order/${id}`, {
      method: "DELETE",
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
}
