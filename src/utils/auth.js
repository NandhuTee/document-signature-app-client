// src/utils/auth.js
export function checkAuth() {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Response("Unauthorized", {
      status: 302,
      headers: { Location: "/login" }
    });
  }
  return token;
}
