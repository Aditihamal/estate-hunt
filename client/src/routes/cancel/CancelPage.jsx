import { Link } from "react-router-dom";

const CancelPage = () => {
  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h2 style={{ color: "#e74c3c" }}>❌ Payment Cancelled</h2>
      <p>You cancelled the checkout. No changes were made.</p>
      
      <Link to="/subscribe">
        <button style={{ marginTop: "20px", padding: "10px 20px", cursor: "pointer" }}>
          Back to Subscription
        </button>
      </Link>
    </div>
  );
};

export default CancelPage;
