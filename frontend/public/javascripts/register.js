async function register() {
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const password = document.getElementById("password").value;
  const password_repeat = document.getElementById("password-repeat").value;

  if (!name || !phone || !password || !password_repeat) {
    alert("Nhập đầy đủ thông tin đăng ký");
    return;
  }

  if (password !== password_repeat) {
    alert("Mật khẩu không đúng");
    return;
  }

  try {
    const response = await fetch("/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        phone: phone,
        password: password,
      }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Đăng ký thất bại");
    }

    const data = await response.json();
    console.log("Register:", data);
    alert("Đăng ký thành công");
    localStorage.setItem("userId", data.userId);
    window.location.href = "/order";
  } catch (error) {
    alert(error.message);
    console.error("Error:", error);
  }
}
