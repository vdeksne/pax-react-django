import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UseProfileData from "../plugin/UseProfileData";
import useWishlistCount from "../plugin/useWishlistCount";
import "../../assets/css/sidebar.css";
import apiInstance from "../../utils/axios";

function Sidebar() {
  const userProfile = UseProfileData();
  const wishlistCount = useWishlistCount();
  const [loading, setLoading] = useState(true);
  const [notificationsCount, setNotificationsCount] = useState(0);

  useEffect(() => {
    if (userProfile) {
      console.log("Profile Image URL:", userProfile?.image);
      setLoading(false);
    }
  }, [userProfile]);

  useEffect(() => {
    if (userProfile?.id) {
      apiInstance
        .get(`/customer/notification/${userProfile.id}/`)
        .then((res) => setNotificationsCount(res.data.length))
        .catch(() => setNotificationsCount(0));
    }
  }, [userProfile?.id]);

  if (loading) {
    return (
      <div className="col-lg-3 sidebar-container">
        <div className="sidebar-profile">
          <img
            src="/images/default-profile.jpg"
            alt="Profile"
            className="img-fluid"
          />
          <div className="text-center">
            <h3>Loading...</h3>
          </div>
        </div>
      </div>
    );
  }

  const profileImageUrl = userProfile?.image
    ? userProfile.image
    : "/images/default-profile.jpg";

  return (
    <div className="col-lg-3 sidebar-container">
      <div className="sidebar-profile">
        <img src={profileImageUrl} alt="Profile" className="img-fluid" />
        <div className="text-center">
          <h3>{userProfile?.full_name}</h3>
          <p>
            <Link to="/customer/settings/">
              <i className="fas fa-edit me-2"></i> Edit Account
            </Link>
          </p>
        </div>
      </div>
      <ol className="list-group sidebar-menu">
        <li className="list-group-item d-flex justify-content-between align-items-start">
          <div className="ms-2 me-auto">
            <Link to={"/customer/account/"} className="fw-bold text-dark">
              <i className="fas fa-user me-2"></i> Account
            </Link>
          </div>
        </li>
        <li className="list-group-item d-flex justify-content-between align-items-start">
          <div className="ms-2 me-auto">
            <Link to={"/customer/orders/"} className="fw-bold text-dark">
              <i className="fas fa-box me-2"></i> Orders
            </Link>
          </div>
          <span className="badge bg-primary-yellow rounded-pill">
            {userProfile?.orders?.length || 0}
          </span>
        </li>
        <li className="list-group-item d-flex justify-content-between align-items-start">
          <div className="ms-2 me-auto">
            <Link to={"/customer/wishlist/"} className="fw-bold text-dark">
              <i className="fas fa-heart me-2"></i> Wishlist
            </Link>
          </div>
          <span className="badge bg-primary-yellow rounded-pill">
            {wishlistCount}
          </span>
        </li>
        <li className="list-group-item d-flex justify-content-between align-items-start">
          <div className="ms-2 me-auto">
            <Link to={"/customer/notifications/"} className="fw-bold text-dark">
              <i className="fas fa-bell me-2"></i> Notifications
            </Link>
          </div>
          <span className="badge bg-primary-yellow rounded-pill">
            {notificationsCount}
          </span>
        </li>
        <li className="list-group-item d-flex justify-content-between align-items-start">
          <div className="ms-2 me-auto">
            <Link to={"/customer/settings/"} className="fw-bold text-dark">
              <i className="fas fa-gear me-2"></i> Setting
            </Link>
          </div>
        </li>
        <li className="list-group-item d-flex justify-content-between align-items-start">
          <div className="ms-2 me-auto">
            <Link to="/logout" className="fw-bold">
              <i className="fas fa-sign-out me-2"></i> Logout
            </Link>
          </div>
        </li>
      </ol>
    </div>
  );
}

export default Sidebar;
