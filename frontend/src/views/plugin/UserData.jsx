import React from "react";
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";

function UserData() {
  try {
    // Get the access token from cookies
    const access_token = Cookies.get("access_token");

    if (!access_token) {
      console.log("No access token found");
      return null;
    }

    try {
      // Decode the token
      const decoded = jwtDecode(access_token);

      // Validate the decoded data
      if (!decoded || !decoded.user_id) {
        console.log("Invalid token data");
        return null;
      }

      return decoded;
    } catch (decodeError) {
      console.error("Error decoding token:", decodeError);
      // Clear invalid token
      Cookies.remove("access_token");
      return null;
    }
  } catch (error) {
    console.error("Error in UserData:", error);
    return null;
  }
}

export default UserData;
