async function login() {
  const phone = document.getElementById("phone").value;
  const password = document.getElementById("password").value;

  if (!phone || !password) {
    alert("Nhập đầy đủ thông tin đăng nhập");
    return;
  }
  console.log(phone, password);
  try {
    const response = await fetch("/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone: phone,
        password: password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Đăng nhập thất bại");
    }

    const data = await response.json();
    console.log("User:", data);
    alert("Đăng nhập thành công");
    // const role = data.role;
    // if (role == "user") {
    //   localStorage.setItem("userId", data.id);
    //   window.location.href = "/order";
    // } else if (role == "admin") {
    //   window.location.href = "/management";
    // }
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);

    if (data.role === "admin") {
      window.location.href = "/management";
    } else {
      window.location.href = "/order";
    }
  } catch (error) {
    alert(error.message);
    console.log("Error: ", error);
  }
}
