import { useEffect, useState, useContext, lazy, Suspense } from "react";
import "../../assets/css/pricing.css";
import "../../assets/css/products.css";

import apiInstance from "../../utils/axios";
import GetCurrentAddress from "../plugin/UserCountry";
import UserData from "../plugin/UserData";
import CartID from "../plugin/cartID";
import { addToCart } from "../plugin/addToCart";
import { addToWishlist } from "../plugin/addToWishlist";
import { CartContext } from "../plugin/Context";
import "../../App.css";
import Swal from "sweetalert2";

// Lazy load components
const PricingPlans = lazy(() => import("./components/PricingPlans"));
const ProductGrid = lazy(() => import("./components/ProductGrid"));
const CategoryList = lazy(() => import("./components/CategoryList"));
const HeroSection = lazy(() => import("./components/HeroSection"));

function Products() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [loadingStates, setLoadingStates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0); // For backend pagination

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

  // Responsive pagination with memoization
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setItemsPerPage(width < 768 ? 3 : width < 1024 ? 4 : 6);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // With backend pagination, products are already paginated
  // No need to slice - backend returns only the current page
  const currentItems = products;
  // Use totalCount from backend if available, otherwise fallback to products.length
  const totalPages =
    totalCount > 0
      ? Math.ceil(totalCount / itemsPerPage)
      : products.length > 0
      ? Math.ceil(products.length / itemsPerPage)
      : 1;
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Fetch data in parallel with better error handling
  useEffect(() => {
    let isMounted = true;
    const fetchAllData = async () => {
      // Always set loading to false after a maximum time to ensure page renders
      const maxLoadTime = setTimeout(() => {
        if (isMounted) {
          setLoading(false);
        }
      }, 30000); // 30 seconds max - reduced from 70s

      try {
        // Use Promise.allSettled to handle partial failures gracefully
        const [productsResult, categoryResult] = await Promise.allSettled([
          apiInstance.get("products/", {
            timeout: 15000, // 15s for products (should be fast with pagination)
            params: {
              page: currentPage,
              page_size: itemsPerPage,
            },
          }),
          apiInstance.get("category/", { 
            timeout: 20000, // 20s for categories (increased to prevent cancellation)
          }),
        ]);

        if (!isMounted) return; // Don't update state if component unmounted
        
        clearTimeout(maxLoadTime);

        // Handle products - now with pagination
        if (productsResult.status === "fulfilled") {
          const response = productsResult.value;
          // Backend pagination returns { results: [...], count: total, next: url, previous: url }
          if (response.data.results) {
            setProducts(response.data.results || []);
            // Update total count for pagination
            if (response.data.count !== undefined) {
              setTotalCount(response.data.count);
            }
          } else {
            // Fallback for non-paginated response (backward compatibility)
            setProducts(response.data || []);
            setTotalCount(response.data?.length || 0);
          }
          setError(null);
        } else {
          // Log error details in development
          if (import.meta.env.DEV) {
            console.warn("Failed to load products:", productsResult.reason);
          }
          // Set error message for user feedback
          const errorReason = productsResult.reason;
          if (errorReason?.code === "ECONNABORTED") {
            setError(
              "Products are taking longer than expected to load. Please refresh the page."
            );
          } else if (errorReason?.response?.status === 404) {
            setError(
              "Products endpoint not found. Please check backend configuration."
            );
          } else if (errorReason?.code === "ERR_NETWORK") {
            setError(
              "Unable to connect to server. The backend may be down or unreachable. Please try again later."
            );
          } else if (
            errorReason?.message?.includes("CORS") ||
            errorReason?.message?.includes("blocked")
          ) {
            setError(
              "CORS error: Backend is not allowing requests from this domain. Please check backend CORS configuration."
            );
          } else {
            setError(
              `Failed to load products: ${
                errorReason?.message || "Unknown error"
              }. Please try refreshing the page.`
            );
          }
          setProducts([]);
        }

        // Handle categories
        if (categoryResult.status === "fulfilled") {
          setCategory(categoryResult.value.data || []);
        } else {
          // Silently handle category loading failures - non-critical feature
          if (import.meta.env.DEV) {
            console.warn("Failed to load categories:", categoryResult.reason);
          }
          setCategory([]);
        }

        setLoading(false);
      } catch (error) {
        clearTimeout(maxLoadTime);
        // Log full error in development
        if (import.meta.env.DEV) {
          console.error("Error fetching data:", error);
        }
        // Set user-friendly error message
        setError(
          "An unexpected error occurred. Please try refreshing the page."
        );
        // Always set empty arrays so page still renders even if API fails
        setProducts([]);
        setCategory([]);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchAllData();
    
    // Cleanup function to prevent state updates if component unmounts
    return () => {
      isMounted = false;
    };
  }, [currentPage, itemsPerPage]); // Refetch when page changes

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

    // Validate cart_id
    if (!cart_id) {
      console.error("No cart ID available");
      return;
    }

    setLoadingStates((prev) => ({ ...prev, [product_id]: "Adding..." }));

    try {
      // Get current user data
      const currentUserData = userData || null;

      // Log the data being sent
      console.log("Adding to cart with data:", {
        product_id,
        user_id: currentUserData?.user_id || "anonymous",
        qty: qtyValue,
        price,
        shipping_amount,
        country: currentAddress?.country,
        color: colorValue,
        size: sizeValue,
        cart_id,
      });

      const success = await addToCart(
        product_id,
        currentUserData?.user_id,
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

        // Update cart count
        try {
          const url = currentUserData?.user_id
            ? `cart-list/${cart_id}/${currentUserData.user_id}/`
            : `cart-list/${cart_id}/`;

          const response = await apiInstance.get(url);
          updateCartCount(response.data.length);
        } catch (error) {
          console.error("Error updating cart count:", error);
        }
      } else {
        throw new Error("Failed to add to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      setLoadingStates((prev) => ({ ...prev, [product_id]: "Add to Cart" }));

      // Show error message to user
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to add item to cart. Please log in and try again.",
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 3000,
      });
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
              {/* Error message display */}
              {error && (
                <div
                  className="alert alert-warning alert-dismissible fade show"
                  role="alert"
                  style={{
                    margin: "20px auto",
                    maxWidth: "800px",
                    textAlign: "center",
                  }}
                >
                  <strong>⚠️ {error}</strong>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setError(null)}
                    aria-label="Close"
                  ></button>
                </div>
              )}

              {/* Show message if no products */}
              {!error && products.length === 0 && (
                <div
                  className="alert alert-info"
                  style={{
                    margin: "20px auto",
                    maxWidth: "800px",
                    textAlign: "center",
                  }}
                >
                  <strong>No products available at the moment.</strong>
                  <br />
                  <small>
                    Please check back later or contact support if this persists.
                  </small>
                </div>
              )}

              <Suspense fallback={<div>Loading...</div>}>
                <HeroSection userData={userData} />
                <CategoryList categories={category} />
                {products.length > 0 && (
                  <ProductGrid
                    currentItems={currentItems}
                    handleColorButtonClick={handleColorButtonClick}
                    handleSizeButtonClick={handleSizeButtonClick}
                    handleQtyChange={handleQtyChange}
                    handleAddToCart={handleAddToCart}
                    handleAddToWishlist={handleAddToWishlist}
                    selectedProduct={selectedProduct}
                    colorImage={colorImage}
                    selectedColors={selectedColors}
                    selectedSize={selectedSize}
                    qtyValue={qtyValue}
                    loadingStates={loadingStates}
                  />
                )}
              </Suspense>

              {/* Pagination - only show if there are products */}
              {products.length > 0 && totalPages > 1 && (
                <nav className="d-flex justify-content-center align-items-center gap-2 flex-wrap mt-4">
                  <button
                    className="btn-main-pricing-pagination"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>

                  <div className="d-flex gap-1 flex-wrap justify-content-center">
                    {pageNumbers.map((number) => (
                      <button
                        key={number}
                        className={`btn-main-pricing-pagination ${
                          currentPage === number
                            ? "btn-main-pricing-pagination"
                            : "btn-main-pricing-pagination"
                        }`}
                        onClick={() => setCurrentPage(number)}
                      >
                        {number}
                      </button>
                    ))}
                  </div>

                  <button
                    className="btn-main-pricing-pagination"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </nav>
              )}

              <div className="text-center mt-4">
                <p className="text-muted gotham-light">
                  Page <b>{currentPage}</b> of <b>{totalPages}</b>
                </p>
                {totalPages > 1 && (
                  <p className="text-muted gotham-light">
                    Showing <b>{products?.length || 0}</b> of{" "}
                    <b>{totalCount || products?.length || 0}</b> records
                  </p>
                )}
              </div>
            </div>
          </main>

          <Suspense fallback={<div>Loading pricing plans...</div>}>
            <PricingPlans />
          </Suspense>
        </div>
      ) : (
        <div className="container text-center py-5">
          <img
            className="img-fluid"
            src="/assets/images/loading.gif"
            alt="Loading..."
          />
        </div>
      )}
    </>
  );
}

export default Products;
