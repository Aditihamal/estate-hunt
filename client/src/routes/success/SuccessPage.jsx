import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import apiRequest from "../../lib/apiRequest";

const SuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const hasRun = useRef(false); // ✅ this ensures the effect only runs once

  useEffect(() => {
    if (hasRun.current) return;

    const queryParams = new URLSearchParams(location.search);
    const planId = queryParams.get("planId");

    console.log("✅ Success page loaded");
    console.log("📦 Plan ID from URL:", planId);

    const confirmSubscription = async () => {
      try {
        console.log("➡️ Sending subscription creation request for planId:", planId);
        const res = await apiRequest.post("/subscription/subscribe", { planId });
        console.log("✅ Subscription created:", res.data);
        navigate("/subscribe");
      } catch (err) {
        console.error("❌ Failed to create subscription:", err);
      }
    };

    if (planId) {
      hasRun.current = true; // mark as run
      confirmSubscription();
    }
  }, [location, navigate]);

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h2 style={{ color: "#27ae60" }}>✅ Payment Successful</h2>
      <p>Thank you for your subscription!</p>
    </div>
  );
};

export default SuccessPage;
