import { useContext, useState } from "react";
import { useAuthStore } from "../../store/auth";
import { Link } from "react-router-dom";
import { CartContext } from "../plugin/Context";
import { useNavigate } from "react-router-dom";

function StoreHeader() {
  const [cartCount] = useContext(CartContext);
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
        <div className="container">
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
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <div className="hamburger-icon">
              <span className="line line1"></span>
              <span className="line line2"></span>
              <span className="line line3"></span>
            </div>
            <style>
              {`
                .hamburger-icon {
                  width: 17px;
                  height: 14px;
                  position: relative;
                  cursor: pointer;
                }
                
                .line {
                  display: block;
                  position: absolute;
                  height: 1px;
                  width: 100%;
                  background: black;
                  border-radius: 1px;
                  opacity: 1;
                  left: 0;
                  transform: rotate(0deg);
                  transition: .25s ease-in-out;
                }

                .line1 { top: 0px; }
                .line2 { top: 50%; }
                .line3 { top: 100%; }

                .navbar-toggler[aria-expanded="true"] .line1 {
                  top: 50%;
                  transform: rotate(45deg);
                }

                .navbar-toggler[aria-expanded="true"] .line2 {
                  opacity: 0;
                }

                .navbar-toggler[aria-expanded="true"] .line3 {
                  top: 50%;
                  transform: rotate(-45deg);
                }
                  .navbar-toggler:hover {
                    border-color: transparent;
                  }
              `}
            </style>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Pages
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li>
                    <a className="dropdown-item" href="#">
                      About Us
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Contact Us
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Blog{" "}
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Changelog
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Terms & Condition
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Cookie Policy
                    </a>
                  </li>
                </ul>
              </li>

              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Account
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li>
                    <Link to={"/customer/account/"} className="dropdown-item">
                      <i className="fas fa-user"></i> Account
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to={`/customer/orders/`}>
                      <i className="fas fa-shopping-cart"></i> Orders
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to={`/customer/wishlist/`}>
                      <i className="fas fa-heart"></i> Wishlist
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item"
                      to={`/customer/notifications/`}
                    >
                      <i className="fas fa-bell fa-shake"></i> Notifications
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to={`/customer/settings/`}>
                      <i className="fas fa-gear fa-spin"></i> Settings
                    </Link>
                  </li>
                </ul>
              </li>

              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Vendor
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li>
                    <Link className="dropdown-item" to="/vendor/dashboard/">
                      {" "}
                      <i className="fas fa-user"></i> Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/vendor/products/">
                      {" "}
                      <i className="bi bi-grid-fill"></i> Products
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/vendor/product/new/">
                      {" "}
                      <i className="fas fa-plus-circle"></i> Add Products
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/vendor/orders/">
                      {" "}
                      <i className="fas fa-shopping-cart"></i> Orders
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/vendor/earning/">
                      {" "}
                      <i className="fas fa-dollar-sign"></i> Earning
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/vendor/reviews/">
                      {" "}
                      <i className="fas fa-star"></i> Reviews
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/vendor/coupon/">
                      {" "}
                      <i className="fas fa-tag"></i> Coupon
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/vendor/notifications/">
                      {" "}
                      <i className="fas fa-bell fa-shake"></i> Notifications
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/vendor/settings/">
                      {" "}
                      <i className="fas fa-gear fa-spin"></i> Settings
                    </Link>
                  </li>
                </ul>
              </li>

              <li className="nav-item dropdown">
                <Link className="nav-link" to="/logout">
                  <svg
                    width="19"
                    height="15"
                    viewBox="0 0 19 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.6781 7.90354H0.976928C0.6669 7.90354 0.415283 7.64938 0.415283 7.33623C0.415283 7.02307 0.6669 6.76891 0.976928 6.76891H11.899L9.33795 4.18575C9.24434 4.08439 9.18743 3.94899 9.18743 3.79922C9.18743 3.48606 9.43904 3.23191 9.74907 3.23191C9.89734 3.23191 10.0321 3.29015 10.1325 3.3847L13.5323 6.81884C13.6327 6.92095 13.6948 7.0624 13.6948 7.21747C13.6948 7.37253 13.6327 7.51398 13.5323 7.61686L10.1325 11.0926C10.0321 11.1879 9.8966 11.2469 9.74757 11.2469C9.43754 11.2469 9.18593 10.9927 9.18593 10.6796C9.18593 10.5306 9.24284 10.3952 9.3357 10.2946L11.6781 7.90354ZM15.8755 2.26067C14.5545 0.925592 12.7288 0.100342 10.7121 0.100342C8.69542 0.100342 6.8697 0.926349 5.54872 2.26067C5.45511 2.36203 5.3982 2.49743 5.3982 2.6472C5.3982 2.96035 5.64981 3.21451 5.95984 3.21451C6.10811 3.21451 6.24291 3.15627 6.34326 3.06171C7.4613 1.93238 9.0062 1.23345 10.7121 1.23345C14.1239 1.23345 16.8902 4.02766 16.8902 7.47389C16.8902 10.9201 14.1239 13.7143 10.7121 13.7143C9.00545 13.7143 7.46055 13.0154 6.34251 11.8861C6.24216 11.7915 6.10811 11.734 5.95984 11.734C5.64981 11.734 5.3982 11.9882 5.3982 12.3013C5.3982 12.4511 5.45586 12.5873 5.54946 12.6886C6.87644 14.063 8.72837 14.9148 10.7773 14.9148C14.8099 14.9148 18.0786 11.613 18.0786 7.5397C18.0786 5.4709 17.2354 3.6018 15.8777 2.26218L15.8755 2.26067Z"
                      fill="black"
                    />
                  </svg>
                </Link>
              </li>
            </ul>
            <div className="d-flex">
              <input
                onChange={handleSearchChange}
                name="search"
                className="form-control me-2"
                type="text"
                placeholder="Search"
                aria-label="Search"
              />
              <button
                onClick={handleSearchSubmit}
                className="btn btn-outline-success me-2"
                type="submit"
              >
                Search
              </button>
            </div>
            {isLoggedIn() ? (
              <>
                <Link className="btn me-2" to={"/customer/account/"}>
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
                <Link className="btn btn-primary me-2" to="/login">
                  Login
                </Link>
                <Link className="btn btn-primary me-2" to="/register">
                  Register
                </Link>
              </>
            )}
            <Link className="btn" to="/cart/">
              <i className="fas fa-shopping-cart"></i>{" "}
              <span id="cart-total-items">{cartCount}</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default StoreHeader;
