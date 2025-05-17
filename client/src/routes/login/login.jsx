import { useContext, useState } from "react";
import "./login.scss";
import { Link, useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";

function Login() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { updateUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const formData = new FormData(e.target);

    const email = formData.get("email"); // Updated
    const password = formData.get("password");

    try {
      const res = await apiRequest.post("/auth/login", {
        email,
        password,
      });
      console.log("🔍 Login userType:", res.data.user?.userType); // or user.userType if destructured

      const user = res.data;
      updateUser(user);
      localStorage.setItem("user", JSON.stringify(user));

      // ✅ Final working redirect block
      if (user.user?.userType === "Admin") {
        console.log("➡️ Redirecting to /admin");
        navigate("/admin");
        return; // ❗ prevents fallback navigation below
      } else {
        console.log("➡️ Redirecting to /");
        navigate("/");
      }

    } catch (err) {
      setError(err.response?.data?.message || "Login failed!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Welcome back</h1>
          <input
            name="email" // Updated
            required
            type="email" // Updated to "email"
            placeholder="Email" // Updated placeholder
          />
          <input
            name="password"
            type="password"
            required
            placeholder="Password"
          />
          <button disabled={isLoading}>Login</button>
          {error && <span>{error}</span>}
          <Link to="/register">{"Don't"} have an account?</Link>
        </form>
      </div>
      <div className="imgContainer">
        <img src="/newbg.png" alt="Background" />
      </div>
    </div>
  );
}

export default Login;
