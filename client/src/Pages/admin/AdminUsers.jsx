import { useEffect, useState, useContext } from "react";
import apiRequest from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";
import "./adminUsers.scss"; // optional styling

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const { currentUser } = useContext(AuthContext);

  const fetchUsers = async () => {
    try {
      const res = await apiRequest.get("/admin/users", {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    const confirm = window.confirm("Are you sure you want to delete this user?");
    if (!confirm) return;

    try {
      await apiRequest.delete(`/admin/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      });
      setUsers(users.filter((u) => u.id !== userId));
    } catch (err) {
      console.error("Failed to delete user", err);
    }
  };

  return (
    <div className="adminUsers">
      <h2>All Users</h2>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>User Type</th>
            <th>Joined</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.userType}</td>
              <td>{new Date(u.createdAt).toLocaleDateString()}</td>
              <td>
                <button onClick={() => handleDelete(u.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminUsers;
