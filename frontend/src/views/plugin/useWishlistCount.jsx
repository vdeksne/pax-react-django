import { useEffect, useState } from "react";
import apiInstance from "../../utils/axios";
import UserData from "../plugin/UserData";

function useWishlistCount() {
  const [wishlistCount, setWishlistCount] = useState(0);
  const userData = UserData();

  useEffect(() => {
    if (userData?.user_id) {
      apiInstance
        .get(`/customer/wishlist/${userData.user_id}/`)
        .then((res) => {
          setWishlistCount(Array.isArray(res.data) ? res.data.length : 0);
        })
        .catch(() => setWishlistCount(0));
    }
  }, [userData?.user_id]);

  return wishlistCount;
}

export default useWishlistCount;
