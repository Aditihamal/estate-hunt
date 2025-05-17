import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 100);
    return () => clearTimeout(timeout);
  }, []);

  if (loading) return null;

  const userType = currentUser?.userType || currentUser?.user?.userType;

  console.log("🔐 AdminRoute check – userType:", userType);

  if (!currentUser) return <Navigate to="/login" />;
  if (userType !== "Admin") return <Navigate to="/" />;

  return children;
};

export default AdminRoute;
