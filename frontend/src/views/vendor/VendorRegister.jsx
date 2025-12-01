// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";

import apiInstance from "../../utils/axios";
import UserData from "../plugin/UserData";

function VendorRegister() {
  const userData = UserData();
  const location = useLocation();
  const redirectCheckedRef = useRef(false);
  const redirectTimeoutRef = useRef(null);

  // Check if user already has vendor account - only once
  useEffect(() => {
    // Clear any pending timeouts
    if (redirectTimeoutRef.current) {
      clearTimeout(redirectTimeoutRef.current);
      redirectTimeoutRef.current = null;
    }

    // Only check if we're on the register route
    if (location.pathname !== "/vendor/register/") {
      redirectCheckedRef.current = false;
      return;
    }

    // If we've already checked, don't check again
    if (redirectCheckedRef.current) {
      return;
    }

    // Wait for userData to be available
    if (userData === undefined) {
      return;
    }

    // Use timeout to prevent rapid checks
    redirectTimeoutRef.current = setTimeout(() => {
      // Double-check we're still on register route
      if (
        location.pathname !== "/vendor/register/" ||
        redirectCheckedRef.current
      ) {
        return;
      }

      // If user has a vendor account, redirect to dashboard
      if (userData && userData.vendor_id && userData.vendor_id !== 0) {
        redirectCheckedRef.current = true;
        // Clear dashboard redirect status
        sessionStorage.removeItem("vendor_dashboard_redirect_checked");
        window.location.href = "/vendor/dashboard/";
      } else {
        // No vendor account, allow registration
        redirectCheckedRef.current = true;
      }
    }, 200);

    return () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
        redirectTimeoutRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const [vendor, setVendor] = useState({
    image: null,
    name: "",
    email: "",
    description: "",
    mobile: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    setVendor({
      ...vendor,
      [event.target.name]: event.target.value,
    });
    console.log(vendor);
  };

  const handleFileChange = (event) => {
    setVendor({
      ...vendor,
      [event.target.name]: event.target.files[0],
    });
  };

  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate user is logged in
    if (!userData || !userData.user_id) {
      Swal.fire({
        icon: "error",
        title: "Authentication Required",
        text: "Please log in to register as a vendor",
      });
      return;
    }

    // Validate required fields
    if (!vendor.name || !vendor.email || !vendor.mobile) {
      Swal.fire({
        icon: "error",
        title: "Missing Information",
        text: "Please fill in all required fields (Shop Name, Email, Mobile)",
      });
      return;
    }

    const formdata = new FormData();
    setIsLoading(true);

    formdata.append("image", vendor.image);
    formdata.append("name", vendor.name);
    formdata.append("email", vendor.email);
    formdata.append("description", vendor.description || "");
    formdata.append("mobile", vendor.mobile);
    formdata.append("user_id", userData.user_id);

    try {
      const res = await apiInstance.post(`vendor-register/`, formdata, config);
      console.log("Registration response:", res.data);
      if (res.data.message == "Created vendor account") {
        Swal.fire({
          icon: "success",
          title: "Vendor Account Created Successfully",
          text: "Login to continue to dashboard",
        });
        setIsLoading(false);
        navigate("/logout");
      }
    } catch (error) {
      console.error("Registration error:", error);
      console.error("Error response:", error.response?.data);
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Failed to create vendor account. Please try again.";
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: errorMessage,
      });
      setIsLoading(false);
    }
  };

  return (
    <main className="" style={{ marginBottom: 100, marginTop: 50 }}>
      <div className="container">
        {/* Section: Login form */}
        <section className="">
          <div className="row d-flex justify-content-center">
            <div className="col-xl-5 col-md-8">
              <div className="card rounded-5">
                <div className="card-body p-4">
                  <h3 className="text-center">Register Vendor Account</h3>
                  <br />

                  <div className="tab-content">
                    <div
                      className="tab-pane fade show active"
                      id="pills-login"
                      role="tabpanel"
                      aria-labelledby="tab-login"
                    >
                      <form onSubmit={handleSubmit}>
                        <div className="form-outline mb-4">
                          <label className="form-label" htmlFor="Shop Name">
                            Shop Avatar
                          </label>
                          <input
                            type="file"
                            onChange={handleFileChange}
                            name="image"
                            placeholder="Shop Avatar"
                            required
                            className="form-control"
                          />
                        </div>
                        {/* Email input */}
                        <div className="form-outline mb-4">
                          <label className="form-label" htmlFor="Shop Name">
                            Shop Name
                          </label>
                          <input
                            type="text"
                            onChange={handleInputChange}
                            name="name"
                            placeholder="Shop Name"
                            required
                            className="form-control"
                          />
                        </div>
                        <div className="form-outline mb-4">
                          <label className="form-label" htmlFor="loginName">
                            Shop Email Address
                          </label>
                          <input
                            type="email"
                            onChange={handleInputChange}
                            name="email"
                            placeholder="Shop Email Address"
                            required
                            className="form-control"
                          />
                        </div>

                        <div className="form-outline mb-4">
                          <label className="form-label" htmlFor="loginName">
                            Shop Contact Number
                          </label>
                          <input
                            type="text"
                            onChange={handleInputChange}
                            name="mobile"
                            placeholder="Mobile Number"
                            required
                            className="form-control"
                          />
                        </div>

                        <div className="form-outline mb-4">
                          <label className="form-label" htmlFor="loginName">
                            Shop Description
                          </label>
                          <textarea
                            className="form-control"
                            onChange={handleInputChange}
                            name="description"
                            id=""
                            cols="30"
                            rows="10"
                          ></textarea>
                        </div>

                        <button
                          className="btn btn-primary w-100"
                          type="submit"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <span className="mr-2 ">Processing...</span>
                              <i className="fas fa-spinner fa-spin" />
                            </>
                          ) : (
                            <>
                              <span className="mr-2 me-3">Create Shop</span>
                              <i className="fas fa-shop" />
                            </>
                          )}
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default VendorRegister;
