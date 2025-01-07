import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Loader from "../layouts/Loader"; // Adjust the path as per your file structure

const WalletPage = () => {
  const [walletBalance, setWalletBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        const { data } = await axios.get("/api/v1/getWalletBalance"); // Replace with your endpoint
        setWalletBalance(data.wallet);
      } catch (err) {
        setError("Failed to load wallet balance.");
      } finally {
        setLoading(false);
      }
    };

    fetchWalletBalance();
  }, []);

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg border-0">
            <div className="card-body text-center">
              <h2 className="card-title text-primary">Your Wallet</h2>
              {loading && <Loader />}
              {error && <p className="text-danger">{error}</p>}
              {!loading && walletBalance === 0 && (
                <p className="text-warning">Your wallet is empty.</p>
              )}
              {!loading && walletBalance > 0 && (
                <p className="text-success">
                  Wallet Balance: <strong>₹{walletBalance}</strong>
                </p>
              )}
              <Link to="/orders">
                <button className="btn btn-primary mt-3">
                  Add Money to Wallet
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
