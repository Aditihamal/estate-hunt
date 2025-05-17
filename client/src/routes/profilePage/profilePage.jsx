import List from "../../components/list/List";
import "./profilePage.scss";
import apiRequest from "../../lib/apiRequest";
import { Await, Link, useLoaderData, useNavigate } from "react-router-dom";
import { Suspense, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function ProfilePage() {
  const data = useLoaderData();
  const { updateUser, currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  console.log("Current User:", currentUser);

  const handleLogout = async () => {
    try {
      await apiRequest.post("/auth/logout");
      updateUser(null);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (postId) => {
    console.log(postId);
    try {
      await apiRequest.delete(`/posts/${postId}`);
      navigate(0);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSave = async (postId, isSaved) => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    try {
      await apiRequest.post("/users/save", { postId });
      navigate(0);
    } catch (err) {
      console.log(err);
    }
  };
  const handleEdit = (postId) => {
    navigate(`/edit-post/${postId}`);
  };

  return (
    <div className="profilePage">
      <div className="details">
        <div className="wrapper">
          <div className="title">
            <h1>User Information</h1>
            <Link to="/profile/update">
              <button>Update Profile</button>
            </Link>
          </div>
          <div className="info">
            <span>
              Avatar:
              <img src={currentUser?.user?.avatar || "noavatar.jpg"} alt="" />
            </span>
            <span>
              Username: <b>{currentUser.user.username}</b>
            </span>
            <span>
              E-mail: <b>{currentUser.user.email}</b>
            </span>
            <span>
              User Type: <b>{currentUser.user.userType}</b>
            </span>
            <button onClick={handleLogout}>Logout</button>
          </div>

          {/* Allow only Agents to create a post */}
          {currentUser.user.userType === "Agent" && (
            <div className="title">
              <h1>My List</h1>
              <Link to="/add">
                <button>Create New Post</button>
              </Link>
            </div>
          )}

          

          <Suspense fallback={<p>Loading...</p>}>
            <Await
              resolve={data.postResponse}
              errorElement={<p>Error loading posts!</p>}
            >
              {(postResponse) => (
                <List
                  posts={postResponse.data.userPosts}
                  onDelete={handleDelete}
                  onSave={handleSave}
                  onEdit={(postId) => navigate(`/edit-post/${postId}`)} 
                />
              )}
            </Await>
          </Suspense>

          <div className="title">
            <h1>Saved List</h1>
          </div>
          <Suspense fallback={<p>Loading...</p>}>
            <Await
              resolve={data.postResponse}
              errorElement={<p>Error loading posts!</p>}
            >
              {(postResponse) => (
                <List
                  posts={postResponse.data.savedPosts}
                  onDelete={handleDelete}
                  onSave={handleSave}
                />
              )}
            </Await>
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
