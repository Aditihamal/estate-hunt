import { useState } from "react";
import axios from "axios";

const AdminSignup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    secretKey: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8800/api/auth/admin-register", formData);
      setMessage("✅ Admin registered successfully");
    } catch (err) {
      setMessage("❌ " + (err.response?.data || "Registration failed"));
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Admin Signup</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          name="username"
          type="text"
          placeholder="Username"
          onChange={handleChange}
          style={styles.input}
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          style={styles.input}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          style={styles.input}
        />
        <input
          name="secretKey"
          type="text"
          placeholder="Secret Key"
          onChange={handleChange}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Register as Admin</button>
      </form>
      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "400px",
    margin: "80px auto",
    padding: "30px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    marginBottom: "20px",
    fontSize: "24px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  button: {
    padding: "12px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    fontWeight: "bold",
    fontSize: "16px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  message: {
    marginTop: "15px",
    color: "#d9534f",
    fontWeight: "bold",
  },
};

export default AdminSignup;
