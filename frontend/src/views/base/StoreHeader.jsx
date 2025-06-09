import { useContext, useState } from "react";
import { useAuthStore } from "../../store/auth";
import { Link } from "react-router-dom";
import { CartContext } from "../plugin/Context";
import { useNavigate } from "react-router-dom";
import "../../App.css";

function StoreHeader() {
  const { cartCount } = useContext(CartContext);
  const [search, setSearch] = useState("");

  const [isLoggedIn, user] = useAuthStore((state) => [
    state.isLoggedIn,
    state.user,
  ]);

  const userData = user();
  console.log("user().vendor_id", userData?.vendor_id);

  const navigate = useNavigate();

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    console.log(search);
  };

  const handleSearchSubmit = () => {
    navigate(`/search?query=${search}`);
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg">
        <div className="container container-products-main">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ">
            <li className="nav-item dropdown ">
              <a
                className="nav-link "
                href="#"
                id="mainNavDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <svg
                  width="21"
                  height="15"
                  viewBox="0 0 21 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="hamburger-svg nav-item-burge"
                  style={{ display: "block" }} // Add display block to ensure it's hidden when menu opens
                >
                  <path
                    d="M1.39069 0C1.09483 0 0.85498 0.239839 0.85498 0.535714C0.85498 0.831589 1.09483 1.07143 1.39069 1.07143H19.605C19.9008 1.07143 20.1407 0.831589 20.1407 0.535714C20.1407 0.239839 19.9008 0 19.605 0H1.39069ZM1.39069 6.96429C1.09483 6.96429 0.85498 7.20412 0.85498 7.5C0.85498 7.79587 1.09483 8.03571 1.39069 8.03571H19.605C19.9008 8.03571 20.1407 7.79587 20.1407 7.5C20.1407 7.20412 19.9008 6.96429 19.605 6.96429H1.39069ZM1.39069 13.9286C1.09483 13.9286 0.85498 14.1684 0.85498 14.4643C0.85498 14.7602 1.09483 15 1.39069 15H19.605C19.9008 15 20.1407 14.7602 20.1407 14.4643C20.1407 14.1684 19.9008 13.9286 19.605 13.9286H1.39069Z"
                    fill="black"
                  />
                </svg>
              </a>
              <ul
                className="dropdown-menu side-panel custom-negative"
                aria-labelledby="mainNavDropdown"
              >
                <div className="icon-close">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M0.785821 0.134826L7.49949 6.84859L14.2142 0.134826C14.3939 -0.0449419 14.6854 -0.0449419 14.8652 0.134826C15.0449 0.314593 15.0449 0.606054 14.8652 0.785821L8.15039 7.49949L14.8652 14.2142C15.0449 14.3939 15.0449 14.6854 14.8652 14.8652C14.6854 15.0449 14.3939 15.0449 14.2142 14.8652L7.49949 8.15039L0.785821 14.8652C0.606054 15.0449 0.314593 15.0449 0.134826 14.8652C-0.0449419 14.6854 -0.0449419 14.3939 0.134826 14.2142L6.84859 7.49949L0.134826 0.785821C-0.0449419 0.606054 -0.0449419 0.314593 0.134826 0.134826C0.314593 -0.0449419 0.606054 -0.0449419 0.785821 0.134826Z"
                      fill="black"
                    />
                  </svg>
                </div>
                <li className="nav-item pt-5">
                  <div
                    className="nav-link p-0"
                    role="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation(); // Prevent event bubbling
                      const menu = e.currentTarget.nextElementSibling;
                      menu.classList.toggle("show");
                    }}
                  >
                    Account
                  </div>
                  <ul className="dropdown-menu">
                    <li>
                      <Link
                        className="dropdown-item"
                        to="/customer/account/"
                        onClick={(e) => {
                          document
                            .querySelector(".side-panel")
                            .classList.remove("show");
                          e.currentTarget
                            .closest(".dropdown-menu")
                            .classList.remove("show");
                        }}
                      >
                        <i className="fas fa-user"></i> Account
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item"
                        to="/customer/orders/"
                        onClick={(e) => {
                          document
                            .querySelector(".side-panel")
                            .classList.remove("show");
                          e.currentTarget
                            .closest(".dropdown-menu")
                            .classList.remove("show");
                        }}
                      >
                        <i className="fas fa-shopping-cart"></i> Orders
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item"
                        to="/customer/wishlist/"
                        onClick={(e) => {
                          document
                            .querySelector(".side-panel")
                            .classList.remove("show");
                          e.currentTarget
                            .closest(".dropdown-menu")
                            .classList.remove("show");
                        }}
                      >
                        <i className="fas fa-heart"></i> Wishlist
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item"
                        to="/customer/notifications/"
                        onClick={(e) => {
                          document
                            .querySelector(".side-panel")
                            .classList.remove("show");
                          e.currentTarget
                            .closest(".dropdown-menu")
                            .classList.remove("show");
                        }}
                      >
                        <i className="fas fa-bell fa-shake"></i> Notifications
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item"
                        to="/customer/settings/"
                        onClick={(e) => {
                          document
                            .querySelector(".side-panel")
                            .classList.remove("show");
                          e.currentTarget
                            .closest(".dropdown-menu")
                            .classList.remove("show");
                        }}
                      >
                        <i className="fas fa-gear fa-spin"></i> Settings
                      </Link>
                    </li>
                  </ul>
                </li>

                <li className="nav-item">
                  <div
                    className="nav-link p-0"
                    role="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation(); // Prevent event bubbling
                      const menu = e.currentTarget.nextElementSibling;
                      menu.classList.toggle("show");
                    }}
                  >
                    Artist/designer
                  </div>
                  <ul className="dropdown-menu">
                    <li>
                      <Link
                        className="dropdown-item"
                        to="/vendor/dashboard/"
                        onClick={(e) => {
                          document
                            .querySelector(".side-panel")
                            .classList.remove("show");
                          e.currentTarget
                            .closest(".dropdown-menu")
                            .classList.remove("show");
                        }}
                      >
                        <i className="fas fa-user"></i> Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item"
                        to="/vendor/products/"
                        onClick={(e) => {
                          document
                            .querySelector(".side-panel")
                            .classList.remove("show");
                          e.currentTarget
                            .closest(".dropdown-menu")
                            .classList.remove("show");
                        }}
                      >
                        <i className="bi bi-grid-fill"></i> Products
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item"
                        to="/vendor/product/new/"
                        onClick={(e) => {
                          document
                            .querySelector(".side-panel")
                            .classList.remove("show");
                          e.currentTarget
                            .closest(".dropdown-menu")
                            .classList.remove("show");
                        }}
                      >
                        <i className="fas fa-plus-circle"></i> Add Products
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item"
                        to="/vendor/orders/"
                        onClick={(e) => {
                          document
                            .querySelector(".side-panel")
                            .classList.remove("show");
                          e.currentTarget
                            .closest(".dropdown-menu")
                            .classList.remove("show");
                        }}
                      >
                        <i className="fas fa-shopping-cart"></i> Orders
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item"
                        to="/vendor/earning/"
                        onClick={(e) => {
                          document
                            .querySelector(".side-panel")
                            .classList.remove("show");
                          e.currentTarget
                            .closest(".dropdown-menu")
                            .classList.remove("show");
                        }}
                      >
                        <i className="fas fa-dollar-sign"></i> Earning
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item"
                        to="/vendor/reviews/"
                        onClick={(e) => {
                          document
                            .querySelector(".side-panel")
                            .classList.remove("show");
                          e.currentTarget
                            .closest(".dropdown-menu")
                            .classList.remove("show");
                        }}
                      >
                        <i className="fas fa-star"></i> Reviews
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item"
                        to="/vendor/coupon/"
                        onClick={(e) => {
                          document
                            .querySelector(".side-panel")
                            .classList.remove("show");
                          e.currentTarget
                            .closest(".dropdown-menu")
                            .classList.remove("show");
                        }}
                      >
                        <i className="fas fa-tag"></i> Coupon
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item"
                        to="/vendor/notifications/"
                        onClick={(e) => {
                          document
                            .querySelector(".side-panel")
                            .classList.remove("show");
                          e.currentTarget
                            .closest(".dropdown-menu")
                            .classList.remove("show");
                        }}
                      >
                        <i className="fas fa-bell fa-shake"></i> Notifications
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item"
                        to="/vendor/settings/"
                        onClick={(e) => {
                          document
                            .querySelector(".side-panel")
                            .classList.remove("show");
                          e.currentTarget
                            .closest(".dropdown-menu")
                            .classList.remove("show");
                        }}
                      >
                        <i className="fas fa-gear fa-spin"></i> Settings
                      </Link>
                    </li>
                  </ul>
                </li>

                <li className="nav-item">
                  <div
                    className="nav-link p-0"
                    role="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation(); // Prevent event bubbling
                      const menu = e.currentTarget.nextElementSibling;
                      menu.classList.toggle("show");
                    }}
                  >
                    Pages
                  </div>
                  <ul className="dropdown-menu">
                    <li>
                      <Link
                        className="dropdown-item"
                        to="/about"
                        onClick={(e) => {
                          document
                            .querySelector(".side-panel")
                            .classList.remove("show");
                          e.currentTarget
                            .closest(".dropdown-menu")
                            .classList.remove("show");
                        }}
                      >
                        About Us
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item"
                        to="/contact"
                        onClick={(e) => {
                          document
                            .querySelector(".side-panel")
                            .classList.remove("show");
                          e.currentTarget
                            .closest(".dropdown-menu")
                            .classList.remove("show");
                        }}
                      >
                        Contact Us
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item"
                        to="/blog"
                        onClick={(e) => {
                          document
                            .querySelector(".side-panel")
                            .classList.remove("show");
                          e.currentTarget
                            .closest(".dropdown-menu")
                            .classList.remove("show");
                        }}
                      >
                        Blog
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item"
                        to="/changelog"
                        onClick={(e) => {
                          document
                            .querySelector(".side-panel")
                            .classList.remove("show");
                          e.currentTarget
                            .closest(".dropdown-menu")
                            .classList.remove("show");
                        }}
                      >
                        Changelog
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item"
                        to="/terms"
                        onClick={(e) => {
                          document
                            .querySelector(".side-panel")
                            .classList.remove("show");
                          e.currentTarget
                            .closest(".dropdown-menu")
                            .classList.remove("show");
                        }}
                      >
                        Terms & Condition
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item"
                        to="/cookie-policy"
                        onClick={(e) => {
                          document
                            .querySelector(".side-panel")
                            .classList.remove("show");
                          e.currentTarget
                            .closest(".dropdown-menu")
                            .classList.remove("show");
                        }}
                      >
                        Cookie Policy
                      </Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <Link
                    className="dropdown-item p-0"
                    to="/register"
                    onClick={() =>
                      document
                        .querySelector(".side-panel")
                        .classList.remove("show")
                    }
                  >
                    Register
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item p-0"
                    to="/logout"
                    onClick={() =>
                      document
                        .querySelector(".side-panel")
                        .classList.remove("show")
                    }
                  >
                    Logout
                  </Link>
                </li>
              </ul>
              <style>
                {`
                  .side-panel {
                    position: fixed;
                    top: 0;
                    left: -100%;
                    width: 300px;
                    height: 100vh;
                    background: white;
                    box-shadow: 2px 0 5px rgba(0,0,0,0.1);
                    transition: left 0.3s ease;
                    padding: 20px;
                    margin: 0;
                    overflow-y: auto;
                  }

                  .side-panel.show {
                    left: 0;
                  }

                  .dropdown-submenu .dropdown-menu {
                    position: static !important;
                    margin-left: 15px;
                    box-shadow: none;
                    border: none;
                    padding-left: 15px;
                  }

                  .dropdown-item {
                    padding: 10px 15px;
                    border-radius: 5px;
                    transition: background 0.2s ease;
                  }

                  .dropdown-item:hover {
                    background: #f8f9fa;
                  }
                `}
              </style>
            </li>
          </ul>

          <div className="d-flex mb-2">
            <div style={{ position: "relative" }}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                onClick={() => {
                  const searchInput = document.getElementById("searchInput");
                  searchInput.style.width =
                    searchInput.style.width === "200px" ? "0px" : "200px";
                  searchInput.style.padding =
                    searchInput.style.width === "0px"
                      ? "0"
                      : "0.375rem 0.75rem";
                  if (searchInput.style.width === "200px") {
                    searchInput.focus();
                  }
                }}
                style={{ cursor: "pointer" }}
              >
                <path
                  d="M15.6783 14.0517L11.427 9.78674C12.3043 8.72268 12.78 7.38418 12.7721 6.00594C12.7721 4.42605 12.1443 2.91178 11.027 1.79432C9.90975 0.677655 8.39381 0.0501709 6.8139 0.0501709C5.23317 0.0501709 3.71809 0.677655 2.60005 1.79432C1.4828 2.9117 0.85498 4.42612 0.85498 6.00594C0.85498 7.58512 1.4828 9.10011 2.60005 10.2168C3.71802 11.3335 5.23324 11.961 6.8139 11.961C8.19281 11.9689 9.53197 11.4934 10.5967 10.6167L14.8639 14.8816C15.0888 15.1064 15.4535 15.1064 15.6784 14.8816C15.7915 14.7728 15.855 14.623 15.855 14.4666C15.855 14.3096 15.7915 14.1597 15.6783 14.0517ZM2.00825 6.00594C2.00825 4.73224 2.51426 3.51043 3.41599 2.60986C4.31699 1.70861 5.53952 1.20287 6.81386 1.20287C8.0882 1.20287 9.30995 1.70861 10.2117 2.60986C11.1127 3.5104 11.6187 4.73228 11.6187 6.00594C11.6187 7.27961 11.1127 8.50072 10.2117 9.40203C9.31 10.3026 8.0882 10.8083 6.81386 10.8083C5.53952 10.8083 4.31703 10.3026 3.41599 9.40203C2.51426 8.50077 2.00825 7.27961 2.00825 6.00594Z"
                  fill="black"
                />
              </svg>
              <input
                id="searchInput"
                onChange={handleSearchChange}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSearchSubmit();
                  }
                }}
                name="search"
                className="form-control"
                type="text"
                placeholder=""
                aria-label="Search"
                style={{
                  position: "absolute",
                  right: "-13rem",
                  top: "0",
                  width: "0px",
                  padding: "0",
                  transition: "all 0.3s ease",
                  border: "transparent",
                  borderRadius: "4px",
                }}
              />
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center w-100">
            <div></div>
            <Link className="navbar-brand" to="/">
              <svg
                width="106"
                height="67"
                viewBox="0 0 106 67"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M70.3507 41.3624L63.4456 48.2864C62.9603 48.773 62.1818 48.773 61.6965 48.2864L54.7914 41.3624C54.3061 40.8758 53.5277 40.8758 53.0424 41.3624L50.4239 43.9881C49.9386 44.4747 49.9386 45.2553 50.4239 45.7419L57.329 52.6659C57.8143 53.1525 57.8143 53.9331 57.329 54.4197L50.4239 61.3438C49.9386 61.8304 49.9386 62.611 50.4239 63.0976L53.0424 65.7233C53.5277 66.2099 54.3061 66.2099 54.7914 65.7233L61.6965 58.7992C62.1818 58.3126 62.9603 58.3126 63.4456 58.7992L70.3507 65.7233C70.836 66.2099 71.6145 66.2099 72.0997 65.7233L74.7182 63.0976C75.2035 62.611 75.2035 61.8304 74.7182 61.3438L67.8131 54.4197C67.3278 53.9331 67.3278 53.1525 67.8131 52.6659L74.7182 45.7419C75.2035 45.2553 75.2035 44.4747 74.7182 43.9881L72.0997 41.3624C71.6145 40.8758 70.836 40.8758 70.3507 41.3624Z"
                  fill="#EAAD00"
                />
                <path
                  d="M31.5353 36.1689L47.2886 20.3964C48.0587 19.6255 48.0587 18.3887 47.2886 17.6178L31.2305 1.54013C30.4605 0.769175 29.2252 0.769175 28.4552 1.54013L0.798586 29.2303C0.0285639 30.0013 0.0285639 31.238 0.798586 32.009L4.9535 36.1689C5.72352 36.9399 6.95876 36.9399 7.72878 36.1689L16.4878 27.3993C17.2257 26.6605 18.4289 26.6283 19.1989 27.3351L28.8402 36.2171C29.6102 36.9238 30.8134 36.9078 31.5513 36.1529L31.5353 36.1689ZM31.2305 15.4013L33.4603 17.6339C34.2304 18.4048 34.2304 19.6416 33.4603 20.4125L31.2626 22.613C30.5246 23.3518 29.3215 23.3839 28.5515 22.6772L26.2414 20.541C25.4232 19.7861 25.3912 18.5012 26.1772 17.7142L28.4712 15.4174C29.2413 14.6464 30.4765 14.6464 31.2465 15.4174L31.2305 15.4013Z"
                  fill="#090A10"
                />
                <path
                  d="M75.1694 1.62413L31.2266 45.5607C30.4563 46.331 29.2205 46.331 28.4501 45.5607L17.8095 34.9216C17.0391 34.1513 15.8033 34.1513 15.033 34.9216L10.8762 39.0777C10.1059 39.848 10.1059 41.0836 10.8762 41.8539L28.4341 59.4092C29.2044 60.1795 30.4402 60.1795 31.2106 59.4092L54.6906 35.9325C55.0597 35.5635 55.5573 35.3548 56.0708 35.3548H83.3224C85.0718 35.3548 85.9385 37.457 84.7027 38.6926L71.3978 51.9955C70.6275 52.7658 70.6275 54.0014 71.3978 54.7717L75.5546 58.9278C76.325 59.6981 77.5608 59.6981 78.3311 58.9278L105.422 31.8406C106.193 31.0703 106.193 29.8347 105.422 29.0644L77.962 1.60809C77.1916 0.837832 75.9558 0.837832 75.1855 1.60809L75.1694 1.62413ZM83.3224 25.5822H69.7929C68.0436 25.5822 67.1769 23.4801 68.4127 22.2445L75.1855 15.4727C75.9558 14.7024 77.1916 14.7024 77.962 15.4727L84.7348 22.2445C85.9706 23.4801 85.0878 25.5822 83.3545 25.5822H83.3224Z"
                  fill="#090A10"
                />
              </svg>
            </Link>
            <div></div>
          </div>

          <div
            className="collapse navbar-collapse d-flex justify-content-end navbar-profile-cart-wrapper"
            id="navbarSupportedContent"
          >
            {isLoggedIn() ? (
              <>
                <Link className="me-2" to={"/customer/account/"}>
                  <svg
                    width="13"
                    height="15"
                    viewBox="0 0 13 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12.8049 14.4512C12.8049 14.7543 12.5592 15 12.2561 15C11.953 15 11.7073 14.7543 11.7073 14.4512C11.7073 11.5214 9.33224 9.14634 6.40244 9.14634C3.47264 9.14634 1.09756 11.5214 1.09756 14.4512C1.09756 14.7543 0.851864 15 0.548781 15C0.245697 15 0 14.7543 0 14.4512C0 10.9153 2.86647 8.04878 6.40244 8.04878C9.93841 8.04878 12.8049 10.9153 12.8049 14.4512ZM6.40244 7.68293C4.28086 7.68293 2.56098 5.96305 2.56098 3.84146C2.56098 1.71988 4.28086 0 6.40244 0C8.52402 0 10.2439 1.71988 10.2439 3.84146C10.2439 5.96305 8.52402 7.68293 6.40244 7.68293ZM6.40244 6.58537C7.91785 6.58537 9.14634 5.35688 9.14634 3.84146C9.14634 2.32605 7.91785 1.09756 6.40244 1.09756C4.88702 1.09756 3.65854 2.32605 3.65854 3.84146C3.65854 5.35688 4.88702 6.58537 6.40244 6.58537Z"
                      fill="black"
                    />
                  </svg>
                </Link>
              </>
            ) : (
              <>
                <Link className=" me-2" to="/login">
                  <svg
                    width="14"
                    height="16"
                    viewBox="0 0 14 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.3698 14.5516C13.3698 14.8546 13.1241 15.1003 12.821 15.1003C12.518 15.1003 12.2723 14.8546 12.2723 14.5516C12.2723 11.6218 9.89718 9.24668 6.96738 9.24668C4.03758 9.24668 1.6625 11.6218 1.6625 14.5516C1.6625 14.8546 1.4168 15.1003 1.11372 15.1003C0.810639 15.1003 0.564941 14.8546 0.564941 14.5516C0.564941 11.0156 3.43141 8.14912 6.96738 8.14912C10.5033 8.14912 13.3698 11.0156 13.3698 14.5516ZM6.96738 7.78327C4.8458 7.78327 3.12592 6.06339 3.12592 3.94181C3.12592 1.82022 4.8458 0.100342 6.96738 0.100342C9.08896 0.100342 10.8088 1.82022 10.8088 3.94181C10.8088 6.06339 9.08896 7.78327 6.96738 7.78327ZM6.96738 6.68571C8.4828 6.68571 9.71128 5.45722 9.71128 3.94181C9.71128 2.42639 8.4828 1.1979 6.96738 1.1979C5.45197 1.1979 4.22348 2.42639 4.22348 3.94181C4.22348 5.45722 5.45197 6.68571 6.96738 6.68571Z"
                      fill="black"
                    />
                  </svg>
                </Link>
              </>
            )}
            <Link className="d-flex gap-2 align-items-center p-0" to="/cart/">
              <svg
                width="18"
                height="16"
                viewBox="0 0 18 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.977325 0.386719C0.669471 0.386719 0.419922 0.636277 0.419922 0.944122C0.419922 1.25197 0.669471 1.50153 0.977325 1.50153H3.20114C4.12368 3.78641 5.03238 6.07548 5.9475 8.36455L5.1056 10.3909C5.03507 10.5599 5.05492 10.7636 5.15672 10.9158C5.25853 11.0679 5.43928 11.1639 5.62235 11.1632H14.9124C15.2069 11.1673 15.4777 10.9003 15.4777 10.6058C15.4777 10.3113 15.2069 10.0442 14.9124 10.0484H6.45846L6.94039 8.89873L15.8879 8.18457C16.1221 8.16617 16.3341 7.98372 16.3872 7.7549L17.502 2.92406C17.5749 2.59868 17.2897 2.24364 16.9562 2.24473H4.69914L4.09529 0.735096C4.01261 0.530748 3.79897 0.386724 3.57854 0.386719H0.977325ZM5.14624 3.35954H16.2537L15.3885 7.11039L6.91716 7.78392L5.14624 3.35954ZM7.48036 11.5348C6.46082 11.5348 5.62235 12.3732 5.62235 13.3928C5.62235 14.4123 6.46082 15.2508 7.48036 15.2508C8.49991 15.2508 9.33837 14.4123 9.33837 13.3928C9.33837 12.3732 8.49991 11.5348 7.48036 11.5348ZM13.0544 11.5348C12.0348 11.5348 11.1964 12.3732 11.1964 13.3928C11.1964 14.4123 12.0348 15.2508 13.0544 15.2508C14.0739 15.2508 14.9124 14.4123 14.9124 13.3928C14.9124 12.3732 14.0739 11.5348 13.0544 11.5348ZM7.48036 12.6496C7.89743 12.6496 8.22357 12.9757 8.22357 13.3928C8.22357 13.8099 7.89743 14.136 7.48036 14.136C7.06333 14.136 6.73716 13.8098 6.73716 13.3928C6.73716 12.9757 7.06333 12.6496 7.48036 12.6496ZM13.0544 12.6496C13.4714 12.6496 13.7976 12.9757 13.7976 13.3928C13.7976 13.8098 13.4714 14.136 13.0544 14.136C12.6373 14.136 12.3112 13.8099 12.3112 13.3928C12.3112 12.9757 12.6373 12.6496 13.0544 12.6496Z"
                  fill="black"
                />
              </svg>{" "}
              <span id="cart-total-items">{cartCount}</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default StoreHeader;
