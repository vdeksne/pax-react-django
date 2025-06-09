import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Line } from "react-chartjs-2";

import apiInstance from "../../utils/axios";
import UserData from "../plugin/UserData";
import Sidebar from "./Sidebar";

function Earning() {
  const [earningStats, setEarningStats] = useState(null);
  const [earningStatsTracker, setEarningTracker] = useState([]);
  const [earningChartData, setEarningChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const axios = apiInstance;
  const userData = UserData();

  if (UserData()?.vendor_id === 0) {
    window.location.href = "/vendor/register/";
  }

  useEffect(() => {
    const fetchEarningStats = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [statsResponse, monthlyResponse] = await Promise.all([
          axios.get(`vendor-earning/${userData?.vendor_id}/`),
          axios.get(`vendor-monthly-earning/${userData?.vendor_id}/`),
        ]);

        if (statsResponse.data && Array.isArray(statsResponse.data)) {
          setEarningStats(statsResponse.data[0] || null);
        }

        if (monthlyResponse.data && Array.isArray(monthlyResponse.data)) {
          setEarningTracker(monthlyResponse.data);
          setEarningChartData(monthlyResponse.data);
        }
      } catch (err) {
        console.error("Error fetching earning stats:", err);
        setError("Failed to load earning statistics");
      } finally {
        setIsLoading(false);
      }
    };

    if (userData?.vendor_id) {
      fetchEarningStats();
    }
  }, [userData?.vendor_id, axios]);

  const months = earningChartData?.map((item) => item.month) || [];
  const revenue = earningChartData?.map((item) => item.total_earning) || [];
  const sales_count = earningChartData?.map((item) => item.sales_count) || [];

  const revenue_data = {
    labels: months,
    datasets: [
      {
        label: "Revenue Analytics",
        data: revenue,
        fill: true,
        backgroundColor: "#cdb9ed",
        borderColor: "#6203fc",
      },
    ],
  };

  if (isLoading) {
    return (
      <div className="container-fluid" id="main">
        <div className="row row-offcanvas row-offcanvas-left h-100">
          <Sidebar />
          <div className="col-md-9 col-lg-10 main">
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ height: "100vh" }}
            >
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid" id="main">
        <div className="row row-offcanvas row-offcanvas-left h-100">
          <Sidebar />
          <div className="col-md-9 col-lg-10 main">
            <div className="alert alert-danger" role="alert">
              {error}
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
        <div className="col-md-9 col-lg-10 main">
          <div className="mb-3 mt-3" style={{ marginBottom: 300 }}>
            <h4>
              <i className="fas fa-dollar-sign"></i> Earning and Revenue{" "}
            </h4>

            <div className="col-xl-12 col-lg-12  mt-4">
              <div className="row mb-3 text-white">
                <div className="col-xl-6 col-lg-6 mb-2">
                  <div className="card card-inverse card-success">
                    <div
                      className="card-block p-3"
                      style={{ backgroundColor: "#C28F00" }}
                    >
                      <div className="rotate">
                        <i className="bi bi-currency-dollar fa-5x" />
                      </div>
                      <h6 className="text-uppercase">Total Sales</h6>
                      <h1 className="display-1">
                        <b>
                          ${Number(earningStats?.total_revenue || 0).toFixed(2)}
                        </b>
                      </h1>
                    </div>
                  </div>
                </div>
                <div className="col-xl-6 col-lg-6 mb-2">
                  <div className="card card-inverse card-danger">
                    <div
                      className="card-block p-3"
                      style={{ backgroundColor: "#C28F00" }}
                    >
                      <div className="rotate">
                        <i className="bi bi-currency-dollar fa-5x" />
                      </div>
                      <h6 className="text-uppercase">Monthly Earning</h6>
                      <h1 className="display-1">
                        <b>
                          $
                          {Number(earningStats?.monthly_revenue || 0).toFixed(
                            2
                          )}
                        </b>
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
              <hr />
              <div className="row container">
                <div className="col-lg-12">
                  <h4 className="mt-3 mb-4">Revenue Tracker</h4>
                  <table className="table">
                    <thead className="table-dark">
                      <tr>
                        <th scope="col">Month</th>
                        <th scope="col">Sales</th>
                        <th scope="col">Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {earningStatsTracker?.length > 0 ? (
                        earningStatsTracker.map((earning, index) => (
                          <tr key={`earning-${earning.month}-${index}`}>
                            {earning.month == 1 && (
                              <th scope="row">January </th>
                            )}
                            {earning.month == 2 && (
                              <th scope="row">February </th>
                            )}
                            {earning.month == 3 && <th scope="row">March </th>}
                            {earning.month == 4 && <th scope="row">April </th>}
                            {earning.month == 5 && <th scope="row">May </th>}
                            {earning.month == 6 && <th scope="row">June </th>}
                            {earning.month == 7 && <th scope="row">July </th>}
                            {earning.month == 8 && <th scope="row">August </th>}
                            {earning.month == 9 && (
                              <th scope="row">September </th>
                            )}
                            {earning.month == 10 && (
                              <th scope="row">October </th>
                            )}
                            {earning.month == 11 && (
                              <th scope="row">November </th>
                            )}
                            {earning.month == 12 && (
                              <th scope="row">December </th>
                            )}
                            <td>{earning.sales_count || 0}</td>
                            <td>
                              ${Number(earning.total_earning || 0).toFixed(2)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" className="text-center">
                            <h5 className="mt-4 p-3">
                              No earning data available
                            </h5>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="container">
                  <div className="row">
                    <div className="col">
                      <h4 className="mt-4">Revenue Analytics</h4>
                    </div>
                  </div>
                  <div className="row my-2">
                    <div className="col-md-12 py-1">
                      <div className="card">
                        <div className="card-body">
                          <Line data={revenue_data} style={{ height: 300 }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Earning;
