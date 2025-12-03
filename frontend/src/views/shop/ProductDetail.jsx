import { useContext, useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";

import apiInstance from "../../utils/axios";
import Addon from "../plugin/Addon";
import GetCurrentAddress from "../plugin/UserCountry";
import UserData from "../plugin/UserData";
import CartID from "../plugin/cartID";
import { addToCart } from "../plugin/addToCart";
import { addToWishlist } from "../plugin/addToWishlist";
import { CartContext } from "../plugin/Context";
import moment from "moment";
import Swal from "sweetalert2";

function ProductDetail() {
  const [product, setProduct] = useState(null);
  const [productImage, setProductImage] = useState("");
  const [gallery, setGallery] = useState([]);
  const [specifications, setSpecifications] = useState([]);
  const [color, setColor] = useState([]);
  const [size, setSize] = useState([]);
  const [vendor, setVendor] = useState(null);

  const [colorValue, setColorValue] = useState("No Color");
  const [sizeValue, setSizeValue] = useState("No Size");
  const [qtyValue, setQtyValue] = useState(1);
  const { updateCartCount } = useContext(CartContext);

  const [isAddingToCart, setIsAddingToCart] = useState("Add To Cart");
  const [loading, setLoading] = useState(true);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const [createReview, setCreateReview] = useState({
    rating: "",
    review: "",
  });
  const [reviews, setReviews] = useState([]);

  const axios = apiInstance;
  const params = useParams();
  const addon = Addon();
  const currentAddress = GetCurrentAddress();
  const userData = UserData();
  const cart_id = CartID();

  // Fetch product data
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    axios
      .get("products/" + params.slug)
      .then((res) => {
        if (!isMounted) return;
        setProduct(res.data);
        setProductImage(res.data.image || "");
        setGallery(res.data.gallery || []);
        setSpecifications(res.data.specification || []);
        setColor(res.data.color || []);
        setSize(res.data.size || []);
        setVendor(res.data.vendor || null);
      })
      .catch(() => {
        // Handle error
        setProduct(null);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.slug]);

  // Handler for color selection
  const handleColorButtonClick = (event) => {
    // This function expects the dom structure, but let's make it more robust:
    const btn = event.currentTarget;
    const wrapper = btn.closest(".color_button_wrapper");
    if (!wrapper) return;
    const colorNameInput = wrapper.querySelector(".color_name");
    const colorImageInput = wrapper.querySelector(".color_image");

    const colorName = colorNameInput ? colorNameInput.value : "";
    const colorImage = colorImageInput ? colorImageInput.value : "";

    setColorValue(colorName || "No Color");
    setProductImage(colorImage || product?.image || "");
  };

  // Handler for size selection
  const handleSizeButtonClick = (event) => {
    const btn = event.currentTarget;
    const wrapper = btn.closest(".size_button_wrapper");
    if (!wrapper) return;
    const sizeNameInput = wrapper.querySelector(".size_name");
    const sizeName = sizeNameInput ? sizeNameInput.value : "";
    setSizeValue(sizeName || "No Size");
  };

  // Handler for quantity change
  const handleQuantityChange = (event) => {
    const value = Math.max(1, Number(event.target.value) || 1);
    setQtyValue(value);
  };

  // Handler for adding to cart
  const handleAddToCart = useCallback(async () => {
    if (!product || !userData) return;
    setIsAddingToCart("Processing...");
    try {
      await addToCart(
        product.id,
        userData?.user_id,
        qtyValue,
        product.price,
        product.shipping_amount,
        currentAddress?.country || "",
        sizeValue,
        colorValue,
        cart_id,
        setIsAddingToCart
      );
      const cartListUrl = userData?.user_id
        ? `cart-list/${cart_id}/${userData?.user_id}/`
        : `cart-list/${cart_id}/`;
      const response = await axios.get(cartListUrl);
      updateCartCount(response.data?.length || 0);
      Swal.fire({
        icon: "success",
        title: "Added To Cart",
      });
      setIsAddingToCart("Added To Cart");
    } catch (error) {
      setIsAddingToCart("An Error Occured");
      console.error("Error adding to cart:", error);
      Swal.fire({
        icon: "error",
        title: "Error Adding to Cart",
        text: error?.message || "Could not add item to cart.",
      });
    } finally {
      setTimeout(() => setIsAddingToCart("Add To Cart"), 1100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    product,
    userData,
    qtyValue,
    currentAddress,
    sizeValue,
    colorValue,
    cart_id,
    updateCartCount,
    axios,
  ]);

  // Handler for adding to wishlist
  const handleAddToWishlist = async () => {
    if (!userData || !product) return;
    setWishlistLoading(true);
    try {
      await addToWishlist(product.id, userData.user_id);
      Swal.fire({
        icon: "success",
        title: "Added to Wishlist",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error Adding to Wishlist",
        text: error?.message || "Could not add item to wishlist.",
      });
    } finally {
      setWishlistLoading(false);
    }
  };

  // Handler for review change
  const handleReviewChange = (event) => {
    const { name, value } = event.target;
    setCreateReview((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Fetch reviews for this product
  const fetchReviewData = useCallback(async () => {
    if (!product?.id) return;
    try {
      const res = await axios.get(`reviews/${product.id}/`);
      setReviews(res.data || []);
    } catch (error) {
      setReviews([]);
      // Log error if needed
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id]);

  useEffect(() => {
    fetchReviewData();
  }, [fetchReviewData]);

  // Handler for review submit
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!userData || !product) {
      Swal.fire({
        icon: "warning",
        title: "You must be logged in to submit a review",
      });
      return;
    }

    if (!createReview.rating || !createReview.review.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Please fill out all fields",
      });
      return;
    }

    const formData = new FormData();
    formData.append("user_id", userData.user_id);
    formData.append("product_id", product.id);
    formData.append("rating", createReview.rating);
    formData.append("review", createReview.review);

    try {
      await axios.post(`create-review/`, formData);
      await fetchReviewData();
      setCreateReview({ rating: "", review: "" });
      Swal.fire({
        icon: "success",
        title: "Review created successfully",
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Could not submit review",
      });
    }
  };

  return (
    <div>
      <main className="mb-4 mt-4">
        {!loading && product && (
          <div className="container">
            {/* Section: Product details */}
            <section className="mb-9">
              <div className="row gx-lg-5">
                <div className="col-md-6 mb-4 mb-md-0">
                  {/* Gallery */}
                  <div>
                    <div className="row gx-2 gx-lg-3">
                      <div className="col-12 col-lg-12">
                        <div className="lightbox">
                          <img
                            src={productImage}
                            style={{
                              width: "100%",
                              height: 500,
                              objectFit: "cover",
                              borderRadius: 10,
                            }}
                            alt={product?.title || ""}
                            className="ecommerce-gallery-main-img active w-100 rounded-4 main-image-div"
                            onError={(e) => {
                              const img = e.target;
                              const currentSrc = img.src;

                              // Try multiple fallback strategies
                              if (currentSrc) {
                                // Strategy 1: If from media/, try static/
                                if (
                                  currentSrc.includes("/media/") &&
                                  !currentSrc.includes("/static/") &&
                                  !img.dataset.triedStatic
                                ) {
                                  img.dataset.triedStatic = "true";
                                  const staticSrc = currentSrc.replace("/media/", "/static/");
                                  img.src = staticSrc;
                                  return;
                                }
                                
                                // Strategy 2: If from static/, try media/
                                if (
                                  currentSrc.includes("/static/") &&
                                  !currentSrc.includes("/media/") &&
                                  !img.dataset.triedMedia
                                ) {
                                  img.dataset.triedMedia = "true";
                                  const mediaSrc = currentSrc.replace("/static/", "/media/");
                                  img.src = mediaSrc;
                                  return;
                                }
                              }

                              // Final fallback to placeholder if all strategies fail
                              img.src =
                                "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 d-flex">
                      {gallery?.map((g, index) => (
                        <div className="p-3" key={index}>
                          <img
                            src={g.image}
                            onError={(e) => {
                              const img = e.target;
                              const currentSrc = img.src;

                              // Try multiple fallback strategies
                              if (currentSrc) {
                                // Strategy 1: If from media/, try static/
                                if (
                                  currentSrc.includes("/media/") &&
                                  !currentSrc.includes("/static/") &&
                                  !img.dataset.triedStatic
                                ) {
                                  img.dataset.triedStatic = "true";
                                  const staticSrc = currentSrc.replace("/media/", "/static/");
                                  img.src = staticSrc;
                                  return;
                                }
                                
                                // Strategy 2: If from static/, try media/
                                if (
                                  currentSrc.includes("/static/") &&
                                  !currentSrc.includes("/media/") &&
                                  !img.dataset.triedMedia
                                ) {
                                  img.dataset.triedMedia = "true";
                                  const mediaSrc = currentSrc.replace("/static/", "/media/");
                                  img.src = mediaSrc;
                                  return;
                                }
                              }

                              // Final fallback to placeholder if all strategies fail
                              img.src =
                                "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";
                            }}
                            style={{
                              width: "100px",
                              height: "100px",
                              objectFit: "cover",
                              borderRadius: "10px",
                            }}
                            alt="Gallery"
                            className="ecommerce-gallery-main-img active rounded-4"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Gallery */}
                </div>
                <div className="col-md-6 mb-4 mb-md-0 text-start">
                  {/* Details */}
                  <div>
                    <h1 className="fw-bold mb-3">{product.title}</h1>
                    <div className="d-flex text-primary just align-items-center">
                      <ul
                        className="mb-3 d-flex p-0"
                        style={{ listStyle: "none" }}
                      >
                        {/* Star rendering can likely be simplified but preserve logic */}
                        {[1, 2, 3, 4, 5].map((star) =>
                          product.product_rating &&
                          product.product_rating >= star ? (
                            <li key={star}>
                              <i className="fas fa-star fa-sm text-warning ps-0" />
                            </li>
                          ) : null
                        )}
                        <li style={{ marginLeft: 10, fontSize: 13 }}>
                          <span className="text-decoration-none align-middle">
                            {product.product_rating !== null &&
                            product.product_rating !== undefined ? (
                              <>
                                <strong className="me-2 text-dark">
                                  {Number(product.product_rating).toFixed(1)}
                                  /5.0
                                </strong>
                                ({product?.rating_count || 0} reviews)
                              </>
                            ) : (
                              <>
                                <strong className="me-2 text-dark">
                                  Not Rated Yet
                                </strong>
                                (0 reviews)
                              </>
                            )}
                          </span>
                        </li>
                      </ul>
                    </div>
                    <h5 className="mb-3">
                      {product.old_price && (
                        <s className="text-muted me-2 small align-middle">
                          {addon?.currency_sign}
                          {product.old_price}
                        </s>
                      )}
                      <span className="align-middle">
                        {addon?.currency_sign}
                        {product?.price}
                      </span>
                      {typeof product.get_precentage !== "undefined" && (
                        <span
                          className="align-middle text-muted"
                          style={{ fontSize: "13px", fontStyle: "italic" }}
                        >
                          ({product.get_precentage}% OFF)
                        </span>
                      )}
                    </h5>
                    <p className="text-muted">
                      {product.description?.slice(0, 300)}
                    </p>
                    <div className="table-responsive">
                      <table className="table table-sm table-borderless mb-0">
                        <tbody>
                          {specifications?.map((s, index) => (
                            <tr key={index}>
                              <th className="ps-0 w-25" scope="row">
                                <strong>{s.title}</strong>
                              </th>
                              <td>{s.content}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <hr className="" />
                    <div>
                      <div className="row flex-column">
                        {/* Quantity */}
                        <div className="col-md-6 mb-4">
                          <div className="form-outline">
                            <label className="form-label" htmlFor="typeNumber">
                              <b>Quantity</b>
                            </label>
                            <input
                              type="number"
                              id="typeNumber"
                              className="form-control quantity"
                              min={1}
                              value={qtyValue}
                              onChange={handleQuantityChange}
                            />
                          </div>
                        </div>
                        {/* Size */}
                        {size?.length > 0 ? (
                          <div className="col-md-6 mb-4">
                            <div className="form-outline">
                              <label
                                className="form-label"
                                htmlFor="typeNumber"
                              >
                                <b>Size:</b> {sizeValue}
                              </label>
                            </div>
                            <div className="d-flex">
                              {size?.map((s, index) => (
                                <div
                                  key={index}
                                  className="me-2 size_button_wrapper"
                                >
                                  <input
                                    type="hidden"
                                    className="size_name"
                                    value={s.name || ""}
                                  />
                                  <button
                                    type="button"
                                    onClick={handleSizeButtonClick}
                                    className="btn btn-secondary size_button"
                                  >
                                    {s.name}
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div></div>
                        )}
                        {/* Colors */}
                        {color?.length > 0 ? (
                          <div className="col-md-6 mb-4">
                            <div className="form-outline">
                              <label
                                className="form-label"
                                htmlFor="colorOptions"
                              >
                                <b>Color:</b> <span>{colorValue}</span>
                              </label>
                            </div>
                            <div className="d-flex">
                              {color?.map((c, index) => (
                                <div
                                  key={index}
                                  className="color_button_wrapper"
                                >
                                  <input
                                    type="hidden"
                                    className="color_name"
                                    value={c.name || ""}
                                  />
                                  <input
                                    type="hidden"
                                    className="color_image"
                                    value={c.image || ""}
                                  />
                                  <button
                                    type="button"
                                    className="btn p-3 me-2 color_button"
                                    onClick={handleColorButtonClick}
                                    style={{
                                      backgroundColor: c.color_code || "#000",
                                      border:
                                        colorValue === c.name
                                          ? "2px solid #555"
                                          : "",
                                    }}
                                  ></button>
                                </div>
                              ))}
                            </div>
                            <hr />
                          </div>
                        ) : (
                          <div></div>
                        )}
                      </div>
                      <button
                        onClick={handleAddToCart}
                        type="button"
                        className="btn-main-pricing me-1 mb-1 p-0"
                        disabled={isAddingToCart === "Processing..."}
                      >
                        {isAddingToCart === "Add To Cart" && (
                          <i className="fas fa-cart-plus me-2" />
                        )}
                        {isAddingToCart === "Processing..." && (
                          <i className="fas fa-spinner fa-spin me-2" />
                        )}
                        {isAddingToCart === "Added To Cart" && (
                          <i className="fas fa-check-circle me-2" />
                        )}
                        {isAddingToCart === "An Error Occured" && (
                          <i className="fas fa-check-circle me-2" />
                        )}
                        {isAddingToCart}
                      </button>
                      <button
                        onClick={handleAddToWishlist}
                        className="btn"
                        data-mdb-toggle="tooltip"
                        title="Add to wishlist"
                        disabled={wishlistLoading}
                      >
                        <i className="fas fa-heart" />
                      </button>
                    </div>
                  </div>
                  {/* Details */}
                </div>
              </div>
            </section>
            {/* Section: Product details */}
            <hr />
            <ul
              className="nav nav-pills mb-3 gap-4"
              id="pills-tab"
              role="tablist"
            >
              <li className="nav-item" role="presentation">
                <button
                  className="btn-main-pricing color_button_new"
                  id="pills-home-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-home"
                  type="button"
                  role="tab"
                  aria-controls="pills-home"
                  aria-selected="true"
                >
                  Specifications
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="btn-main-pricing color_button_new"
                  id="pills-profile-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-profile"
                  type="button"
                  role="tab"
                  aria-controls="pills-profile"
                  aria-selected="false"
                >
                  Vendor
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="btn-main-pricing color_button_new"
                  id="pills-contact-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-contact"
                  type="button"
                  role="tab"
                  aria-controls="pills-contact"
                  aria-selected="false"
                >
                  Review
                </button>
              </li>
              {/* <li className="nav-item" role="presentation">
                                <button
                                    className="nav-link"
                                    id="pills-disabled-tab"
                                    data-bs-toggle="pill"
                                    data-bs-target="#pills-disabled"
                                    type="button"
                                    role="tab"
                                    aria-controls="pills-disabled"
                                    aria-selected="false"
                                >
                                    Question &amp; Answer
                                </button>
                            </li> */}
            </ul>
            <div className="tab-content" id="pills-tabContent">
              <div
                className="tab-pane fade show active"
                id="pills-home"
                role="tabpanel"
                aria-labelledby="pills-home-tab"
                tabIndex={0}
              >
                <div className="table-responsive">
                  <table className="table table-sm table-borderless mb-0 text-start">
                    <tbody>
                      {specifications?.map((s, index) => (
                        <tr key={index}>
                          <th className="ps-0 w-25" scope="row">
                            <strong>{s.title}</strong>
                          </th>
                          <td>{s.content}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div
                className="tab-pane fade"
                id="pills-profile"
                role="tabpanel"
                aria-labelledby="pills-profile-tab"
                tabIndex={0}
              >
                <div className="card mb-3" style={{ maxWidth: 400 }}>
                  <div className="row g-0">
                    <div className="col-md-4">
                      <img
                        src={vendor?.image}
                        style={{
                          height: "100%",
                          width: "100%",
                          objectFit: "cover",
                        }}
                        alt="User Image"
                        className="img-fluid"
                      />
                    </div>
                    <div className="col-md-8">
                      <div className="card-body">
                        <h5 className="card-title">{vendor?.name}</h5>
                        <p className="card-text">{vendor?.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="tab-pane fade"
                id="pills-contact"
                role="tabpanel"
                aria-labelledby="pills-contact-tab"
                tabIndex={0}
              >
                <div className="container mt-5 text-start">
                  <div className="row">
                    {/* Column 1: Form to create a new review */}
                    <div className="col-md-6">
                      <h2>Create a New Review</h2>
                      <form method="POST" onSubmit={handleReviewSubmit}>
                        <div className="mb-3">
                          <label htmlFor="rating" className="form-label">
                            Rating
                          </label>
                          <select
                            onChange={handleReviewChange}
                            name="rating"
                            className="form-select"
                            id="rating"
                            value={createReview.rating}
                          >
                            <option value="">Select Rating</option>
                            <option value="1">★</option>
                            <option value="2">★★</option>
                            <option value="3">★★★</option>
                            <option value="4">★★★★</option>
                            <option value="5">★★★★★</option>
                          </select>
                        </div>
                        <div className="mb-3">
                          <label htmlFor="reviewText" className="form-label">
                            Review
                          </label>
                          <textarea
                            className="form-control"
                            rows={4}
                            placeholder="Write your review"
                            onChange={handleReviewChange}
                            name="review"
                            id="reviewText"
                            value={createReview.review}
                          />
                        </div>
                        <button
                          type="submit"
                          className="btn-main-pricing"
                          disabled={loading}
                        >
                          Submit Review
                        </button>
                      </form>
                    </div>
                    {/* Column 2: Display existing reviews */}
                    <div className="col-md-6">
                      {reviews.length > 0 ? (
                        <>
                          <h2>All Reviews</h2>
                          {reviews.map((review) => (
                            <div
                              key={review.id}
                              className="card mb-3 rounded-3"
                            >
                              <div className="row g-0">
                                <div className="col-md-3">
                                  <img
                                    src={review.profile?.image}
                                    alt="User"
                                    className="img-fluid"
                                  />
                                </div>
                                <div className="col-md-9">
                                  <div className="card-body">
                                    <h5 className="card-title">
                                      {review.profile?.full_name}
                                    </h5>
                                    <p className="card-text">
                                      {moment(review.date).format("MM/DD/YYYY")}
                                    </p>
                                    <p className="card-text">{review.review}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </>
                      ) : (
                        <h2>No Reviews Yet</h2>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {/* Hide unused Q&A panel, if needed it can be included */}
            </div>
          </div>
        )}

        {loading && (
          <div className="container text-center">
            <img src="/assets/images/loading.gif" alt="Loading..." />
          </div>
        )}
      </main>
    </div>
  );
}

export default ProductDetail;
