// routes/dev/DevPlansPage.jsx
import { useEffect, useState } from "react";
import apiRequest from "../../lib/apiRequest";

const DevPlansPage = () => {
  const [plans, setPlans] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    duration: "",
    userType: "Agent",
    features: "",
  });

  const fetchPlans = async () => {
    try {
      const res = await apiRequest.get("/api/subscription/plans");
      setPlans(res.data);
    } catch (err) {
      console.error("Failed to fetch plans:", err);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiRequest.post("/api/subscription/plans", {
        ...form,
        price: parseInt(form.price),
        duration: parseInt(form.duration),
        features: form.features.split(",").map(f => f.trim()),
      });
      alert("✅ Plan created!");
      fetchPlans();
      setForm({ name: "", price: "", duration: "", userType: "Agent", features: "" });
    } catch (err) {
      console.error("Error creating plan:", err);
      alert("❌ Failed to create plan.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Create New Subscription Plan</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "400px" }}>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Plan Name" required />
        <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="Price (NPR)" required />
        <input name="duration" type="number" value={form.duration} onChange={handleChange} placeholder="Duration (days)" required />
        <select name="userType" value={form.userType} onChange={handleChange}>
          <option value="Agent">Agent</option>
          <option value="Buyer">Buyer</option>
        </select>
        <input name="features" value={form.features} onChange={handleChange} placeholder="Comma-separated features" />
        <button type="submit">Create Plan</button>
      </form>

      <hr />

      <h3>Existing Plans</h3>
      <ul>
        {plans.map(plan => (
          <li key={plan.id}>
            <strong>{plan.name}</strong> ({plan.userType}) – NPR {plan.price} for {plan.duration} days
            <ul>
              {plan.features.map((f, idx) => <li key={idx}>{f}</li>)}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DevPlansPage;
