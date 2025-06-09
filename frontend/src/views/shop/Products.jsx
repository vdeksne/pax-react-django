import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { FaCheckCircle, FaShoppingCart, FaSpinner } from "react-icons/fa";
import "../../assets/css/pricing.css";

import apiInstance from "../../utils/axios";
import GetCurrentAddress from "../plugin/UserCountry";
import UserData from "../plugin/UserData";
import CartID from "../plugin/cartID";
import { addToCart } from "../plugin/AddToCart";
import { addToWishlist } from "../plugin/addToWishlist";
import { CartContext } from "../plugin/Context";
import "../../App.css";

function Products() {
  // eslint-disable-next-line no-unused-vars
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [brand, setBrand] = useState([]);

  const [loadingStates, setLoadingStates] = useState({});
  const [loading, setLoading] = useState(true);

  const axios = apiInstance;
  const currentAddress = GetCurrentAddress();
  const userData = UserData();
  const cart_id = CartID();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedColors, setSelectedColors] = useState({});
  const [selectedSize, setSelectedSize] = useState({});
  const [colorImage, setColorImage] = useState("");
  const [colorValue, setColorValue] = useState("No Color");
  const [sizeValue, setSizeValue] = useState("No Size");
  const [qtyValue, setQtyValue] = useState(1);
  const { updateCartCount } = useContext(CartContext);

  // Responsive pagination
  const [itemsPerPage, setItemsPerPage] = useState(6);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerPage(3);
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(4);
      } else {
        setItemsPerPage(6);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const fetchData = async (endpoint, setDataFunction) => {
    try {
      const response = await axios.get(endpoint);
      setDataFunction(response.data);
      if (endpoint === "products/") {
        setLoading(false);
      }
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      if (endpoint === "products/") {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchData("products/", setProducts);
    fetchData("featured-products/", setFeaturedProducts);
    fetchData("category/", setCategory);
    fetchData("brand/", setBrand);
  }, []);

  const handleColorButtonClick = (event, product_id, colorName, colorImage) => {
    setColorValue(colorName);
    setColorImage(colorImage);
    setSelectedProduct(product_id);
    setSelectedColors((prev) => ({ ...prev, [product_id]: colorName }));
  };

  const handleSizeButtonClick = (event, product_id, sizeName) => {
    setSizeValue(sizeName);
    setSelectedProduct(product_id);
    setSelectedSize((prev) => ({ ...prev, [product_id]: sizeName }));
  };

  const handleQtyChange = (event, product_id) => {
    const value = Math.max(1, parseInt(event.target.value) || 1);
    setQtyValue(value);
    setSelectedProduct(product_id);
  };

  const handleAddToCart = async (product_id, price, shipping_amount) => {
    if (
      !product_id ||
      !price ||
      price <= 0 ||
      shipping_amount < 0 ||
      !qtyValue ||
      qtyValue <= 0
    ) {
      console.error("Invalid input parameters");
      return;
    }

    setLoadingStates((prev) => ({ ...prev, [product_id]: "Adding..." }));

    try {
      const success = await addToCart(
        product_id,
        userData?.user_id,
        qtyValue,
        price,
        shipping_amount,
        currentAddress?.country,
        colorValue,
        sizeValue,
        cart_id
      );

      if (success) {
        setLoadingStates((prev) => ({
          ...prev,
          [product_id]: "Added to Cart",
        }));
        setColorValue("No Color");
        setSizeValue("No Size");
        setQtyValue(1);

        const url = userData?.user_id
          ? `cart-list/${cart_id}/${userData.user_id}/`
          : `cart-list/${cart_id}/`;

        const response = await axios.get(url);
        updateCartCount(response.data.length);
      } else {
        throw new Error("Failed to add to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      setLoadingStates((prev) => ({ ...prev, [product_id]: "Add to Cart" }));
    }
  };

  const handleAddToWishlist = async (product_id) => {
    try {
      await addToWishlist(product_id, userData?.user_id);
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    }
  };

  return (
    <>
      {!loading ? (
        <div className="min-h-screen">
          <main className="mt-1 d-flex flex-column justify-content-center align-items-center">
            <div className="container-products">
              <section className="text-center container">
                <div className="position-relative">
                  <video
                    src={
                      window.innerWidth <= 768
                        ? "/assets/video/video.mp4"
                        : "/assets/video/desktop.mp4"
                    }
                    style={{
                      width: "100%",
                      objectFit: "cover",
                      objectPosition: "center",
                      maxWidth: "100vw",
                      borderRadius: "clamp(1rem, 1rem, 1rem)",
                      aspectRatio: window.innerWidth <= 768 ? "9/16" : "16/9",
                      background: "rgba(0,0,0,0.5)",
                    }}
                    className="img-products-hero"
                    frameBorder="0"
                    allow="autoplay; fullscreen"
                    title="Products Hero Video"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />

                  <div
                    className="position-absolute top-0 start-0 w-100 d-flex align-items-center justify-content-center"
                    style={{
                      background: "rgba(0,0,0,0.5)",
                      width: "100%",
                      objectFit: "cover",
                      objectPosition: "center",
                      maxWidth: "100vw",
                      borderRadius: "clamp(1rem, 1rem, 1rem)",
                      aspectRatio: window.innerWidth <= 768 ? "9/16" : "16/8.5",
                      height: "calc(100% - 8px)",
                    }}
                  >
                    <div
                      className="container text-white text-center m-4"
                      style={{ fontSize: "clamp(1rem, 4vw, 1.5rem)" }}
                    >
                      <h1 className="display-4">
                        <p className="mb-2">
                          <span className="responsive-text">
                            Fuel Creativity. Power Independence.
                          </span>
                        </p>
                        <p className="mb-4">
                          <span className="responsive-text">
                            Connect. Collaborate. Create.
                          </span>
                        </p>
                      </h1>

                      <p className="lead mb-5 display-5 responsive-text">
                        <span>
                          Empowering artists and designers to share their work,
                          build their brand, and shape their future.
                        </span>
                      </p>

                      {userData ? (
                        <Link
                          to="/customer/account"
                          className="btn-main responsive-button"
                          data-ga-category="cta-join"
                          data-ga-c="Click"
                          data-ga-l="start-trial-hero"
                        >
                          Account
                        </Link>
                      ) : (
                        <Link
                          to="/login"
                          className="btn-main responsive-button"
                          data-ga-category="cta-join"
                          data-ga-c="Click"
                          data-ga-l="start-trial-hero"
                        >
                          Login
                        </Link>
                      )}
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="mx-auto mb-4 mt-5">
                    <h1 className="fw-light heading-main">
                      Product Categories
                    </h1>
                  </div>
                </div>
              </section>
              <div className="d-flex justify-content-center flex-wrap gap-3">
                {category.map((c) => (
                  <div
                    key={c.id}
                    className="category-card"
                    style={{
                      margin: "10px",
                      borderRadius: "10px",
                      padding: "20px",
                      background: "#fff",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                      width: "clamp(150px, 20vw, 200px)",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = "translateY(-5px)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    <img
                      src={c.image}
                      alt={c.title}
                      className="img-fluid rounded-circle mb-3"
                      style={{
                        width: "clamp(60px, 10vw, 100px)",
                        height: "clamp(60px, 10vw, 100px)",
                        objectFit: "cover",
                      }}
                    />
                    <Link
                      to={`/category/${c.slug}`}
                      className="text-dark text-decoration-none fw-bold"
                      style={{
                        fontSize: "clamp(0.9rem, 1.5vw, 1.1rem)",
                        textAlign: "center",
                      }}
                    >
                      {c.title}
                    </Link>
                  </div>
                ))}
              </div>

              <section className="text-center container">
                <div className="row mt-4 mb-3">
                  <div className="col-lg-6 col-md-8 mx-auto">
                    <h1 className="fw-light heading-main">Featured Products</h1>
                    <p className="lead">Curated Highlights</p>
                  </div>
                </div>
              </section>
              <section className="text-center m-5">
                <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
                  {currentItems.map((product) => (
                    <div className="col" key={product.id}>
                      <div className="card h-100">
                        <div
                          className="bg-image hover-zoom ripple"
                          data-mdb-ripple-color="light"
                        >
                          <Link to={`/detail/${product.slug}`}>
                            <img
                              src={
                                selectedProduct === product.id && colorImage
                                  ? colorImage
                                  : product.image
                              }
                              className="w-100"
                              style={{
                                height: "clamp(200px, 30vw, 300px)",
                                objectFit: "cover",
                              }}
                              alt={product.title}
                            />
                          </Link>
                        </div>
                        <div className="card-body card-text p-0 pt-4">
                          <h6 className="">
                            By:{" "}
                            <Link to={`/vendor/${product?.vendor?.slug}`}>
                              {product.vendor.name}
                            </Link>
                          </h6>
                          <Link
                            to={`/detail/${product.slug}`}
                            className="text-reset"
                          >
                            <h5 className="card-title mb-3 ">
                              {product.title.slice(0, 30)}
                            </h5>
                          </Link>
                          <h6 className="mb-3">${product.price}</h6>

                          {/* Product Actions */}
                          <div className="heart-container">
                            {product.color?.length > 0 ||
                            product.size?.length > 0 ? (
                              <div className="btn-group">
                                <button
                                  className="dropdown-toggle btn-main-pricing"
                                  type="button"
                                  id="dropdownMenuClickable"
                                  data-bs-toggle="dropdown"
                                  data-bs-auto-close="false"
                                  aria-expanded="false"
                                >
                                  Variation
                                </button>
                                <ul
                                  className="dropdown-menu"
                                  style={{ maxWidth: "400px" }}
                                  aria-labelledby="dropdownMenuClickable"
                                >
                                  {/* Quantity */}
                                  <div className="d-flex flex-column mb-2 mt-2 p-1">
                                    <div className="p-1 mt-0 pt-0 d-flex flex-wrap">
                                      <li>
                                        <input
                                          type="number"
                                          className="form-control"
                                          placeholder="Quantity"
                                          onChange={(e) =>
                                            handleQtyChange(e, product.id)
                                          }
                                          min={1}
                                          value={qtyValue}
                                        />
                                      </li>
                                    </div>
                                  </div>

                                  {/* Size */}
                                  {product?.size?.length > 0 && (
                                    <div className="d-flex flex-column">
                                      <li className="p-1">
                                        <b>Size</b>:{" "}
                                        {selectedSize[product.id] ||
                                          "Select a size"}
                                      </li>
                                      <div className="p-1 mt-0 pt-0 d-flex flex-wrap gap-2">
                                        {product.size.map((size) => (
                                          <li key={size.id}>
                                            <button
                                              className="btn-secondary btn-sm"
                                              onClick={(e) =>
                                                handleSizeButtonClick(
                                                  e,
                                                  product.id,
                                                  size.name
                                                )
                                              }
                                            >
                                              {size.name}
                                            </button>
                                          </li>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* Color */}
                                  {product.color?.length > 0 && (
                                    <div className="d-flex flex-column mt-3">
                                      <li className="p-1 color_name_div">
                                        <b>Color</b>:{" "}
                                        {selectedColors[product.id] ||
                                          "Select a color"}
                                      </li>
                                      <div className="p-1 mt-0 pt-0 d-flex flex-wrap gap-2">
                                        {product.color.map((color) => (
                                          <li key={color.id}>
                                            <button
                                              className="color-button"
                                              style={{
                                                backgroundColor:
                                                  color.color_code,
                                                width: "2rem",
                                                height: "2rem",
                                                borderRadius: "50%",
                                                border:
                                                  selectedColors[product.id] ===
                                                  color.name
                                                    ? "2px solid #000"
                                                    : "none",
                                              }}
                                              onClick={(e) =>
                                                handleColorButtonClick(
                                                  e,
                                                  product.id,
                                                  color.name,
                                                  color.image
                                                )
                                              }
                                              aria-label={`Select ${color.name} color`}
                                            />
                                          </li>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* Add To Cart */}
                                  <div className="d-flex mt-3 p-1 w-100">
                                    <button
                                      onClick={() =>
                                        handleAddToCart(
                                          product.id,
                                          product.price,
                                          product.shipping_amount
                                        )
                                      }
                                      disabled={
                                        loadingStates[product.id] ===
                                        "Adding..."
                                      }
                                      className="btn-primary w-100 btn-main-pricing"
                                    >
                                      {loadingStates[product.id] ===
                                      "Added to Cart" ? (
                                        <>
                                          Added to Cart <FaCheckCircle />
                                        </>
                                      ) : loadingStates[product.id] ===
                                        "Adding..." ? (
                                        <>
                                          Adding to Cart{" "}
                                          <FaSpinner className="fas fa-spin" />
                                        </>
                                      ) : (
                                        <>
                                          {loadingStates[product.id] ||
                                            "Add to Cart"}{" "}
                                          <FaShoppingCart />
                                        </>
                                      )}
                                    </button>
                                  </div>
                                </ul>
                              </div>
                            ) : (
                              <button
                                onClick={() =>
                                  handleAddToCart(
                                    product.id,
                                    product.price,
                                    product.shipping_amount
                                  )
                                }
                                disabled={
                                  loadingStates[product.id] === "Adding..."
                                }
                                className="btn-primary me-1 mb-1 btn-main-pricing"
                              >
                                {loadingStates[product.id] ===
                                "Added to Cart" ? (
                                  <>
                                    Added to Cart <FaCheckCircle />
                                  </>
                                ) : loadingStates[product.id] ===
                                  "Adding..." ? (
                                  <>
                                    Adding to Cart{" "}
                                    <FaSpinner className="fas fa-spin" />
                                  </>
                                ) : (
                                  <>
                                    {loadingStates[product.id] || "Add to Cart"}{" "}
                                    <FaShoppingCart />
                                  </>
                                )}
                              </button>
                            )}

                            <button
                              onClick={() => handleAddToWishlist(product.id)}
                              className="btn"
                              aria-label="Add to wishlist"
                            >
                              <svg
                                width="18"
                                height="15"
                                viewBox="0 0 18 15"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M14.3704 0.189733C11.8978 -0.584476 10.0383 1.20594 9.3527 2.05295C8.64327 1.20594 6.78266 -0.584379 4.33501 0.189733C2.45051 0.794736 1.10435 2.41595 0.88333 4.35191C0.638564 6.74733 1.86239 10.5229 9.15664 14.9518C9.20541 14.9764 9.27903 15 9.35265 15C9.42627 15 9.47503 14.9754 9.54865 14.9518C16.8429 10.4995 18.0905 6.72376 17.822 4.35191C17.6011 2.43954 16.255 0.794736 14.3704 0.189733Z"
                                  fill="black"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Pagination */}
              <nav className="d-flex justify-content-center align-items-center gap-2 flex-wrap">
                <button
                  className="btn btn-outline-primary"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>

                <div className="d-flex gap-1 flex-wrap justify-content-center">
                  {pageNumbers.map((number) => (
                    <button
                      key={number}
                      className={`btn ${
                        currentPage === number
                          ? "btn-primary"
                          : "btn-outline-primary"
                      }`}
                      onClick={() => setCurrentPage(number)}
                    >
                      {number}
                    </button>
                  ))}
                </div>

                <button
                  className="btn btn-outline-primary"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </nav>

              <div className="text-center mt-4">
                <p className="text-muted">
                  Page <b>{currentPage}</b> of <b>{totalPages}</b>
                </p>
                {totalPages > 1 && (
                  <p className="text-muted">
                    Showing <b>{itemsPerPage}</b> of <b>{products?.length}</b>{" "}
                    records
                  </p>
                )}
              </div>
            </div>
          </main>

          {/* Pricing Plans Section */}
          <section
            className="price_plan_area section_padding_130_80"
            id="pricing"
          >
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-12 col-sm-8 mb-4">
                  <div className="section-heading text-center">
                    <h6>Pricing Plans</h6>
                    <h3>Choose Your Perfect Plan</h3>
                    <p>
                      Select the plan that best fits your needs and start
                      selling today.
                    </p>
                  </div>
                </div>
              </div>

              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 justify-content-center">
                {/* Basic Plan */}
                <div className="col">
                  <div className="single_price_plan h-100">
                    <div className="title">
                      <h3>Basic</h3>
                      <p>For Individual Shoppers</p>
                    </div>
                    <div className="price">
                      <h4>Free</h4>
                    </div>
                    <div className="description">
                      <p>
                        <i className="fas fa-check"></i> Basic Product Access
                      </p>
                      <p>
                        <i className="fas fa-check"></i> Standard Shipping
                      </p>
                      <p>
                        <i className="fas fa-times"></i> Priority Support
                      </p>
                      <p>
                        <i className="fas fa-times"></i> Exclusive Deals
                      </p>
                      <p>
                        <i className="fas fa-times"></i> Premium Products
                      </p>
                    </div>
                    <div className="button">
                      <Link className="btn-main-pricing" to="/register">
                        Get Started
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Premium Plan */}
                <div className="col">
                  <div className="single_price_plan active h-100">
                    <div className="side-shape"></div>
                    <div className="title">
                      <span>Popular</span>
                      <h3>Premium</h3>
                      <p>For Regular Shoppers</p>
                    </div>
                    <div className="price">
                      <h4>$9.99</h4>
                    </div>
                    <div className="description">
                      <p>
                        <i className="fas fa-check"></i> All Basic Features
                      </p>
                      <p>
                        <i className="fas fa-check"></i> Priority Shipping
                      </p>
                      <p>
                        <i className="fas fa-check"></i> 24/7 Support
                      </p>
                      <p>
                        <i className="fas fa-check"></i> Exclusive Deals
                      </p>
                      <p>
                        <i className="fas fa-times"></i> Premium Products
                      </p>
                    </div>
                    <div className="button">
                      <Link className="btn-main-pricing" to="/register">
                        Get Started
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Enterprise Plan */}
                <div className="col">
                  <div className="single_price_plan h-100">
                    <div className="title">
                      <h3>Enterprise</h3>
                      <p>For Business Customers</p>
                    </div>
                    <div className="price">
                      <h4>$49.99</h4>
                    </div>
                    <div className="description">
                      <p>
                        <i className="fas fa-check"></i> All Premium Features
                      </p>
                      <p>
                        <i className="fas fa-check"></i> Express Shipping
                      </p>
                      <p>
                        <i className="fas fa-check"></i> Dedicated Support
                      </p>
                      <p>
                        <i className="fas fa-check"></i> VIP Deals
                      </p>
                      <p>
                        <i className="fas fa-check"></i> Premium Products
                      </p>
                    </div>
                    <div className="button">
                      <Link className="btn-main-pricing" to="/register">
                        Get Started
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      ) : (
        <div className="container text-center py-5">
          <img
            className="img-fluid"
            src="https://cdn.dribbble.com/users/2046015/screenshots/5973727/06-loader_telega.gif"
            alt="Loading..."
          />
        </div>
      )}
    </>
  );
}

export default Products;
