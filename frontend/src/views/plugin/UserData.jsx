import React from "react";
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";

function UserData() {
  // Always decode the access token for user info
  let access_token = Cookies.get("access_token");
  if (access_token) {
    try {
      const decoded = jwtDecode(access_token);
      return decoded;
    } catch (e) {
      // Invalid token, return undefined
      return undefined;
    }
  }
  // No access token, return undefined
  return undefined;
}

export default UserData;
