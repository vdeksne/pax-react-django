import { useEffect, useState } from "react";
import apiInstance from "../../utils/axios";
import UserData from "./UserData";

function UseProfileData() {
  const [profileData, setProfileData] = useState(null);
  const userData = UserData();

  useEffect(() => {
    if (userData?.user_id) {
      apiInstance
        .get(`/user/profile/${userData.user_id}/`)
        .then((res) => {
          console.log("Profile API Response:", res.data);
          setProfileData(res.data);
        })
        .catch((error) => {
          console.error("Error fetching profile:", error);
          setProfileData(null);
        });
    }
  }, [userData?.user_id]);

  return profileData;
}

export default UseProfileData;
