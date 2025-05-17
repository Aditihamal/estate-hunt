import { useEffect, useState, useContext } from "react";
import { loadStripe } from "@stripe/stripe-js";
import apiRequest from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";
import "./subscriptionPage.scss";

// Replace with your actual Stripe test **publishable key**
const stripePromise = loadStripe("pk_test_51RCku6QA2vhZX1yM89w18HUf7EmtIbBIKfyT92ZMNKc734fprcMteICZVhwHmutKNKOrAnWewCHqQ2LyanyuENfp00UvFzP2Eq");

const SubscribePage = () => {
  const { currentUser } = useContext(AuthContext);
  const [plans, setPlans] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchData = async () => {
    try {
      const plansRes = await apiRequest.get("subscription/plans");
      setPlans(plansRes.data);

      try {
        const subRes = await apiRequest.get("subscription/my-subscription");
        setSubscription(subRes.data);
      } catch (subErr) {
        if (subErr.response && subErr.response.status === 404) {
          // No subscription yet — this is OK
          setSubscription(null);
        } else {
          console.error("Subscription fetch error:", subErr);
        }
      }
    } catch (err) {
      console.error("Plan fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [currentUser]);


  const handleSubscribe = async (planId) => {
    try {
      const stripe = await stripePromise;
      const res = await apiRequest.post("/stripe/create-checkout-session", { planId });
      window.location.href = res.data.url;
    } catch (err) {
      console.error("Stripe Error:", err);
      alert("Payment initiation failed.");
    }
  };

  return (
    <div className="subscription-page">
      <h2>Available Subscription Plans</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {subscription ? (
            <div className="current-subscription">
              <h3>Your Current Subscription</h3>
              <p>
                <strong>Plan:</strong> {subscription.plan.name}
              </p>
              <p>
                <strong>Expires on:</strong>{" "}
                {new Date(subscription.endDate).toLocaleDateString()}
              </p>
            </div>
          ) : (
            <p>No active subscription found.</p>
          )}

<div className="plans">
  {plans
  .filter(plan => {
    if (plan.userType !== currentUser.user.userType) return false;
    if (!subscription) return true;
    return plan.id !== subscription.plan.id;
  })
  .map(plan => (
    <div key={plan.id} className="plan-card">
      <h3>{plan.name}</h3>
      <p><strong>Price:</strong> NPR {plan.price}</p>
      <p><strong>Duration:</strong> {plan.duration} days</p>
      <ul>
        {plan.features.map((f, idx) => <li key={idx}>{f}</li>)}
      </ul>
      <button onClick={() => handleSubscribe(plan.id)}>Subscribe</button>
    </div>
  ))
}

</div>


        </>
      )}
    </div>
  );
};

export default SubscribePage;
