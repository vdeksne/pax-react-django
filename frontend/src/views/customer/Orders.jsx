import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import apiInstance from "../../utils/axios";
import UserData from "../plugin/UserData";
import moment from "moment";
import { Link } from "react-router-dom";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const axios = apiInstance;
  const userData = UserData();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userData?.user_id) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `customer/orders/${userData.user_id}/`
        );
        setOrders(response.data || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userData?.user_id]);

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="row">
          <Sidebar />
          <div className="col-lg-9 mt-1">
            <div className="text-center">
              <h3>Loading orders...</h3>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="row">
          <Sidebar />
          <div className="col-lg-9 mt-1">
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <section className="">
        <div className="row">
          <Sidebar />
          <div className="col-lg-9 mt-1">
            <main className="mb-5">
              <div className="container px-4">
                <section className="mb-5">
                  <h3 className="mb-3">
                    <i className="fas fa-shopping-cart" /> Orders
                  </h3>
                  <div className="row gx-xl-5">
                    <div className="col-lg-4 mb-4 mb-lg-0">
                      <div
                        className="rounded shadow"
                        style={{ backgroundColor: "#EAAD00" }}
                      >
                        <div className="card-body">
                          <div className="d-flex align-items-center">
                            <div className="">
                              <p className="mb-1">Total Orders</p>
                              <h2 className="mb-0">{orders?.length || 0}</h2>
                            </div>
                            <div className="flex-grow-1 ms-5">
                              <div className="p-3 badge-primary rounded-4">
                                <i
                                  className="fas fa-shopping-cart fs-4"
                                  style={{ color: "#000" }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 mb-4 mb-lg-0">
                      <div
                        className="rounded shadow"
                        style={{ backgroundColor: "#FFCE47" }}
                      >
                        <div className="card-body">
                          <div className="d-flex align-items-center">
                            <div className="">
                              <p className="mb-1">Pending Delivery</p>
                              <h2 className="mb-0">
                                {orders?.filter(
                                  (order) => order.order_status === "Pending"
                                )?.length || 0}
                              </h2>
                            </div>
                            <div className="flex-grow-1 ms-5">
                              <div className="p-3 badge-primary rounded-4">
                                <i
                                  className="fas fa-clock fs-4"
                                  style={{ color: "#000" }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 mb-4 mb-lg-0">
                      <div
                        className="rounded shadow"
                        style={{ backgroundColor: "#FFC31F" }}
                      >
                        <div className="card-body">
                          <div className="d-flex align-items-center">
                            <div className="">
                              <p className="mb-1">Fulfilled Orders</p>
                              <h2 className="mb-0">
                                {orders?.filter(
                                  (order) => order.order_status === "Fulfilled"
                                )?.length || 0}
                              </h2>
                            </div>
                            <div className="flex-grow-1 ms-5">
                              <div className="p-3 badge-primary rounded-4">
                                <i
                                  className="fas fa-check-circle fs-4"
                                  style={{ color: "#000" }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="">
                  <div className="row rounded shadow p-3 overflow-scroll">
                    <div className="col-lg-12 mb-4 mb-lg-0 h-100">
                      <table className="table align-middle mb-0 bg-white">
                        <thead className="bg-light">
                          <tr>
                            <th>Order ID</th>
                            <th>Payment Status</th>
                            <th>Order Status</th>
                            <th>Total</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders?.length > 0 ? (
                            orders.map((o) => (
                              <tr key={o.oid}>
                                <td>
                                  <p className="fw-bold mb-1">#{o.oid}</p>
                                  <p className="text-muted mb-0">
                                    {moment(o.date).format("MM/DD/YYYY")}
                                  </p>
                                </td>
                                <td>
                                  <p className="fw-normal mb-1">
                                    {o.payment_status.toUpperCase()}
                                  </p>
                                </td>
                                <td>
                                  <p className="fw-normal mb-1">
                                    {o.order_status}
                                  </p>
                                </td>
                                <td>
                                  <span className="fw-normal mb-1">
                                    ${o.total}
                                  </span>
                                </td>
                                <td>
                                  <Link
                                    className="btn btn-link btn-sm btn-rounded"
                                    to={`/customer/order/detail/${o.oid}/`}
                                  >
                                    View <i className="fas fa-eye" />
                                  </Link>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="5" className="text-center">
                                <p className="mb-0">No orders found</p>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </section>
              </div>
            </main>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Orders;
