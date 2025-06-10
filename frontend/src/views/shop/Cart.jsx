import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { addToCart } from "../plugin/addToCart";
import apiInstance from "../../utils/axios";
import GetCurrentAddress from "../plugin/UserCountry";
import UserData from "../plugin/UserData";
import CartID from "../plugin/cartID";
import { CartContext } from "../plugin/Context";

function Cart() {
  const [cart, setCart] = useState([]);
  const [cartTotal, setCartTotal] = useState({});
  const [productQuantities, setProductQuantities] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToCart] = useState("");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const { updateCartCount } = useContext(CartContext);

  const axios = apiInstance;
  const userData = UserData();
  let cart_id = CartID();
  const currentAddress = GetCurrentAddress();
  let navigate = useNavigate();

  // Get cart Items
  const fetchCartData = async (cartId, userId) => {
    try {
      const url = userId
        ? `cart-list/${cartId}/${userId}/`
        : `cart-list/${cartId}/`;

      const response = await axios.get(url);
      console.log("Cart data:", response.data); // Debug log
      // Filter out items with qty 0
      const filteredCart = response.data.filter((item) => item.qty > 0);
      setCart(filteredCart);
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };

  // Get Cart Totals
  const fetchCartTotal = async (cartId, userId) => {
    try {
      const url = userId
        ? `cart-detail/${cartId}/${userId}/`
        : `cart-detail/${cartId}/`;
      const response = await axios.get(url);
      setCartTotal(response.data);
    } catch (error) {
      console.error("Error fetching cart total:", error);
    }
  };

  // Combined fetch function
  const fetchCartDataAndTotal = async (cartId, userId) => {
    if (!cartId) return;

    setIsLoading(true);
    try {
      await Promise.all([
        fetchCartData(cartId, userId),
        fetchCartTotal(cartId, userId),
      ]);
    } catch (error) {
      console.error("Error fetching cart data and total:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!cart_id) {
      navigate("/");
      return;
    }

    fetchCartDataAndTotal(cart_id, userData?.user_id);
  }, [cart_id, userData?.user_id]);

  useEffect(() => {
    const initialQuantities = {};
    cart.forEach((c) => {
      initialQuantities[c.product.id] = c.qty;
    });
    setProductQuantities(initialQuantities);
  }, [cart]);

  const handleQtyChange = (event, product_id) => {
    const quantity = Math.max(1, parseInt(event.target.value) || 1); // Ensure minimum value of 1
    setProductQuantities((prevQuantities) => ({
      ...prevQuantities,
      [product_id]: quantity,
    }));
  };

  const UpdateCart = async (
    cart_id,
    item_id,
    product_id,
    price,
    shipping_amount,
    color,
    size
  ) => {
    const qtyValue = productQuantities[product_id];

    if (qtyValue < 1) {
      Swal.fire({
        icon: "error",
        title: "Invalid Quantity",
        text: "Quantity must be at least 1",
      });
      return;
    }

    try {
      setIsLoading(true);
      await addToCart(
        product_id,
        userData?.user_id,
        qtyValue,
        price,
        shipping_amount,
        currentAddress.country,
        color,
        size,
        cart_id,
        isAddingToCart
      );

      await fetchCartDataAndTotal(cart_id, userData?.user_id);
    } catch (error) {
      console.error("Error updating cart:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update cart. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Add this new function to clean up invalid cart items
  const cleanupInvalidCartItems = async () => {
    try {
      // Force refresh cart data
      await fetchCartDataAndTotal(cart_id, userData?.user_id);
      // Update cart count
      await updateCartCount();
    } catch (error) {
      console.error("Error cleaning up cart:", error);
    }
  };

  // Add clear cart function
  const handleClearCart = async () => {
    try {
      setIsLoading(true);

      // Show confirmation dialog
      const result = await Swal.fire({
        title: "Clear Cart?",
        text: "Are you sure you want to remove all items from your cart?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, clear cart!",
      });

      if (result.isConfirmed) {
        // Remove all items from local state immediately
        setCart([]);

        // Delete all cart items from backend
        const url = userData?.user_id
          ? `cart-delete-all/${cart_id}/${userData.user_id}/`
          : `cart-delete-all/${cart_id}/`;

        try {
          await axios.delete(url);
          await cleanupInvalidCartItems();

          Swal.fire({
            icon: "success",
            title: "Cart Cleared",
            text: "All items have been removed from your cart.",
          });
        } catch (error) {
          console.error("Error clearing cart:", error);
          // Even if the backend call fails, we've already cleared the local state
          await cleanupInvalidCartItems();

          Swal.fire({
            icon: "info",
            title: "Cart Cleared",
            text: "All items have been removed from your cart.",
          });
        }
      }
    } catch (error) {
      console.error("Error in clear cart:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to clear cart. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = async (cartId, itemId) => {
    try {
      setIsLoading(true);

      // Debug logs to check the values
      console.log("Cart ID:", cartId);
      console.log("Item ID:", itemId);
      console.log("User ID:", userData?.user_id);

      // Remove the item from the local cart state immediately
      setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));

      // Construct the URL based on whether user is logged in
      const url = userData?.user_id
        ? `cart-delete/${cartId}/${itemId}/${userData.user_id}/`
        : `cart-delete/${cartId}/${itemId}/`;

      console.log("Deleting cart item with URL:", url);

      try {
        const response = await axios.delete(url);
        if (response.status === 200 || response.status === 204) {
          // Refresh cart data and total
          await cleanupInvalidCartItems();

          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Item removed from cart successfully",
          });
        }
      } catch (error) {
        if (error.response?.status === 404) {
          // If the item is not found, it might have been already deleted
          // Just refresh the cart data
          await cleanupInvalidCartItems();

          Swal.fire({
            icon: "info",
            title: "Item Removed",
            text: "Item was already removed from cart.",
          });
        } else {
          throw error; // Re-throw other errors
        }
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      let errorMessage = "Failed to remove item. Please try again.";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Add cleanup on component mount
  useEffect(() => {
    if (cart_id) {
      cleanupInvalidCartItems();
    }
  }, [cart_id]);

  // Shipping Details
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Use computed property names to dynamically set the state based on input name
    switch (name) {
      case "fullName":
        setFullName(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "mobile":
        setMobile(value);
        break;
      case "address":
        setAddress(value);
        break;
      case "city":
        setCity(value);
        break;
      case "state":
        setState(value);
        break;
      case "country":
        setCountry(value);
        break;
      default:
        break;
    }
  };

  const createCartOrder = async () => {
    if (
      !fullName ||
      !email ||
      !mobile ||
      !address ||
      !city ||
      !state ||
      !country
    ) {
      // If any required field is missing, show an error message or take appropriate action
      console.log("Please fill in all required fields");
      Swal.fire({
        icon: "warning",
        title: "Missing Fields!",
        text: "All fields are required before checkout",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("full_name", fullName);
      formData.append("email", email);
      formData.append("mobile", mobile);
      formData.append("address", address);
      formData.append("city", city);
      formData.append("state", state);
      formData.append("country", country);
      formData.append("cart_id", cart_id);
      formData.append("user_id", userData ? userData.user_id : 0);

      const response = await axios.post("create-order/", formData);
      console.log(response.data.order_oid);

      navigate(`/checkout/${response.data.order_oid}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <main className="mt-5">
        <div className="container">
          {/*Main layout*/}
          <main className="mb-6">
            <div className="container">
              {/* Section: Cart */}
              <section className="">
                <div className="row gx-lg-5 mb-5">
                  <div className="col-lg-8 mb-4 mb-md-0 text-start">
                    {/* Section: Product list */}
                    <section className="mb-5">
                      {cart.map((c) => (
                        <div key={c.id} className="row border-bottom mb-4">
                          <div className="col-md-2 mb-4 mb-md-0 text-start">
                            <div
                              className="bg-image ripple rounded-5 mb-4 overflow-hidden d-block"
                              data-ripple-color="light"
                            >
                              <Link to={`/detail/${c?.product?.slug}`}>
                                <img
                                  src={c?.product?.image}
                                  className="w-100"
                                  alt=""
                                  style={{
                                    height: "100px",
                                    objectFit: "cover",
                                    borderRadius: "10px",
                                  }}
                                />
                              </Link>
                              <a href="#!">
                                <div className="hover-overlay">
                                  <div
                                    className="mask"
                                    style={{
                                      backgroundColor:
                                        "hsla(0, 0%, 98.4%, 0.2)",
                                    }}
                                  />
                                </div>
                              </a>
                            </div>
                          </div>
                          <div className="col-md-8 mb-4 mb-md-0 text-start">
                            <Link
                              to={`/detail/${c.product.slug}`}
                              className="fw-bold text-dark mb-4"
                            >
                              {c?.product?.title.slice(0, 20)}
                            </Link>
                            {c.size != "No Size" && (
                              <p className="mb-0">
                                <span className="text-muted me-2">Size:</span>
                                <span>{c.size}</span>
                              </p>
                            )}
                            {c.color != "No Color" && (
                              <p className="mb-0">
                                <span className="text-muted me-2">Color:</span>
                                <span>{c.color}</span>
                              </p>
                            )}
                            <p className="mb-0">
                              <span className="text-muted me-2">Price:</span>
                              <span>${c.product.price}</span>
                            </p>
                            <p className="mb-0">
                              <span className="text-muted me-2">
                                Stock Qty:
                              </span>
                              <span>{c.product.stock_qty}</span>
                            </p>
                            <p className="mb-0">
                              <span className="text-muted me-2">Vendor:</span>
                              <span>{c.product.vendor.name}</span>
                            </p>
                            <p className="mt-3">
                              <button
                                onClick={() => handleDeleteClick(cart_id, c.id)}
                                className="btn-main-pricing "
                              >
                                <small>
                                  <i className="fas fa-trash me-2" />
                                  Remove
                                </small>
                              </button>
                            </p>
                          </div>
                          <div className="col-md-2 mb-4 mb-md-0 text-start">
                            <div className="d-flex justify-content-center align-items-center">
                              <div className="form-outline cart-input">
                                <input
                                  type="number"
                                  id={`qtyInput-${c.product.id}`}
                                  className="form-control"
                                  onChange={(e) =>
                                    handleQtyChange(e, c.product.id)
                                  }
                                  value={
                                    productQuantities[c.product.id] || c.qty
                                  }
                                  min={1}
                                />
                              </div>
                              <button
                                onClick={() =>
                                  UpdateCart(
                                    cart_id,
                                    c.id,
                                    c.product.id,
                                    c.product.price,
                                    c.product.shipping_amount,
                                    c.color,
                                    c.size
                                  )
                                }
                                className="ms-2 btn"
                              >
                                <i className="fas fa-rotate-right"></i>
                              </button>
                            </div>
                            <h5 className="mb-2 mt-3 text-center">
                              <span className="align-middle">
                                ${c.sub_total}
                              </span>
                            </h5>
                          </div>
                        </div>
                      ))}

                      {cart.length < 1 && (
                        <>
                          <h5>Your Cart Is Empty</h5>
                          <Link to="/">
                            {" "}
                            <i className="fas fa-shopping-cart"></i> Continue
                            Shopping
                          </Link>
                        </>
                      )}
                    </section>
                    <div
                      className="text-start cart-txt"
                      style={{ color: "black", backgroundColor: "white" }}
                    >
                      <h5 className="mb-4 mt-4">Personal Information</h5>
                      {/* 2 column grid layout with text inputs for the first and last names */}
                      <div
                        className="row mb-4"
                        style={{ color: "black", backgroundColor: "white" }}
                      >
                        <div className="col">
                          <div className="form-outline">
                            <label className="form-label" htmlFor="full_name">
                              {" "}
                              <i className="fas fa-user"></i> Full Name
                            </label>
                            <input
                              type="text"
                              id=""
                              name="fullName"
                              className="form-control input text-dark w-100 cart-input"
                              onChange={handleChange}
                              value={fullName}
                              style={{
                                color: "black",
                                backgroundColor: "white",
                                width: "100%",
                                padding: "8px 12px",
                                fontSize: "16px",
                                height: "45px",
                                minWidth: "50px",
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="row mb-4">
                        <div className="col">
                          <div className="form-outline">
                            <label
                              className="form-label"
                              htmlFor="form6Example1"
                            >
                              <i className="fas fa-envelope"></i> Email
                            </label>
                            <input
                              type="text"
                              id="form6Example1"
                              className="form-control input text-dark"
                              name="email"
                              onChange={handleChange}
                              value={email}
                            />
                          </div>
                        </div>
                        <div className="col">
                          <div className="form-outline">
                            <label
                              className="form-label"
                              htmlFor="form6Example1"
                            >
                              <i className="fas fa-phone"></i> Mobile
                            </label>
                            <input
                              type="text"
                              id="form6Example1"
                              className="form-control input text-dark"
                              name="mobile"
                              onChange={handleChange}
                              value={mobile}
                            />
                          </div>
                        </div>
                      </div>

                      <h5 className="mb-1 mt-4">Shipping address</h5>

                      <div className="row mb-4">
                        <div className="col-lg-6 mt-3">
                          <div className="form-outline">
                            <label
                              className="form-label"
                              htmlFor="form6Example1"
                            >
                              {" "}
                              Address
                            </label>
                            <input
                              type="text"
                              id="form6Example1"
                              className="form-control input text-dark"
                              name="address"
                              onChange={handleChange}
                              value={address}
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 mt-3">
                          <div className="form-outline">
                            <label
                              className="form-label"
                              htmlFor="form6Example1"
                            >
                              {" "}
                              City
                            </label>
                            <input
                              type="text"
                              id="form6Example1"
                              className="form-control input text-dark"
                              name="city"
                              onChange={handleChange}
                              value={city}
                            />
                          </div>
                        </div>

                        <div className="col-lg-6 mt-3">
                          <div className="form-outline">
                            <label
                              className="form-label"
                              htmlFor="form6Example1"
                            >
                              {" "}
                              State
                            </label>
                            <input
                              type="text"
                              id="form6Example1"
                              className="form-control input text-dark"
                              name="state"
                              onChange={handleChange}
                              value={state}
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 mt-3">
                          <div className="form-outline">
                            <label
                              className="form-label"
                              htmlFor="form6Example1"
                            >
                              {" "}
                              Country
                            </label>
                            <input
                              type="text"
                              id="form6Example1"
                              className="form-control input text-dark"
                              name="country"
                              onChange={handleChange}
                              value={country}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 mb-4 mb-md-0">
                    {/* Section: Summary */}
                    <section className="shadow-4 p-4 rounded-5 mb-4">
                      <h5 className="mb-3 text-start">Cart Summary</h5>
                      <div className="d-flex justify-content-between mb-3">
                        <span>Subtotal </span>
                        <span>${cartTotal.sub_total?.toFixed(2)}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span>Shipping </span>
                        <span>${cartTotal.shipping?.toFixed(2)}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span>Tax </span>
                        <span>${cartTotal.tax?.toFixed(2)}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span>Servive Fee </span>
                        <span>${cartTotal.service_fee?.toFixed(2)}</span>
                      </div>
                      <hr className="my-4" />
                      <div className="d-flex justify-content-between fw-bold mb-5">
                        <span>Total </span>
                        <span>${cartTotal.total?.toFixed(2)}</span>
                      </div>
                      {cart.length > 0 && (
                        <>
                          <button
                            onClick={createCartOrder}
                            className="btn-main-pricing mb-3 w-100"
                          >
                            Checkout
                          </button>
                          <button
                            onClick={handleClearCart}
                            className="btn-main-pricing w-100"
                          >
                            <i className="fas fa-trash me-2"></i>
                            Clear Cart
                          </button>
                        </>
                      )}
                    </section>
                  </div>
                </div>
              </section>
            </div>
          </main>
        </div>
      </main>
    </div>
  );
}

export default Cart;
