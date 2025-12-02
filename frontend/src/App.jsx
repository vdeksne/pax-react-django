import "./App.css"; // Importing the CSS file for styling.

import React, { lazy, Suspense } from "react"; // Import React explicitly and lazy/Suspense for code splitting
import { Route, Routes, BrowserRouter } from "react-router-dom"; // Importing necessary components from 'react-router-dom' for routing.
import MainWrapper from "./layouts/MainWrapper"; // Importing the 'MainWrapper' component.
import PrivateRoute from "./layouts/PrivateRoute"; // Importing the 'PrivateRoute' component.
import StoreHeader from "./views/base/StoreHeader";
import StoreFooter from "./views/base/StoreFooter";
import { CartProvider } from "./views/plugin/Context";

// Import Home eagerly to ensure React is available
import Home from "./views/shop/home";

// Lazy load other components for better performance
const Login = lazy(() => import("./views/auth/login"));
const Logout = lazy(() => import("./views/auth/logout"));
const Private = lazy(() => import("./views/auth/private"));
const Register = lazy(() => import("./views/auth/register"));
const ProductDetail = lazy(() => import("./views/shop/ProductDetail"));
const Cart = lazy(() => import("./views/shop/Cart"));
const Checkout = lazy(() => import("./views/shop/Checkout"));
const PaymentSuccess = lazy(() => import("./views/shop/PaymentSuccess"));
const Invoice = lazy(() => import("./views/shop/Invoice"));
const Account = lazy(() => import("./views/customer/Account"));
const Orders = lazy(() => import("./views/customer/Orders"));
const OrderDetail = lazy(() => import("./views/customer/OrderDetail"));
const Wishlist = lazy(() => import("./views/customer/Wishlist"));
const Notifications = lazy(() => import("./views/customer/Notifications"));
const Settings = lazy(() => import("./views/customer/Settings"));
const Dashboard = lazy(() => import("./views/vendor/Dashboard"));
const VendorProducts = lazy(() => import("./views/vendor/Products"));
const AddProduct = lazy(() => import("./views/vendor/AddProduct"));
const UpdateProduct = lazy(() => import("./views/vendor/UpdateProduct"));
const VendorOrders = lazy(() => import("./views/vendor/Orders"));
const VendorOrderDetail = lazy(() => import("./views/vendor/OrderDetail"));
const Earning = lazy(() => import("./views/vendor/Earning"));
const Reviews = lazy(() => import("./views/vendor/Reviews"));
const ReviewDetail = lazy(() => import("./views/vendor/ReviewDetail"));
const Coupon = lazy(() => import("./views/vendor/Coupon"));
const EditCoupon = lazy(() => import("./views/vendor/EditCoupon"));
const VendorNotifications = lazy(() => import("./views/vendor/Notifications"));
const VendorSettings = lazy(() => import("./views/vendor/Settings"));
const Shop = lazy(() => import("./views/vendor/Shop"));
const Search = lazy(() => import("./views/shop/Search"));
const ForgotPassword = lazy(() => import("./views/auth/forgotPassword"));
const CreatePassword = lazy(() => import("./views/auth/createPassword"));
const VendorRegister = lazy(() => import("./views/vendor/VendorRegister"));
const OrderItemDetail = lazy(() => import("./views/vendor/OrderItemDetail"));
const CategoryProducts = lazy(() => import("./views/shop/CategoryProducts"));
const Subscriptions = lazy(() => import("./views/shop/Subscriptions"));
const Products = lazy(() => import("./views/shop/Products"));
const About = lazy(() => import("./views/shop/About"));
const Contact = lazy(() => import("./views/shop/Contact"));
const Blog = lazy(() => import("./views/shop/Blog"));
const Terms = lazy(() => import("./views/shop/Terms"));
const Changelog = lazy(() => import("./views/shop/Changelog"));
const CookiePolicy = lazy(() => import("./views/shop/CookiePolicy"));

// Loading component for Suspense fallback
const LoadingFallback = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "50vh",
    }}
  >
    <div
      style={{
        width: "40px",
        height: "40px",
        border: "4px solid #f3f3f3",
        borderTop: "4px solid #000",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
      }}
    ></div>
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

function App() {
  // Define the main 'App' component.
  // Cart count is now managed by CartProvider Context, no need to fetch here

  return (
    <CartProvider>
      <BrowserRouter>
        <StoreHeader />
        <MainWrapper>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {" "}
              {/*  Define a collection of routes.*/}
              <Route // Define a specific route.
                path="/private" // Set the route path to "/private".
                element={
                  // Render the element when this route matches.
                  <PrivateRoute>
                    <Private />
                  </PrivateRoute>
                }
              />
              <Route path="/" element={<Home />} />{" "}
              {/* Home is eagerly loaded */}
              {/* Authentication Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/create-new-password" element={<CreatePassword />} />
              {/* Store Routes */}
              <Route path="/shop" element={<Products />} />
              <Route path="/detail/:slug" element={<ProductDetail />} />
              <Route path="/cart/" element={<Cart />} />
              <Route path="/checkout/:order_oid" element={<Checkout />} />
              <Route
                path="/payment-success/:order_oid/"
                element={<PaymentSuccess />}
              />
              <Route path="/invoice/:order_oid/" element={<Invoice />} />
              <Route path="/search" element={<Search />} />
              <Route path="/category/:slug" element={<CategoryProducts />} />
              <Route path="/subscriptions" element={<Subscriptions />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/changelog" element={<Changelog />} />
              <Route path="/cookie-policy" element={<CookiePolicy />} />
              {/* Customer Routes */}
              <Route
                path="/customer/account/"
                element={
                  <PrivateRoute>
                    <Account />
                  </PrivateRoute>
                }
              />
              <Route
                path="/customer/orders/"
                element={
                  <PrivateRoute>
                    <Orders />
                  </PrivateRoute>
                }
              />
              <Route
                path="/customer/order/detail/:order_oid/"
                element={
                  <PrivateRoute>
                    <OrderDetail />
                  </PrivateRoute>
                }
              />
              <Route
                path="/customer/wishlist/"
                element={
                  <PrivateRoute>
                    <Wishlist />
                  </PrivateRoute>
                }
              />
              <Route
                path="/customer/notifications/"
                element={
                  <PrivateRoute>
                    <Notifications />
                  </PrivateRoute>
                }
              />
              <Route
                path="/customer/settings/"
                element={
                  <PrivateRoute>
                    <Settings />
                  </PrivateRoute>
                }
              />
              {/* Vendor Routes */}
              <Route
                path="/vendor/dashboard/"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/vendor/products/"
                element={
                  <PrivateRoute>
                    {" "}
                    <VendorProducts />
                  </PrivateRoute>
                }
              />
              <Route
                path="/vendor/product/new/"
                element={
                  <PrivateRoute>
                    {" "}
                    <AddProduct />
                  </PrivateRoute>
                }
              />
              <Route
                path="/vendor/product/update/:pid/"
                element={
                  <PrivateRoute>
                    {" "}
                    <UpdateProduct />
                  </PrivateRoute>
                }
              />
              <Route
                path="/vendor/orders/"
                element={
                  <PrivateRoute>
                    {" "}
                    <VendorOrders />
                  </PrivateRoute>
                }
              />
              <Route
                path="/vendor/orders/:oid/"
                element={
                  <PrivateRoute>
                    {" "}
                    <VendorOrderDetail />
                  </PrivateRoute>
                }
              />
              <Route
                path="/vendor/earning/"
                element={
                  <PrivateRoute>
                    {" "}
                    <Earning />
                  </PrivateRoute>
                }
              />
              <Route
                path="/vendor/reviews/"
                element={
                  <PrivateRoute>
                    {" "}
                    <Reviews />
                  </PrivateRoute>
                }
              />
              <Route
                path="/vendor/reviews/:id/"
                element={
                  <PrivateRoute>
                    {" "}
                    <ReviewDetail />
                  </PrivateRoute>
                }
              />
              <Route
                path="/vendor/coupon/"
                element={
                  <PrivateRoute>
                    {" "}
                    <Coupon />
                  </PrivateRoute>
                }
              />
              <Route
                path="/vendor/coupon/:id/"
                element={
                  <PrivateRoute>
                    {" "}
                    <EditCoupon />
                  </PrivateRoute>
                }
              />
              <Route
                path="/vendor/notifications/"
                element={
                  <PrivateRoute>
                    {" "}
                    <VendorNotifications />
                  </PrivateRoute>
                }
              />
              <Route
                path="/vendor/settings/"
                element={
                  <PrivateRoute>
                    {" "}
                    <VendorSettings />
                  </PrivateRoute>
                }
              />
              <Route path="/vendor/:slug/" element={<Shop />} />
              <Route path="/vendor/register/" element={<VendorRegister />} />
              <Route
                path="/vendor/orders/:oid/:id/"
                element={<OrderItemDetail />}
              />
            </Routes>
          </Suspense>
        </MainWrapper>
        <StoreFooter />
      </BrowserRouter>
    </CartProvider>
  );
}

export default App; // Export the 'App' component as the default export.
