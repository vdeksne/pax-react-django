import { useEffect, useState, useRef, useContext } from "react";
import { login, setAuthUser } from "../../utils/auth";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth";
import { Link } from "react-router-dom";
import apiInstance from "../../utils/axios";
import { CartContext } from "../plugin/Context";
import Swal from "sweetalert2";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const axios = apiInstance;
  const { updateCartCount } = useContext(CartContext);
  const googleButtonRef = useRef(null);

  useEffect(() => {
    if (isLoggedIn()) {
      navigate("/");
    }
  }, []);

  const handleGoogleSignIn = async (response) => {
    setGoogleLoading(true);
    try {
      const backendResponse = await axios.post("user/google-auth/", {
        token: response.credential,
      });

      if (backendResponse.data && backendResponse.data.access) {
        // Store tokens using the same auth system as regular login
        setAuthUser(backendResponse.data.access, backendResponse.data.refresh);

        Swal.fire({
          icon: "success",
          title: backendResponse.data.message || "Login Successful",
          text: "Welcome back! You have been logged in.",
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
          text: "signin_with",
        });
      } else {
        // Retry after a short delay if Google script hasn't loaded yet
        setTimeout(initGoogleSignIn, 100);
      }
    };

    // Start initialization
    initGoogleSignIn();
  }, []);

  const resetForm = () => {
    setEmail("");
    setPassword("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await login(email, password);
      if (error) {
        alert(error);
      } else {
        navigate("/");
        resetForm();
      }
    } catch (err) {
      alert(err.response?.data?.detail || "An error occurred");
    }
    setIsLoading(false);
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title text-center mb-4">Login</h3>

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

              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-100 btn-main-pricing"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </button>
              </form>
              <div className="mt-3 text-center">
                <p>
                  Don't have an account?{" "}
                  <Link to="/register">Register here</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
