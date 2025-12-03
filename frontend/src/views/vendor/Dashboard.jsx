import { useState, useEffect, useRef, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import moment from "moment";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

import apiInstance from "../../utils/axios";
import UserData from "../plugin/UserData";
import Sidebar from "./Sidebar";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState(null);
  const [orders, setOrders] = useState(null);
  const [orderChartData, setOrderChartData] = useState(null);
  const [productsChartData, setProductsChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const axios = apiInstance;
  const userData = UserData();
  const navigate = useNavigate();
  const location = useLocation();
  const fetchingRef = useRef(false);
  const lastVendorIdRef = useRef(null);

  // Extract vendor_id and memoize it to prevent unnecessary re-renders
  // Use the actual vendor_id value, not the userData object
  const vendorIdValue = userData?.vendor_id;
  const vendorId = useMemo(() => {
    if (!vendorIdValue || vendorIdValue === 0) {
      return null;
    }
    return vendorIdValue;
  }, [vendorIdValue]);

  // Use sessionStorage to prevent redirect loops
  const redirectKey = "vendor_dashboard_redirect_checked";
  const redirectCheckedRef = useRef(false);
  const redirectTimeoutRef = useRef(null);

  // Initialize redirect state - check sessionStorage, but vendorId check happens in useEffect
  const [isRedirecting, setIsRedirecting] = useState(() => {
    if (location.pathname === "/vendor/dashboard/") {
      const status = sessionStorage.getItem(redirectKey);
      // If marked as redirecting, return true (but will be overridden if vendorId exists)
      if (status === "redirecting") {
        return true;
      }
      // If marked as valid, we've already checked
      if (status === "valid") {
        redirectCheckedRef.current = true;
        return false;
      }
    }
    return false;
  });

  // State to track if we've verified vendor status from backend
  const [vendorStatusChecked, setVendorStatusChecked] = useState(false);
  const vendorCheckRef = useRef(false);

  // Effect to verify vendor status from backend if token doesn't have it
  useEffect(() => {
    if (
      location.pathname === "/vendor/dashboard/" &&
      userData &&
      userData.user_id &&
      !vendorCheckRef.current &&
      !vendorStatusChecked
    ) {
      // If token shows no vendor_id, check with backend
      if (!vendorId || vendorId === 0) {
        vendorCheckRef.current = true;
        // Check vendor status using dedicated endpoint
        axios
          .get(`check-vendor-status/${userData.user_id}/`)
          .then((response) => {
            const { has_vendor, vendor_id } = response.data;
            if (has_vendor && vendor_id) {
              // User has vendor account, clear redirect status
              sessionStorage.removeItem(redirectKey);
              setIsRedirecting(false);
              redirectCheckedRef.current = true;
              setVendorStatusChecked(true);
              console.log(
                "Vendor account confirmed via backend check, vendor_id:",
                vendor_id
              );
            } else {
              // No vendor account
              setVendorStatusChecked(true);
              console.log("No vendor account found for user");
            }
          })
          .catch((error) => {
            console.error("Error checking vendor status:", error);
            // On error, proceed with redirect check
            setVendorStatusChecked(true);
          });
      } else {
        // Token has vendor_id, we're good
        setVendorStatusChecked(true);
      }
    }
  }, [userData, vendorId, location.pathname, vendorStatusChecked]);

  // Effect to clear redirect status when vendorId becomes available
  useEffect(() => {
    if (
      location.pathname === "/vendor/dashboard/" &&
      vendorId &&
      vendorId !== 0
    ) {
      // If we have a vendorId, clear any redirect status immediately
      sessionStorage.removeItem(redirectKey);
      setIsRedirecting(false);
      redirectCheckedRef.current = true;
    }
  }, [vendorId, location.pathname]);

  // Single redirect check - runs only once per route change
  useEffect(() => {
    // Clear any pending timeouts
    if (redirectTimeoutRef.current) {
      clearTimeout(redirectTimeoutRef.current);
      redirectTimeoutRef.current = null;
    }

    // Only check if we're on the dashboard route
    if (location.pathname !== "/vendor/dashboard/") {
      // Don't clear sessionStorage when leaving - keep state
      redirectCheckedRef.current = false;
      setIsRedirecting(false);
      return;
    }

    // If we have a vendorId, don't check - allow access
    if (vendorId && vendorId !== 0) {
      sessionStorage.removeItem(redirectKey);
      setIsRedirecting(false);
      redirectCheckedRef.current = true;
      return;
    }

    // If we've already checked and decided, don't check again
    if (redirectCheckedRef.current) {
      return;
    }

    // Wait for userData to be available
    if (userData === undefined) {
      return;
    }

    // Wait for vendor status check to complete before redirecting
    if (!vendorStatusChecked) {
      return;
    }

    // Use a timeout to ensure we only check once after everything is stable
    redirectTimeoutRef.current = setTimeout(() => {
      // Double-check we're still on dashboard and haven't checked
      if (
        location.pathname !== "/vendor/dashboard/" ||
        redirectCheckedRef.current
      ) {
        return;
      }

      // PRIORITY 1: If we have a valid vendorId, always allow access (clear any stale redirect status)
      if (vendorId && vendorId !== 0) {
        // Clear any redirect status and mark as valid
        sessionStorage.removeItem(redirectKey);
        setIsRedirecting(false);
        redirectCheckedRef.current = true;
        return;
      }

      // PRIORITY 2: If no vendorId and user is logged in, redirect (only after vendor status is checked)
      if (
        userData !== null &&
        userData !== undefined &&
        (!vendorId || vendorId === 0) &&
        vendorStatusChecked
      ) {
        // Mark as redirecting in sessionStorage
        sessionStorage.setItem(redirectKey, "redirecting");
        setIsRedirecting(true);
        redirectCheckedRef.current = true;
        // Use window.location for immediate redirect
        window.location.href = "/vendor/register/";
        return;
      }

      // PRIORITY 3: If sessionStorage says redirecting but we don't have vendorId, honor it
      const alreadyChecked = sessionStorage.getItem(redirectKey);
      if (
        alreadyChecked === "redirecting" &&
        (!vendorId || vendorId === 0) &&
        vendorStatusChecked
      ) {
        setIsRedirecting(true);
        redirectCheckedRef.current = true;
        window.location.href = "/vendor/register/";
        return;
      }
    }, 300); // Slightly longer delay to ensure stability

    return () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
        redirectTimeoutRef.current = null;
      }
    };
    // Only depend on location.pathname to prevent re-runs
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Separate effect for data fetching - MUST be called before any early returns
  useEffect(() => {
    // Don't fetch if no vendorId or if it's invalid
    if (
      !vendorId ||
      vendorId === 0 ||
      vendorId === "undefined" ||
      vendorId === "null"
    ) {
      return;
    }

    // Prevent duplicate fetches - check both refs
    if (fetchingRef.current) {
      return;
    }

    if (lastVendorIdRef.current === vendorId) {
      return;
    }

    // Use a small delay to debounce and ensure we don't run multiple times
    const timeoutId = setTimeout(() => {
      // Double-check after timeout
      if (fetchingRef.current || lastVendorIdRef.current === vendorId) {
        return;
      }

      const fetchAllData = async () => {
        try {
          fetchingRef.current = true;
          setIsLoading(true);
          lastVendorIdRef.current = vendorId;

          // Validate vendorId is a valid number before making requests
          if (
            !vendorId ||
            vendorId === 0 ||
            vendorId === "undefined" ||
            vendorId === "null"
          ) {
            return;
          }

          const [
            statsResponse,
            productsResponse,
            ordersResponse,
            orderChartResponse,
            productChartResponse,
          ] = await Promise.all([
            axios.get(`vendor/stats/${vendorId}/`),
            axios.get(`vendor/products/${vendorId}/`),
            axios.get(`vendor/orders/${vendorId}/`),
            axios.get(`vendor-orders-report-chart/${vendorId}/`),
            axios.get(`vendor-products-report-chart/${vendorId}/`),
          ]);

          setStats(statsResponse.data[0]);
          setProducts(productsResponse.data);
          setOrders(ordersResponse.data);
          setOrderChartData(orderChartResponse.data);
          setProductsChartData(productChartResponse.data);
        } catch (error) {
          console.error("Error fetching data:", error);
          // Reset ref on error so it can retry
          lastVendorIdRef.current = null;
        } finally {
          setIsLoading(false);
          fetchingRef.current = false;
        }
      };

      fetchAllData();
    }, 100);

    return () => clearTimeout(timeoutId);
    // Only depend on vendorId
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vendorId]);

  // NOW we can do early returns after all hooks are called
  // Early return if redirecting - prevents any rendering
  if (isRedirecting) {
    return null;
  }

  // Show loading while checking vendor status
  if (
    location.pathname === "/vendor/dashboard/" &&
    !vendorStatusChecked &&
    userData
  ) {
    return (
      <div className="container-fluid" id="main">
        <div className="row row-offcanvas row-offcanvas-left h-100">
          <Sidebar />
          <div className="col-md-9 col-lg-10 main mt-4">
            <div className="text-center p-5">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Verifying vendor status...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If userData is still loading, show loading state
  if (userData === undefined) {
    return (
      <div className="container-fluid" id="main">
        <div className="row row-offcanvas row-offcanvas-left h-100">
          <Sidebar />
          <div className="col-md-9 col-lg-10 main mt-4">
            <div className="text-center p-5">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Data processing (not hooks, so this is fine)
  const order_months = orderChartData?.map((item) => item.month) || [];
  const order_counts = orderChartData?.map((item) => item.orders) || [];

  const product_labels = productsChartData?.map((item) => item.month) || [];
  const product_count = productsChartData?.map((item) => item.orders) || [];

  const order_data = {
    labels: order_months.length > 0 ? order_months : ["No Data"],
    datasets: [
      {
        label: "Total Orders",
        data: order_counts.length > 0 ? order_counts : [0],
        fill: true,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
      },
    ],
  };

  const product_data = {
    labels: product_labels.length > 0 ? product_labels : ["No Data"],
    datasets: [
      {
        label: "Total Products",
        data: product_count.length > 0 ? product_count : [0],
        fill: true,
        backgroundColor: "#ba9ede",
        borderColor: "#6100e0",
      },
    ],
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="container-fluid" id="main">
        <div className="row row-offcanvas row-offcanvas-left h-100">
          <Sidebar />
          <div className="col-md-9 col-lg-10 main mt-4">
            <div className="text-center p-5">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading dashboard data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid" id="main">
      <div className="row row-offcanvas row-offcanvas-left h-100">
        <Sidebar />
        <div className="col-md-9 col-lg-10 main mt-4">
          <div className="row mb-3 text-white">
            <div className="col-xl-4 col-lg-6 mb-2">
              <div className="card card-inverse card-success">
                <div
                  className="card-block p-3"
                  style={{ backgroundColor: "#C28F00" }}
                >
                  <div className="rotate">
                    <i className="bi bi-grid fa-5x" />
                  </div>
                  <h6 className="text-uppercase">Products</h6>
                  <h1 className="display-1">{stats?.products || 0}</h1>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-6 mb-2">
              <div className="card card-inverse card-danger">
                <div
                  className="card-block p-3"
                  style={{ backgroundColor: "#C28F00" }}
                >
                  <div className="rotate">
                    <i className="bi bi-cart-check fa-5x" />
                  </div>
                  <h6 className="text-uppercase">Orders</h6>
                  <h1 className="display-1">{stats?.orders || 0}</h1>
                </div>
              </div>
            </div>

            <div className="col-xl-4 col-lg-6 mb-2">
              <div className="card card-inverse card-warning">
                <div
                  className="card-block p-3"
                  style={{ backgroundColor: "#C28F00" }}
                >
                  <div className="rotate">
                    <i className="bi bi-currency-dollar fa-5x" />
                  </div>
                  <h6 className="text-uppercase">Revenue</h6>
                  <h1 className="display-1">${stats?.revenue || 0}</h1>
                </div>
              </div>
            </div>
          </div>
          {/*/row*/}
          <hr />
          <div className="row mb-1 mt-4">
            <div className="col">
              <h4>Chart Analytics</h4>
            </div>
          </div>
          <div className="row">
            <div className="col d-flex justify-content-center settings-buttons-container align-items-center">
              <Link className="btn-main-pricing me-2">Daily Report</Link>
              <Link className="btn-main-pricing me-2">Monthly Report</Link>
              <Link className="btn-main-pricing me-2">Yearly Report</Link>
            </div>
          </div>
          <div className="row my-2">
            <div className="col-lg-6 ">
              <div className="card overflow-hidden">
                <div className="card-body">
                  {orderChartData && orderChartData.length > 0 ? (
                    <Line
                      data={order_data}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          x: {
                            beginAtZero: true,
                          },
                          y: {
                            beginAtZero: true,
                          },
                        },
                      }}
                      style={{ height: 300 }}
                    />
                  ) : (
                    <div
                      style={{
                        height: 300,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <p>No order data available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="card overflow-hidden">
                <div className="card-body">
                  {productsChartData && productsChartData.length > 0 ? (
                    <Line
                      data={product_data}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          x: {
                            beginAtZero: true,
                          },
                          y: {
                            beginAtZero: true,
                          },
                        },
                      }}
                      style={{ height: 300 }}
                    />
                  ) : (
                    <div
                      style={{
                        height: 300,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <p>No product data available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <a id="layouts" />
          <div
            className="mb-3 mt-5 overflow-scroll"
            style={{ marginBottom: 300 }}
          >
            <nav className="mb-5">
              <div className="nav nav-tabs" id="nav-tab" role="tablist">
                <button
                  className="nav-link active"
                  id="nav-home-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#nav-home"
                  type="button"
                  role="tab"
                  aria-controls="nav-home"
                  aria-selected="true"
                >
                  {" "}
                  <i className="bi bi-grid-fill"></i> Product
                </button>
                <button
                  className="nav-link"
                  id="nav-profile-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#nav-profile"
                  type="button"
                  role="tab"
                  aria-controls="nav-profile"
                  aria-selected="false"
                >
                  {" "}
                  <i className="fas fa-shopping-cart"></i> Orders
                </button>
              </div>
            </nav>
            <div className="tab-content" id="nav-tabContent">
              <div
                className="tab-pane fade show active"
                id="nav-home"
                role="tabpanel"
                aria-labelledby="nav-home-tab"
              >
                <h4>Products</h4>
                <table className="table overflow-scroll">
                  <thead className="table-dark">
                    <tr>
                      <th scope="col">#ID</th>
                      <th scope="col">Name</th>
                      <th scope="col">Price</th>
                      <th scope="col">Quantity</th>
                      <th scope="col">Orders</th>
                      <th scope="col">Status</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products?.map((p, index) => (
                      <tr key={index}>
                        <th scope="row">#{p.sku}</th>
                        <td>{p.title}</td>
                        <td>${p.price}</td>
                        <td>{p.stock_qty}</td>
                        <td>{p.order_count}</td>
                        <td>{p?.status?.toUpperCase()}</td>
                        <td>
                          <Link
                            to={`/detail/${p.slug}`}
                            className="btn  mb-1 me-2"
                          >
                            <i className="fas fa-eye" />
                          </Link>
                          <Link to="" className="btn  mb-1 me-2">
                            <i className="fas fa-edit" />
                          </Link>
                          <Link to="" className="btn  mb-1 me-2">
                            <i className="fas fa-trash" />
                          </Link>
                        </td>
                      </tr>
                    ))}

                    {products < 1 && (
                      <tr>
                        <td colSpan="7" className="text-center">
                          <h5 className="mt-4 p-3">No products yet</h5>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div
                className="tab-pane fade"
                id="nav-profile"
                role="tabpanel"
                aria-labelledby="nav-profile-tab"
              >
                <h4>Products</h4>
                <table className="table">
                  <thead className="table-dark">
                    <tr>
                      <th scope="col">#ID</th>
                      <th scope="col">Name</th>
                      <th scope="col">Date</th>
                      <th scope="col">Status</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders?.map((o, index) => (
                      <tr key={index}>
                        <th scope="row">#{o.oid}</th>
                        <td>{o.full_name}</td>
                        <td>{moment(o.date).format("MM/DD/YYYY")}</td>
                        <td>{o.order_status}</td>
                        <td>
                          <a href="" className="btn mb-1">
                            <i className="fas fa-eye" />
                          </a>
                        </td>
                      </tr>
                    ))}

                    {orders < 1 && (
                      <tr>
                        <td colSpan="5" className="text-center">
                          <h5 className="mt-4 p-3">No orders yet</h5>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
