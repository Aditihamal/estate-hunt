import { useEffect, useState } from "react";
import apiRequest from "../../lib/apiRequest";

const AdminPosts = () => {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const res = await apiRequest.get("/admin/posts");
      setPosts(res.data);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await apiRequest.delete(`/admin/posts/${id}`);
      fetchPosts(); // refresh
    } catch (err) {
      console.error("Failed to delete post:", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div>
      <h2>All Posts</h2>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Title</th>
            <th>City</th>
            <th>Price</th>
            <th>Posted By</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((p) => (
            <tr key={p.id}>
              <td>{p.title}</td>
              <td>{p.city}</td>
              <td>{p.price}</td>
              <td>{p.user?.username}</td>
              <td>
                <button onClick={() => handleDelete(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPosts;
