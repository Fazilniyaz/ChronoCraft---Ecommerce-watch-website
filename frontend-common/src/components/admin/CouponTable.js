import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function CouponTable() {
  const [coupons, setCoupons] = useState([]);

  // Fetch coupons on component load
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const { data } = await axios.get("/api/v1/coupons");
        setCoupons(data.coupons);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to fetch coupons."
        );
      }
    };
    fetchCoupons();
  }, []);

  // Delete a coupon
  const handleDelete = async (couponId) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      try {
        await axios.delete(`/api/v1/delete/${couponId}`);
        toast.success("Coupon deleted successfully.");
        setCoupons(coupons.filter((coupon) => coupon._id !== couponId)); // Update state
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to delete coupon."
        );
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Manage Coupons</h2>
      <table className="table table-striped shadow bg-light">
        <thead>
          <tr>
            <th>Code</th>
            <th>Discount (%)</th>
            <th>Expiry Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {coupons.length > 0 ? (
            coupons.map((coupon) => (
              <tr key={coupon._id}>
                <td>{coupon.code}</td>
                <td>{coupon.discount}</td>
                <td>{new Date(coupon.expiryDate).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(coupon._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                No coupons available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
