import { Link, useLocation } from "react-router-dom";
import UserData from "../plugin/UserData";
import "../../assets/css/sidebar.css";
import { useState } from "react";

function Sidebar() {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(true);

  const isActiveLink = (currentPath, linkPath) => {
    return currentPath.includes(linkPath);
  };

  if (UserData()?.vendor_id === 0) {
    window.location.href = "/vendor/register/";
  }

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className="col-md-3 col-lg-2 sidebar-offcanvas bg-dark navbar-dark text-start position-fixed"
      id="sidebar"
      role="navigation"
      style={{
        overflowY: "auto",
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 100,
        paddingTop: "20px",
        transition: "all 0.3s ease-in-out",
        width: isExpanded ? "auto" : "3rem",
        marginTop: "5rem",
        height:
          window.innerWidth >= 768
            ? "100%"
            : isExpanded
            ? "calc(100vh - 5rem)"
            : "3.7rem",
        backgroundColor: "transparent",
        borderRadius: "0 0.5rem 0.5rem 0",
        marginLeft:
          window.innerWidth >= 768
            ? isExpanded
              ? "0"
              : "-2rem"
            : isExpanded
            ? "0"
            : "-2.3rem",
      }}
    >
      {window.innerWidth >= 768 && (
        <div
          onClick={toggleSidebar}
          style={{
            position: "absolute",
            top: "1rem",
            right: "-1rem",
            cursor: "pointer",
            backgroundColor: "#ffd700",
            width: "1.5rem",
            height: "1.5rem",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 0.3s ease",
          }}
        >
          <i
            className={`bi bi-chevron-${isExpanded ? "left" : "right"}`}
            style={{
              color: "#000",
              fontSize: "0.8rem",
            }}
          />
        </div>
      )}

      <div
        onClick={toggleSidebar}
        className="d-md-none position-absolute"
        style={{
          top: "1rem",
          right: "-1rem",
          cursor: "pointer",
          backgroundColor: "#ffd700",
          width: "1.5rem",
          height: "1.5rem",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "transform 0.3s ease",
        }}
      >
        <i
          className={`bi bi-chevron-${isExpanded ? "left" : "right"}`}
          style={{
            color: "#000",
            fontSize: "0.8rem",
          }}
        />
      </div>

      <div
        className={`${isExpanded ? "show" : "collapse"} d-md-block`}
        id="sidebarMenu"
      >
        <ul className="nav nav-pills flex-column mb-auto nav flex-column pl-1 pt-2">
          <li className="mb-3 nav-link-vendor-sidebar">
            <Link
              to="/vendor/dashboard/"
              className={
                isActiveLink(location.pathname, "/vendor/dashboard/")
                  ? "nav-link text-white active nav-link-vendor-sidebar"
                  : "nav-link text-white nav-link-vendor-sidebar"
              }
            >
              {" "}
              <i className="bi bi-speedometer" /> {isExpanded && "Dashboard"}{" "}
            </Link>
          </li>
          <li className="mb-3">
            <Link
              to="/vendor/products/"
              className={
                isActiveLink(location.pathname, "/vendor/products/")
                  ? "nav-link text-white active  nav-link-vendor-sidebar"
                  : "nav-link text-white nav-link-vendor-sidebar"
              }
            >
              {" "}
              <i className="bi bi-grid" /> {isExpanded && "Products"}{" "}
            </Link>
          </li>
          <li className="mb-3">
            <Link
              to="/vendor/orders/"
              className={
                isActiveLink(location.pathname, "/vendor/orders/")
                  ? "nav-link text-white active nav-link-vendor-sidebar"
                  : "nav-link text-white nav-link-vendor-sidebar"
              }
            >
              {" "}
              <i className="bi bi-cart-check" /> {isExpanded && "Orders"}{" "}
            </Link>
          </li>
          <li className="mb-3">
            <Link
              to="/vendor/earning/"
              className={
                isActiveLink(location.pathname, "/vendor/earning/")
                  ? "nav-link text-white active nav-link-vendor-sidebar"
                  : "nav-link text-white nav-link-vendor-sidebar"
              }
            >
              {" "}
              <i className="bi bi-currency-dollar" /> {isExpanded && "Earning"}{" "}
            </Link>
          </li>
          <li className="mb-3">
            <Link
              to="/vendor/reviews/"
              className={
                isActiveLink(location.pathname, "/vendor/reviews/")
                  ? "nav-link text-white active nav-link-vendor-sidebar"
                  : "nav-link text-white nav-link-vendor-sidebar"
              }
            >
              {" "}
              <i className="bi bi-star" /> {isExpanded && "Reviews"}{" "}
            </Link>
          </li>
          <li className="mb-3">
            <Link
              to="/vendor/product/new/"
              className={
                isActiveLink(location.pathname, "/vendor/product/new/")
                  ? "nav-link text-white active nav-link-vendor-sidebar"
                  : "nav-link text-white nav-link-vendor-sidebar"
              }
            >
              {" "}
              <i className="bi bi-plus-circle" /> {isExpanded && "Add Product"}{" "}
            </Link>
          </li>
          <li className="mb-3">
            <Link
              to={`/vendor/coupon/`}
              className={
                isActiveLink(location.pathname, "/vendor/coupon/")
                  ? "nav-link text-white active nav-link-vendor-sidebar"
                  : "nav-link text-white nav-link-vendor-sidebar"
              }
            >
              {" "}
              <i className="bi bi-tag" /> {isExpanded && "Coupon & Discount"}{" "}
            </Link>
          </li>
          <li className="mb-3">
            <Link
              to={`/vendor/notifications/`}
              className={
                isActiveLink(location.pathname, "/vendor/notifications/")
                  ? "nav-link text-white active nav-link-vendor-sidebar"
                  : "nav-link text-white nav-link-vendor-sidebar"
              }
            >
              {" "}
              <i className="bi bi-bell" /> {isExpanded && "Notifications"}{" "}
            </Link>
          </li>
          <li className="mb-3">
            <Link
              to="/vendor/settings/"
              className={
                isActiveLink(location.pathname, "/vendor/settings/")
                  ? "nav-link text-white active nav-link-vendor-sidebar"
                  : "nav-link text-white nav-link-vendor-sidebar"
              }
            >
              {" "}
              <i className="bi bi-gear-fill" /> {isExpanded && "Settings"}{" "}
            </Link>
          </li>

          <li className="mb-3">
            <Link
              to="/logout"
              className={
                isActiveLink(location.pathname, "/logout")
                  ? "nav-link text-white active nav-link-vendor-sidebar"
                  : "nav-link text-white nav-link-vendor-sidebar"
              }
            >
              {" "}
              <i className="bi bi-box-arrow-left" /> {isExpanded && "Logout"}{" "}
            </Link>
          </li>
        </ul>
        <hr />
      </div>
    </div>
  );
}

export default Sidebar;
