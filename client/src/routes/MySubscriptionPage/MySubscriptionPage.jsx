import { useEffect, useState, useContext } from "react";
import apiRequest from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";

const MySubscriptionPage = () => {
  const { currentUser } = useContext(AuthContext);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const res = await apiRequest.get("/subscription/my-subscription");
        setSubscription(res.data);
      } catch (err) {
        console.error("Error loading subscription:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, []);

  if (loading) return <p>Loading...</p>;

  if (!subscription) return <p>You have no active subscription.</p>;

  return (
    <div className="subscriptionStatus">
      <h2>Your Current Subscription</h2>
      <p><strong>Plan:</strong> {subscription.plan.name}</p>
      <p><strong>Price:</strong> NPR {subscription.plan.price}</p>
      <p><strong>Duration:</strong> {subscription.plan.duration} days</p>
      <p><strong>Start:</strong> {new Date(subscription.startDate).toLocaleDateString()}</p>
      <p><strong>End:</strong> {new Date(subscription.endDate).toLocaleDateString()}</p>

      {/* Optional Cancel/Upgrade Buttons */}
      <div className="actions">
        <button className="cancel">Cancel Subscription</button>
        <button className="upgrade">Upgrade Plan</button>
      </div>
    </div>
  );
};

export default MySubscriptionPage;
