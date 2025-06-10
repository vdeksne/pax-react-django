import apiInstance from "../../utils/axios";
import Swal from "sweetalert2";

const Toast = Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timer: 5000,
  timerProgressBar: true,
});

export const addToCart = async (
  product_id,
  user_id,
  qty,
  price,
  shipping_amount,
  current_address,
  color,
  size,
  cart_id
) => {
  const axios = apiInstance;

  try {
    // Validate required fields
    if (!product_id) throw new Error("Product ID is required");
    if (!qty || qty <= 0) throw new Error("Quantity must be greater than 0");
    if (!price || price <= 0) throw new Error("Price must be greater than 0");
    if (!shipping_amount || shipping_amount < 0)
      throw new Error("Shipping amount must be non-negative");
    if (!current_address) throw new Error("Country is required");
    if (!cart_id) throw new Error("Cart ID is required");

    // Create form data
    const formData = new FormData();
    formData.append("product", product_id.toString());

    // Handle user_id - if undefined or null, send empty string
    const userId = user_id ? user_id.toString() : "";
    formData.append("user", userId);

    formData.append("qty", qty.toString());
    formData.append("price", price.toString());
    formData.append("shipping_amount", shipping_amount.toString());
    formData.append("country", current_address);
    formData.append("size", size || "No Size");
    formData.append("color", color || "No Color");
    formData.append("cart_id", cart_id);

    // Log the request data for debugging
    console.log("Sending cart data:", {
      product_id,
      user_id: userId || "anonymous",
      qty,
      price,
      shipping_amount,
      current_address,
      color,
      size,
      cart_id,
    });

    // Make the API call
    const response = await axios.post("cart-view/", formData);

    if (response.status === 200 || response.status === 201) {
      Toast.fire({
        icon: "success",
        title: response.data.message || "Added To Cart",
      });
      return true;
    } else {
      throw new Error("Unexpected response status: " + response.status);
    }
  } catch (error) {
    console.error("Cart error:", error);
    console.error("Error details:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });

    let errorMessage = "Failed to add to cart";

    if (error.response) {
      // Server responded with error
      if (error.response.data && typeof error.response.data === "string") {
        errorMessage = error.response.data;
      } else if (error.response.data && error.response.data.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.response.data && error.response.data.error) {
        errorMessage = error.response.data.error;
      } else if (error.response.status === 404) {
        errorMessage = "Product not found";
      } else if (error.response.status === 500) {
        if (
          error.response.data &&
          error.response.data.includes("service_fee_charge_type")
        ) {
          errorMessage =
            "Store configuration is missing. Please contact the administrator.";
        } else if (
          error.response.data &&
          error.response.data.includes("Field 'id'")
        ) {
          errorMessage = "Invalid cart data. Please try again.";
        } else {
          errorMessage = "Server error - please try again later";
        }
      }
    } else if (error.request) {
      // No response received
      errorMessage = "No response from server - please check your connection";
    } else {
      // Error in request setup
      errorMessage = error.message;
    }

    Toast.fire({
      icon: "error",
      title: errorMessage,
    });

    return false;
  }
};
