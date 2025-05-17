import { useContext } from "react";
import { Navigate, Outlet, NavLink } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import AdminTopbar from "./AdminTopbar";
import "./adminLayout.scss";

const AdminLayout = () => {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser) return <Navigate to="/login" />;
  if (currentUser.userType !== "Admin") return <Navigate to="/" />;

  // ✅ Add it here
  console.log("✅ AdminLayout is rendering");

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2 className="admin-logo">EstateHunt</h2>
        <nav className="admin-nav">
          <NavLink to="/admin" end className="admin-link">📊 Dashboard</NavLink>
          <NavLink to="/admin/posts" className="admin-link">📝 Posts</NavLink>
          <NavLink to="/admin/users" className="admin-link">👥 Users</NavLink>
        </nav>
      </aside>

      <div className="admin-main">
        <AdminTopbar />
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
