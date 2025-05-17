import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import "./verifyEmail.scss";

function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = new URLSearchParams(location.search).get("email");

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      await apiRequest.post("/auth/verify-email", { email, otp });
      alert("Email verified! You can now log in.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed!");
    }
  };

  return (
    <div className="verifyEmail">
      <form onSubmit={handleVerify}>
        <h1>Verify Your Email</h1>
        <p>We've sent a code to: {email}</p>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
        <button>Verify</button>
        {error && <span>{error}</span>}
      </form>
    </div>
  );
}

export default VerifyEmail;
