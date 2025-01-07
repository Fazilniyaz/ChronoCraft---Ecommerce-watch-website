import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import { register, verifyOtp } from "../../actions/userActions";

export default function OtpVerification() {
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(() => {
    const savedTime = localStorage.getItem("otpTimeLeft");
    const savedTimestamp = localStorage.getItem("otpTimestamp");
    if (savedTime && savedTimestamp) {
      const elapsedTime = Math.floor((Date.now() - savedTimestamp) / 1000);
      return Math.max(0, savedTime - elapsedTime); // Calculate remaining time
    }
    return 60; // Default timer
  });

  const location = useLocation();
  const userData = location.state?.userData; // Retrieve userData from state
  console.log("User Data:", userData);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, otp: OTP } = useSelector((state) => state.authState);

  // Countdown timer logic
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft((prev) => {
          localStorage.setItem("otpTimeLeft", prev - 1); // Save remaining time
          localStorage.setItem("otpTimestamp", Date.now()); // Save current timestamp
          return prev - 1;
        });
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      localStorage.removeItem("otpTimeLeft");
      localStorage.removeItem("otpTimestamp");
    }
  }, [timeLeft]);

  const handleResendOtp = async () => {
    if (!userData?.email) {
      toast("User email not found", {
        type: "error",
        position: "bottom-center",
      });
      return;
    }

    try {
      dispatch(verifyOtp({ email: userData.email }));
      toast(`OTP resent successfully to ${userData.email}`, {
        type: "success",
        position: "bottom-center",
      });
      setTimeLeft(60); // Reset timer
    } catch (error) {
      toast("An error occurred while resending OTP", {
        type: "error",
        position: "bottom-center",
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otp == OTP) {
      console.log("USERUSERUSERDATATATATATA", userData);
      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("email", userData.email);
      formData.append("password", userData.password);
      formData.append("avatar", userData.avatar);
      dispatch(register(formData));
      // dispatch(register(userData)); // Register user with form data
      toast("User Registered Successfully!", {
        type: "success",
        position: "bottom-center",
      });
      console.log(
        "............................................navigate above line"
      );
      navigate("/");
    } else {
      toast("Invalid OTP", {
        type: "error",
        position: "bottom-center",
      });
    }
  };

  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f0f4f8",
  };

  const cardStyle = {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "400px",
    textAlign: "center",
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    margin: "15px 0",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
  };

  const buttonStyle = {
    width: "100%",
    padding: "10px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
  };

  const timerTextStyle = {
    marginTop: "15px",
    fontSize: "14px",
    color: "#666",
  };

  const resendButtonStyle = {
    marginTop: "15px",
    backgroundColor: "transparent",
    border: "none",
    color: "#007bff",
    cursor: "pointer",
    fontSize: "14px",
    textDecoration: "underline",
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={{ marginBottom: "20px", fontSize: "24px", color: "#333" }}>
          OTP Verification
        </h1>
        <p style={{ fontSize: "16px", color: "#666" }}>
          Enter the OTP sent to your email.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="otp"
            maxLength="6"
            placeholder="Enter OTP"
            style={inputStyle}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <button
            type="submit"
            style={buttonStyle}
            disabled={loading || otp.length !== 6}
          >
            VERIFY
          </button>
        </form>

        {timeLeft > 0 ? (
          <p style={timerTextStyle}>Resend OTP in {timeLeft} seconds</p>
        ) : (
          <button style={resendButtonStyle} onClick={handleResendOtp}>
            Resend OTP
          </button>
        )}
      </div>
    </div>
  );
}
