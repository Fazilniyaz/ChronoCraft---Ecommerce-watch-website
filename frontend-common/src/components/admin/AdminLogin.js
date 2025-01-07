import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("isAdmin")) {
      navigate("/admin-dashboard");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/admin-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed!");
      }

      if (response.status === 200) {
        localStorage.setItem("isAdmin", true);
        navigate("/admin-dashboard");
      }

      const data = await response.json();
      console.log("Success:", data);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        height: "100vh",
        background: "linear-gradient(to bottom, #f8f9fa, #ffffff)",
      }}
    >
      <div
        className="card p-4 shadow-lg border-0"
        style={{
          width: "360px",
          borderRadius: "10px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2 className="text-center mb-4 fw-bold">Admin Login</h2>
        {errorMessage && (
          <div className="alert alert-danger text-center" role="alert">
            {errorMessage}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label fw-semibold">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label fw-semibold">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="d-flex justify-content-between align-items-center mb-3"></div>
          <button
            type="submit"
            className="btn btn-warning w-100"
            style={{
              backgroundColor: "#f79f1f",
              color: "white",
              fontWeight: "bold",
            }}
          >
            LOGIN
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
