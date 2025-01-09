import { useEffect, useState, Fragment } from "react";
import axios from "axios";
import Sidebar from "./SideBar";

export default function SalesReport() {
  const [orders, setOrders] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [filter, setFilter] = useState("monthly"); // Default filter

  useEffect(() => {
    async function fetchSalesReport() {
      try {
        const { data } = await axios.get(
          `/api/v1/admin/salesReport?filterBy=${filter}`
        );
        setOrders(data.orders);
        setTotalSales(data.totalAmount);
      } catch (error) {
        console.error("Error fetching sales report:", error);
      }
    }
    fetchSalesReport();
  }, [filter]);

  return (
    <div className="row">
      <div className="col-12 col-md-2">
        <Sidebar />
      </div>
      <div className="col-12 col-md-10">
        <div className="sales-report-container">
          <h1 className="headings mb-4">Sales Report</h1>
          <div className="filters">
            <button onClick={() => setFilter("daily")}>Daily</button>
            <button onClick={() => setFilter("weekly")}>Weekly</button>
            <button onClick={() => setFilter("monthly")}>Monthly</button>
            <button onClick={() => setFilter("yearly")}>Yearly</button>
            <button onClick={() => setFilter("all")}>All</button>
          </div>
          <h2 className="headings">Total Sales: ${totalSales}</h2>
          <div className="table-container">
            <table className="sales-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Product Name</th>
                  <th>Quantity</th>
                  <th>Total Price</th>
                  <th>Delivered At</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.orderItems[0].name}</td>
                    <td>{order.orderItems[0].quantity}</td>
                    <td>${order.totalPrice.toFixed(2)}</td>
                    <td>
                      {new Date(order.deliveredAt).toLocaleString() ===
                      "Invalid Date"
                        ? "Not delivered"
                        : new Date(order.deliveredAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Internal CSS Styling */}
      <style jsx>{`
        .sales-report-container {
          padding: 20px;
          font-family: Arial, sans-serif;
        }

        h1 {
          color: #333;
          text-align: center;
        }

        .filters {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 20px;
        }

        .filters button {
          margin: 10px;
          padding: 10px 20px;
          background-color: #4caf50;
          color: white;
          font-size: 16px;
          border: none;
          cursor: pointer;
          border-radius: 5px;
          transition: background-color 0.3s ease;
        }

        .filters button:hover {
          background-color: #45a049;
        }

        h2 {
          text-align: center;
          color: #555;
        }

        .table-container {
          width: 100%;
          overflow-x: auto;
        }

        .sales-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 30px;
        }

        .sales-table th,
        .sales-table td {
          padding: 12px;
          text-align: left;
          border: 1px solid #ddd;
        }

        .sales-table th {
          background-color: #f2f2f2;
          color: #333;
        }

        .sales-table tbody tr:nth-child(even) {
          background-color: #f9f9f9;
        }

        .sales-table tbody tr:hover {
          background-color: #f1f1f1;
        }

        @media (max-width: 768px) {
          h1 {
            font-size: 24px;
          }

          h2 {
            font-size: 18px;
          }

          .filters button {
            font-size: 14px;
            padding: 8px 16px;
          }

          .sales-table th,
          .sales-table td {
            padding: 8px;
            font-size: 12px;
          }
        }

        @media (max-width: 480px) {
          .filters {
            flex-direction: column;
          }

          .filters button {
            width: 100%;
            margin: 5px 0;
          }

          .sales-table th,
          .sales-table td {
            padding: 6px;
            font-size: 10px;
          }

          h1 {
            font-size: 20px;
          }

          h2 {
            font-size: 16px;
          }

          .table-container {
            overflow-x: auto;
            overflow-y: hidden;
          }
        }
      `}</style>
    </div>
  );
}
