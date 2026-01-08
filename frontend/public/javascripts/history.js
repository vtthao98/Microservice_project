const userId = localStorage.getItem("userId");
if (!userId) {
  alert("Đăng nhập để tiếp tục");
  window.location.href = "/";
}

window.onload = loadHistory;

async function loadHistory() {
  try {
    const response = await fetch(`/api/history?userId=${userId}`);
    if (!response.ok) {
      throw new Error("Không lấy được lịch sử đặt hàng");
    }
    const orderHistory = await response.json();
    console.log(orderHistory);
    const orderTable = document.getElementById("order-table");

    orderTable.innerHTML = `
      <th>Mã Đơn hàng</th>
      <th>Thời gian đặt hàng</th>
      <th>Tổng tiền</th>
      <th>Tình trạng</th>

    `;
    orderHistory.forEach((element) => {
      orderTable.innerHTML += `
        <tr>
          <td>
            <button class="openOrderDetail" onclick="openOrderDetail('${element.id}')">
              ${element.id}
            </button>
          </td>
          <td>${element.time}</td>
          <td>${element.totalPrice}</td>
          <td>${element.status}</td>
        </tr>
      
      `;
    });
  } catch (error) {
    alert(error.message);
    console.error(error);
  }
}

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
    document.getElementById("orderModal").style.display = "block";
    let maDonHang = document.getElementById("orderID");
    maDonHang.innerText = orderID;
  } catch (error) {
    alert(error.message);
    console.error(error);
  }
}

function closeModal() {
  document.getElementById("orderModal").style.display = "none";
}

window.onclick = function (event) {
  let modal = document.getElementById("orderModal");
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
