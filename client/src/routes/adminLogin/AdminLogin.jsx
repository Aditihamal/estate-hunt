import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";

const AdminLogin = () => {
  const { updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await apiRequest.post("/auth/login", formData);
      const user = res.data;

      // 💡 Your real userType is inside user.user.userType
      const userType = user.user?.userType;

      console.log("🧠 Logged in userType:", userType);

      if (userType === "Admin") {
        updateUser(user);
        localStorage.setItem("user", JSON.stringify(user));
        // ✅ Force reload to fix router redirect issues
        window.location.href = "/admin";
      } else {
        setError("You are not authorized as Admin.");
      }
    } catch (err) {
      console.error("Admin login failed:", err);
      setError("Invalid credentials or server error.");
    }
  };

  return (
    <div className="admin-login" style={{ padding: "40px", maxWidth: "400px", margin: "auto" }}>
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <input
          type="email"
          name="email"
          placeholder="Admin Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login as Admin</button>
        {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
      </form>
    </div>
  );
};

export default AdminLogin;
