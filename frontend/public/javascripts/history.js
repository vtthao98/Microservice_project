const formatterVND = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  minimumFractionDigits: 0, // Số chữ số thập phân
});

window.onload = loadHistory;

async function loadHistory() {
  try {
    const response = await fetch("/api/history", {
      method: "GET",
      credentials: "include",
    });

    const orderHistory = await response.json();

    if (!response.ok) {
      throw new Error(orderHistory.message);
    }

    console.log(orderHistory);
    const orderTable = document.getElementById("order-table");

    orderTable.innerHTML = `
      <th>Mã Đơn hàng</th>
      <th>Thời gian đặt hàng</th>
      <th>Tổng tiền</th>
      <th>Tình trạng</th>

    `;
    orderHistory.forEach((element) => {
      const time = new Date(element.time).toLocaleString("vi-VN");
      const totalPrice = formatterVND.format(element.totalPrice);
      orderTable.innerHTML += `
        <tr>
          <td>
            <button class="openOrderDetail" onclick="openOrderDetail('${element.id}')">
              ${element.id}
            </button>
          </td>
          <td>${time}</td>
          <td>${totalPrice}</td>
          <td>${element.status}</td>
        </tr>
      
      `;
    });
  } catch (error) {
    alert(error.message);
    console.error(error);
  }
}

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
      const price = formatterVND.format(element.price);
      detailTable.innerHTML += `
        <tr>
          <td>${element.name}</td>
          <td>${price}</td>
          <td>${element.number}</td>
        </tr>

      `;
    });
    document.getElementById("orderModal").style.display = "block";
    let maDonHang = document.getElementById("orderID");
    maDonHang.innerText = orderID;
  } catch (error) {
    alert(error.message);
    console.error(error);
  }
};

window.closeModal = function () {
  document.getElementById("orderModal").style.display = "none";
};

window.onclick = function (event) {
  let modal = document.getElementById("orderModal");
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
