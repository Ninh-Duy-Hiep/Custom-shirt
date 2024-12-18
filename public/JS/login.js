async function login() {
  const nameuser = document.getElementById("nameuser").value;
  const password = document.getElementById("password").value;

  const response = await fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ nameuser, password }),
  });

  const data = await response.json();
  alert(data.message);

  // Nếu đăng nhập thành công , chuyển hướng sang trang chủ
  if (data.message === "Đăng nhập thành công!") {
    window.location.href = "/homepage.html";
  }
}

async function register() {
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password_register").value;

  const response = await fetch("http://localhost:3000/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, email, password }),
  });

  const data = await response.json();
  alert(data.message);

  // Nếu đăng ký thành công, chuyển hướng sang trang đăng nhập
  if (data.message === "Đăng ký thành công!") {
    window.location.href = "/login.html";
  }
}
