import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const salesChartRef = useRef(null);
  const revenueChartRef = useRef(null);

  const [theme, setTheme] = useState("bright"); // State for theme
  const navigate = useNavigate();

  useEffect(() => {
    document.body.className =
      theme === "dark" ? "bg-dark text-light" : "bg-light text-dark";

    const createChart = (ctx, type, data, options) => {
      return new Chart(ctx, { type, data, options });
    };

    const textColor = theme === "dark" ? "#fff" : "#000";
    const backgroundColor =
      theme === "dark" ? "rgba(54, 162, 235, 0.5)" : "rgba(75, 192, 192, 0.2)";
    const borderColor =
      theme === "dark" ? "rgba(54, 162, 235, 1)" : "rgba(75, 192, 192, 1)";

    // Sales Chart
    const salesCtx = salesChartRef.current.getContext("2d");
    const salesChartInstance = createChart(
      salesCtx,
      "line",
      {
        labels: ["January", "February", "March", "April", "May", "June"],
        datasets: [
          {
            label: "Sales",
            data: [30, 50, 40, 60, 70, 90],
            borderColor,
            backgroundColor,
          },
        ],
      },
      {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            labels: { color: textColor },
          },
        },
        scales: {
          x: { ticks: { color: textColor } },
          y: { ticks: { color: textColor } },
        },
      }
    );

    // Revenue Chart
    const revenueCtx = revenueChartRef.current.getContext("2d");
    const revenueChartInstance = createChart(
      revenueCtx,
      "bar",
      {
        labels: ["January", "February", "March", "April", "May", "June"],
        datasets: [
          {
            label: "Revenue (in $)",
            data: [500, 700, 600, 800, 1000, 1200],
            backgroundColor,
            borderColor,
            borderWidth: 1,
          },
        ],
      },
      {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            labels: { color: textColor },
          },
        },
        scales: {
          x: { ticks: { color: textColor } },
          y: { ticks: { color: textColor } },
        },
      }
    );

    return () => {
      salesChartInstance.destroy();
      revenueChartInstance.destroy();
    };
  }, [theme]);

  const handleLogout = () => {
    toast.warn(
      <div>
        <p>Are you sure you want to logout?</p>
        <div className="d-flex justify-content-end gap-2 mt-2">
          <button
            onClick={() => {
              toast.dismiss();
              navigate("/admin-login");
              localStorage.clear();
            }}
            className="btn btn-danger"
          >
            Yes
          </button>
          <button onClick={() => toast.dismiss()} className="btn btn-secondary">
            No
          </button>
        </div>
      </div>,
      { autoClose: false }
    );
  };

  return (
    <div className="min-vh-100 p-4">
      <div
        className={`shadow mb-4 p-3 d-flex justify-content-between align-items-center rounded ${
          theme === "dark" ? "bg-dark text-white" : "bg-white text-dark"
        }`}
      >
        <h1 className="h4">Admin Dashboard</h1>
        <div className="d-flex gap-3 align-items-center">
          <button
            onClick={() => setTheme(theme === "dark" ? "bright" : "dark")}
            className="btn btn-primary"
          >
            Toggle {theme === "dark" ? "Bright" : "Dark"} Mode
          </button>
          <button onClick={handleLogout} className="btn btn-danger">
            Logout
          </button>
        </div>
      </div>

      <div className="row g-4">
        <div
          className={`col-lg-6 col-md-12 p-3 rounded shadow ${
            theme === "dark" ? "bg-dark text-white" : "bg-white text-dark"
          }`}
        >
          <h2 className="h6 mb-3">Sales Chart</h2>
          <canvas ref={salesChartRef} id="salesChart"></canvas>
        </div>

        <div
          className={`col-lg-6 col-md-12 p-3 rounded shadow ${
            theme === "dark" ? "bg-dark text-white" : "bg-white text-dark"
          }`}
        >
          <h2 className="h6 mb-3">Revenue Chart</h2>
          <canvas ref={revenueChartRef} id="revenueChart"></canvas>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}

export default AdminDashboard;
