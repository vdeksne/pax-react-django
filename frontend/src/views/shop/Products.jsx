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

  let [setIsAddingToCart] = useState("Add To Cart");
  const [loadingStates, setLoadingStates] = useState({});
  let [loading, setLoading] = useState(true);

  const axios = apiInstance;
  const currentAddress = GetCurrentAddress();
  const userData = UserData();
  let cart_id = CartID();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedColors, setSelectedColors] = useState({});
  const [selectedSize, setSelectedSize] = useState({});
  const [colorImage, setColorImage] = useState("");
  const [colorValue, setColorValue] = useState("No Color");
  const [sizeValue, setSizeValue] = useState("No Size");
  const [qtyValue, setQtyValue] = useState(1);
  const { cartCount, updateCartCount } = useContext(CartContext);

  // Pagination
  // Define the number of items to be displayed per page
  const itemsPerPage = 6;

  // State hook to manage the current page being displayed
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate the index of the last item on the current page
  const indexOfLastItem = currentPage * itemsPerPage;

  // Calculate the index of the first item on the current page
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Extract a subset of items (current page) from the products array
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);

  // Calculate the total number of pages needed based on the total number of items
  const totalPages = Math.ceil(products.length / itemsPerPage);

  // Generate an array of page numbers for pagination control
  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  // Explanation:
  // - `indexOfLastItem` and `indexOfFirstItem` are used to determine the range of items
  //   to be displayed on the current page.
  // - `currentItems` holds the subset of products to be displayed on the current page.
  // - `totalPages` calculates the total number of pages required based on the total number
  //   of items and the specified items per page.
  // - `pageNumbers` is an array containing the page numbers from 1 to the total number of pages.
  //   It's often used for generating pagination controls or navigation.

  // Define an async function for fetching data from an API endpoint and updating the state.
  // This function takes two parameters:
  // - endpoint: The API endpoint to fetch data from.
  // - setDataFunction: The state update function to set the retrieved data.
  async function fetchData(endpoint, setDataFunction) {
    try {
      // Send an HTTP GET request to the provided endpoint using Axios.
      const response = await axios.get(endpoint);

      // If the request is successful, update the state with the retrieved data.
      setDataFunction(response.data);
      if (products) {
        setLoading(false);
      }
    } catch (error) {
      // If an error occurs during the request, log the error to the console.
      console.log(error);
    }
  }

  // Use the useEffect hook to execute code when the component mounts (empty dependency array).
  useEffect(() => {
    // Fetch and set the 'products' data by calling fetchData with the 'products/' endpoint.
    fetchData("products/", setProducts);
  }, []);

  // Use the useEffect hook to execute code when the component mounts (empty dependency array).
  useEffect(() => {
    // Fetch and set the 'products' data by calling fetchData with the 'products/' endpoint.
    fetchData("featured-products/", setFeaturedProducts);
  }, []);

  // Use another useEffect hook to execute code when the component mounts (empty dependency array).
  useEffect(() => {
    // Fetch and set the 'category' data by calling fetchData with the 'category/' endpoint.
    fetchData("category/", setCategory);
  }, []);

  // Fetch and set the 'brand' data by calling fetchData with the 'brand/' endpoint.

  useEffect(() => {
    // Fetch and set the 'category' data by calling fetchData with the 'category/' endpoint.
    fetchData("brand/", setBrand);
  }, []);

  const handleColorButtonClick = (event, product_id, colorName, colorImage) => {
    setColorValue(colorName);
    setColorImage(colorImage);
    setSelectedProduct(product_id);

    setSelectedColors((prevSelectedColors) => ({
      ...prevSelectedColors,
      [product_id]: colorName,
    }));
  };

  const handleSizeButtonClick = (event, product_id, sizeName) => {
    setSizeValue(sizeName);
    setSelectedProduct(product_id);

    setSelectedSize((prevSelectedSize) => ({
      ...prevSelectedSize,
      [product_id]: sizeName,
    }));
  };

  const handleQtyChange = (event, product_id) => {
    setQtyValue(event.target.value);
    setSelectedProduct(product_id);
  };

  const handleAddToCart = async (product_id, price, shipping_amount) => {
    setLoadingStates((prevStates) => ({
      ...prevStates,
      [product_id]: "Adding...",
    }));

    try {
      await addToCart(
        product_id,
        userData?.user_id,
        qtyValue,
        price,
        shipping_amount,
        currentAddress.country,
        colorValue,
        sizeValue,
        cart_id,
        setIsAddingToCart
      );

      // After a successful operation, set the loading state to false
      setLoadingStates((prevStates) => ({
        ...prevStates,
        [product_id]: "Added to Cart",
      }));

      setColorValue("No Color");
      setSizeValue("No Size");
      setQtyValue(0);

      const url = userData?.user_id
        ? `cart-list/${cart_id}/${userData?.user_id}/`
        : `cart-list/${cart_id}/`;
      const response = await axios.get(url);

      updateCartCount(response.data.length);
      console.log(response.data.length);
    } catch (error) {
      console.log(error);

      // In case of an error, set the loading state for the specific product back to "Add to Cart"
      setLoadingStates((prevStates) => ({
        ...prevStates,
        [product_id]: "Add to Cart",
      }));
    }
  };

  const handleAddToWishlist = async (product_id) => {
    try {
      await addToWishlist(product_id, userData?.user_id);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {loading === false && (
        <div>
          <main className="mt-1">
            <div className="container-products">
              <section className="text-center container">
                <div className="position-relative">
                  <video
                    src="/assets/video/desktop.mp4"
                    style={{
                      width: "100%",
                      objectFit: "cover",
                      objectPosition: "center",
                      maxWidth: "100vw",
                      borderRadius: "clamp(1rem, 1rem, 1rem)",
                      aspectRatio: "16/9",
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
                  ></video>

                  <div
                    className="position-absolute top-0 start-0 w-100 d-flex align-items-center justify-content-center"
                    style={{
                      background: "rgba(0,0,0,0.5)",
                      width: "100%",
                      objectFit: "cover",
                      objectPosition: "center",
                      maxWidth: "100vw",
                      borderRadius: "clamp(1rem, 1rem, 1rem)",
                      aspectRatio: "16/8.5", // Slightly taller aspect ratio
                      height: "calc(100% - 8px)", // Add 10px to height
                    }}
                  >
                    <div className="container text-white text-center m-4">
                      <h1 className="display-4">
                        <p className="mb-2">
                          <span>Fuel Creativity. Power Independence.</span>
                        </p>
                        <p className="mb-4">
                          <span>Connect. Collaborate. Create.</span>
                        </p>
                      </h1>

                      <p className="lead mb-5 display-5">
                        <span>
                          Empowering artists and designers to share their work,
                          build their brand, and shape their future.
                        </span>
                      </p>

                      {userData ? (
                        <Link
                          to="/customer/account"
                          className="btn-main"
                          data-ga-category="cta-join"
                          data-ga-c="Click"
                          data-ga-l="start-trial-hero"
                        >
                          Account
                        </Link>
                      ) : (
                        <Link
                          to="/login"
                          className="btn-main"
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
              <div className="d-flex justify-content-center flex-wrap">
                {category.map((c) => (
                  <div
                    key={c.id}
                    className="align-items-center d-flex flex-column"
                    style={{
                      margin: "10px",
                      borderRadius: "10px",
                      padding: "20px",
                      background: "#fff",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                      width: "200px",
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
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                        borderRadius: "50%",
                        marginBottom: "15px",
                      }}
                    />
                    <Link
                      to={`/category/${c.slug}`}
                      className="text-dark text-decoration-none fw-bold"
                      style={{
                        fontSize: "1.1rem",
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
                <div className="row">
                  {currentItems.map((product) => (
                    <div className="col-lg-4 col-md-12 mb-4" key={product.id}>
                      <div className="card">
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
                                width: "100px",
                                height: "300px",
                                objectFit: "cover",
                              }}
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

                          {/* Wishlist Button */}

                          <div className="heart-container">
                            {(product.color && product.color.length > 0) ||
                            (product.size && product.size.length > 0) ? (
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
                                          defaultValue={1}
                                        />
                                      </li>
                                    </div>
                                  </div>

                                  {/* Size */}
                                  {product?.size &&
                                    product?.size.length > 0 && (
                                      <div className="d-flex flex-column">
                                        <li className="p-1">
                                          <b>Size</b>:{" "}
                                          {selectedSize[product.id] ||
                                            "Select a size"}
                                        </li>
                                        <div className="p-1 mt-0 pt-0 d-flex flex-wrap">
                                          {product?.size?.map((size) => (
                                            <li key={size.id}>
                                              <button
                                                className="btn-secondary btn-sm me-2 mb-1"
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
                                  {product.color &&
                                    product.color.length > 0 && (
                                      <div className="d-flex flex-column mt-3">
                                        <li className="p-1 color_name_div">
                                          <b>Color</b>:{" "}
                                          {selectedColors[product.id] ||
                                            "Select a color"}
                                        </li>
                                        <div className="p-1 mt-0 pt-0 d-flex flex-wrap">
                                          {product?.color?.map((color) => (
                                            <li key={color.id}>
                                              <input
                                                type="hidden"
                                                className={`color_name${color.id}`}
                                                name=""
                                                id=""
                                              />
                                              <button
                                                className="color-button p-3 me-2"
                                                style={{
                                                  backgroundColor:
                                                    color.color_code,
                                                }}
                                                onClick={(e) =>
                                                  handleColorButtonClick(
                                                    e,
                                                    product.id,
                                                    color.name,
                                                    color.image
                                                  )
                                                }
                                              ></button>
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
                                      type="button"
                                      className=" btn-primary me-1 mb-1 btn-main-pricing"
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
                                type="button"
                                className=" btn-primary me-1 mb-1 btn-main-pricing"
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
                              type="button"
                              className="btn"
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
              <nav className="d-flex  gap-1 pt-2">
                <ul className="pagination">
                  <li
                    className={`page-item ${
                      currentPage === 1 ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      <i className="ci-arrow-left me-2" />
                      Previous
                    </button>
                  </li>
                </ul>
                <ul className="pagination">
                  {pageNumbers.map((number) => (
                    <li
                      key={number}
                      className={`page-item ${
                        currentPage === number ? "active" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(number)}
                      >
                        {number}
                      </button>
                    </li>
                  ))}
                </ul>

                <ul className="pagination">
                  <li
                    className={`page-item ${
                      currentPage === totalPages ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      Next
                      <i className="ci-arrow-right ms-3" />
                    </button>
                  </li>
                </ul>
              </nav>
              <div>
                <div
                  className="d-blfock mt-5 page-navigation"
                  aria-label="Page navigation"
                >
                  <span className="fs-sm text-muted me-md-3">
                    Page <b>{currentPage} </b> of <b>{totalPages}</b>
                  </span>
                </div>
                {totalPages !== 1 && (
                  <div
                    className="d-block mt-2 page-navigation"
                    aria-label="Page navigation"
                  >
                    <span className="fs-sm text-muted me-md-3">
                      Showing <b>{itemsPerPage}</b> of <b>{products?.length}</b>{" "}
                      records
                    </span>
                  </div>
                )}
              </div>
              {/*Section: Wishlist*/}
            </div>
          </main>

          {/* Pricing Plans Section */}
          <section
            className="price_plan_area section_padding_130_80"
            id="pricing"
          >
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-12 col-sm-8 mb-4 ">
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
              <div className="row justify-content-center">
                {/* Basic Plan */}
                <div className="col-12 col-sm-8 col-md-6 col-lg-4">
                  <div className="single_price_plan">
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
                      <a className="btn-main-pricing" href="/register">
                        Get Started
                      </a>
                    </div>
                  </div>
                </div>

                {/* Premium Plan */}
                <div className="col-12 col-sm-8 col-md-6 col-lg-4">
                  <div className="single_price_plan active">
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
                      <a className="btn-main-pricing" href="/register">
                        Get Started
                      </a>
                    </div>
                  </div>
                </div>

                {/* Enterprise Plan */}
                <div className="col-12 col-sm-8 col-md-6 col-lg-4">
                  <div className="single_price_plan">
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
                      <a className="btn-main-pricing" href="/register">
                        Get Started
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* end of pricing plans section */}

          {/* <main>
            <section className="text-center container">
              <div className="row mt-4 mb-3">
                <div className="col-lg-6 col-md-8 mx-auto">
                  <h1 className="fw-light">Category</h1>
                  <p className="lead text-muted">Our Latest Categories</p>
                </div>
              </div>
            </section>
            <div className="d-flex justify-content-center">
              {category.map((c) => (
                <div
                  key={c.id}
                  className="align-items-center d-flex flex-column"
                  style={{
                    background: "#e8e8e8",
                    marginLeft: "10px",
                    borderRadius: "10px",
                    padding: "30px",
                  }}
                >
                  <img
                    src={c.image}
                    alt=""
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                    }}
                  />
                  <p>
                    <a href="" className="text-dark">
                      {c.title}
                    </a>
                  </p>
                </div>
              ))}
            </div>
            <section className="text-center container mt-5">
              <div className="row py-lg-5">
                <div className="col-lg-6 col-md-8 mx-auto">
                  <h1 className="fw-light">Trending Products</h1>
                  <p className="lead text-muted">
                    Something short and leading about the collection below—its
                    contents
                  </p>
                </div>
              </div>
            </section>
            <div className="album py-5 bg-light">
              <div className="container">
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                  {featuredProducts.map((product) => (
                    <div className="col-lg-4 col-md-12 mb-4" key={product.id}>
                      <div className="card">
                        <div
                          className="bg-image hover-zoom ripple"
                          data-mdb-ripple-color="light"
                        >
                          <img
                            src={product.image}
                            className="w-100"
                            style={{
                              width: "100px",
                              height: "300px",
                              objectFit: "cover",
                            }}
                          />
                        </div>
                        <div className="card-body card-text p-0 ">
                          <a href="" className="text-reset">
                            <h5 className="card-title mb-3 ">
                              {product.title.slice(0, 30)}...
                            </h5>
                          </a>
                          <a href="" className="text-reset">
                            <p>{product?.brand.title}</p>
                          </a>
                          <h6 className="mb-3">
                            {addon.currency_sign}
                            {product.price}
                          </h6>

                          <div className="heart-container">
                            <button
                              type="button"
                              className="btn btn-primary me-1 mb-1 btn-main-pricing"
                            >
                              Add to cart
                            </button>
                            <button
                              type="button"
                              className="btn btn-danger px-3 me-1 mb-1 btn-main-pricing"
                            >
                              <i className="fas fa-heart" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main> */}
        </div>
      )}

      {loading === true && (
        <div className="container text-center">
          <img
            className=""
            src="https://cdn.dribbble.com/users/2046015/screenshots/5973727/06-loader_telega.gif"
            alt=""
          />
        </div>
      )}
    </>
  );
}

export default Products;
