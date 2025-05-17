import { useEffect, useState } from "react";
import apiRequest from "../../lib/apiRequest";
import "./adminDashboard.scss";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await apiRequest.get("/admin/dashboard-stats");
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching stats:", err);
        setError("Failed to fetch admin stats.");
      }
    };

    fetchStats();
  }, []);

  if (error) return <p>{error}</p>;

  return (
    <div className="admin-dashboard">
      <div className="stats-card">
        <h3>Total Users</h3>
        <p>{stats?.userCount}</p>
      </div>
      <div className="stats-card">
        <h3>Total Agents</h3>
        <p>{stats?.agentCount}</p>
      </div>
      <div className="stats-card">
        <h3>Total Posts</h3>
        <p>{stats?.postCount}</p>
      </div>
    </div>
  );
};
export default AdminDashboard;
