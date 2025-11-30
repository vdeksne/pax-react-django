import { useState, useContext, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiInstance from "../../utils/axios";
import UserData from "../plugin/UserData";
import { CartContext } from "../plugin/Context";
import { setAuthUser } from "../../utils/auth";
import Swal from "sweetalert2";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
    phone: "",
    full_name: "",
    user_type: "customer", // Default to customer
  });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const axios = apiInstance;
  const { updateCartCount } = useContext(CartContext);
  const userData = UserData();
  const googleButtonRef = useRef(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGoogleSignIn = async (response) => {
    setGoogleLoading(true);
    try {
      const backendResponse = await axios.post("user/google-auth/", {
        token: response.credential,
      });

      if (backendResponse.data && backendResponse.data.access) {
        // Store tokens using the same auth system as regular registration
        setAuthUser(backendResponse.data.access, backendResponse.data.refresh);

        Swal.fire({
          icon: "success",
          title: backendResponse.data.message || "Registration Successful",
          text: "Welcome! You have been registered and logged in.",
        }).then(() => {
          // Update cart count if needed
          if (updateCartCount) {
            updateCartCount();
          }
          navigate("/");
        });
      }
    } catch (error) {
      console.error("Google authentication error:", error);
      Swal.fire({
        icon: "error",
        title: "Authentication Failed",
        text:
          error.response?.data?.error ||
          "Failed to authenticate with Google. Please try again.",
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  useEffect(() => {
    // Wait for Google script to load
    const initGoogleSignIn = () => {
      if (window.google && window.google.accounts && googleButtonRef.current) {
        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

        if (!clientId) {
          console.warn(
            "Google Client ID not found. Please set VITE_GOOGLE_CLIENT_ID in your .env file"
          );
          return;
        }

        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleSignIn,
        });

        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: "outline",
          size: "large",
          width: "100%",
          text: "signup_with",
        });
      } else {
        // Retry after a short delay if Google script hasn't loaded yet
        setTimeout(initGoogleSignIn, 100);
      }
    };

    // Start initialization
    initGoogleSignIn();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate passwords match
    if (formData.password !== formData.password2) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: "Passwords do not match.",
      });
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("user/register/", formData);

      if (response.data) {
        Swal.fire({
          icon: "success",
          title: "Registration Successful",
          text: "Please login to continue",
        }).then(() => {
          navigate("/login");
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      console.log("Backend error details:", error.response?.data);
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text:
          error.response?.data?.message ||
          "Please check your information and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // If user is already logged in, redirect them
  if (userData) {
    navigate("/");
    return null;
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="text-center mb-4">Register</h2>

              {/* Google Sign-In Button */}
              <div className="mb-4">
                <div ref={googleButtonRef} className="w-100"></div>
                {googleLoading && (
                  <div className="text-center mt-2">
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Authenticating...
                  </div>
                )}
              </div>

              <div className="text-center mb-3">
                <span className="text-muted">OR</span>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    Username
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password2" className="form-label">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password2"
                    name="password2"
                    value={formData.password2}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="phone" className="form-label">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="full_name" className="form-label">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="user_type" className="form-label">
                    Account Type
                  </label>
                  <select
                    className="form-select"
                    id="user_type"
                    name="user_type"
                    value={formData.user_type}
                    onChange={handleChange}
                  >
                    <option value="customer">Customer</option>
                    <option value="vendor">Vendor</option>
                  </select>
                </div>
                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="w-100 btn-main-pricing"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Loading...
                      </>
                    ) : (
                      "Register"
                    )}
                  </button>
                </div>
              </form>
              <div className="mt-3 text-center">
                <p>
                  Already have an account? <Link to="/login">Login here</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
