export const token = localStorage.getItem("token");
export const role = localStorage.getItem("role");

export function requireLogin() {
  if (!token) {
    window.location.replace("/");
  }
}

export function isAdmin() {
  if (!token || role !== "admin") {
    window.location.replace("/");
  }
}
