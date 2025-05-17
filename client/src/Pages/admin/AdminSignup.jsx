import { useState } from "react";
import apiRequest from "../../lib/apiRequest";

const AdminSignup = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        secretCode: ""
      });
      

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const [error, setError] = useState("");


  const handleSubmit = async (e) => {
    
    e.preventDefault();
    console.log("Sending formData:", formData);

    try {
      await apiRequest.post("/auth/admin-register", formData);
      alert("Admin account created successfully.");
    } catch (err) {
        console.error("Error creating admin:", err);
        if (err.response?.data?.message) {
          setError(err.response.data.message);
        } else {
          setError("Unauthorized or failed to register.");
        }
      }
      
      
  };

  return (
    <div className="adminSignup">
      <h2>Create Admin Account</h2>
       {/* Display error message here */}
    {error && (
      <p style={{ color: "crimson", fontWeight: "bold", marginBottom: "10px" }}>
        {error}
      </p>
    )}
      <form onSubmit={handleSubmit}>
  <input
    name="username"
    type="text"
    onChange={handleChange}
    placeholder="Username"
    required
  />
  <input
    name="email"
    type="email"
    onChange={handleChange}
    placeholder="Email"
    required
  />
  <input
    name="password"
    type="password"
    onChange={handleChange}
    placeholder="Password"
    required
  />
  <input
    name="secretKey"
    type="text"
    onChange={handleChange}
    placeholder="Admin Key"
    required
  />
  <button type="submit">Register</button>
</form>

    </div>
  );
};

export default AdminSignup;
