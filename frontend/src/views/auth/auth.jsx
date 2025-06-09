export function isLoggedIn() {
  // Example: check for a token in localStorage
  return !!localStorage.getItem("access_token");
}
