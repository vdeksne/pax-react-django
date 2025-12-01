import React, { useMemo, useRef } from "react";
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";

// Module-level cache to persist across renders
let moduleCache = {
  token: null,
  data: null,
};

function UserData() {
  // Get current token
  const currentToken = Cookies.get("access_token");

  // Only decode if token changed
  const userData = useMemo(() => {
    try {
      if (!currentToken) {
        if (moduleCache.token !== null) {
          // Token was removed, clear cache
          moduleCache.token = null;
          moduleCache.data = null;
        }
        return null;
      }

      // If token hasn't changed, return cached data
      if (currentToken === moduleCache.token && moduleCache.data) {
        return moduleCache.data;
      }

      try {
        // Decode the token
        const decoded = jwtDecode(currentToken);

        // Validate the decoded data
        if (!decoded || !decoded.user_id) {
          console.log("Invalid token data");
          moduleCache.token = null;
          moduleCache.data = null;
          return null;
        }

        // Cache the result
        moduleCache.token = currentToken;
        moduleCache.data = decoded;

        return decoded;
      } catch (decodeError) {
        console.error("Error decoding token:", decodeError);
        // Clear invalid token and cache
        Cookies.remove("access_token");
        moduleCache.token = null;
        moduleCache.data = null;
        return null;
      }
    } catch (error) {
      console.error("Error in UserData:", error);
      return null;
    }
  }, [currentToken]); // Only recompute if token string changes

  return userData;
}

export default UserData;
