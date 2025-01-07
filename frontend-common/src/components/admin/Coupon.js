import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import CouponTable from "./CouponTable";

export default function CouponForm() {
  const [couponData, setCouponData] = useState({
    code: "",
    discount: "",
    expiryDate: "",
  });

  const handleChange = (e) => {
    setCouponData({ ...couponData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/v1/createCoupon", couponData);
      toast.success(data.message);
      setCouponData({ code: "", discount: "", expiryDate: "" }); // Reset form
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create coupon. Try again."
      );
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 headings">Create a New Coupon</h2>
      <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light">
        <div className="form-group mb-3">
          <label htmlFor="code">Coupon Code</label>
          <input
            type="text"
            className="form-control"
            id="code"
            name="code"
            value={couponData.code}
            onChange={handleChange}
            placeholder="Enter coupon code"
            required
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="discount">Discount (%)</label>
          <input
            type="number"
            className="form-control"
            id="discount"
            name="discount"
            value={couponData.discount}
            onChange={handleChange}
            placeholder="Enter discount percentage"
            required
            min="1"
            max="100"
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="expiryDate">Expiry Date</label>
          <input
            type="date"
            className="form-control"
            id="expiryDate"
            name="expiryDate"
            value={couponData.expiryDate}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Create Coupon
        </button>
      </form>
      <CouponTable />
    </div>
  );
}
