import { useContext, useState } from "react";
import "./profileUpdatePage.scss";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import { useNavigate } from "react-router-dom";
import UploadWidget from "../../components/uploadWidget/UploadWidget";

function ProfileUpdatePage() {
  const { currentUser, updateUser } = useContext(AuthContext);
  console.log("🔥 currentUser in Profile Update Page:", currentUser);

  const [error, setError] = useState("");
  const [avatar, setAvatar] = useState([]);

  const navigate = useNavigate();

  const { updateUser: updateAuthUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!currentUser || !currentUser.user?.id) {
      console.error("User not logged in or ID missing");
      return;
    }
  
    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData);
  
    try {
      const res = await apiRequest.put(`/users/${currentUser.user.id}`, {
        username: inputs.username,
        email: inputs.email,
        avatar: avatar || currentUser.user.avatar,
      });
  
      // ✅ Update the context
      updateUser({
        ...currentUser,
        user: {
          ...currentUser.user,
          username: inputs.username,
          email: inputs.email,
          avatar: avatar[0] || currentUser.user.avatar
,
        },
      });
  
      navigate("/profile");
    } catch (err) {
      console.error("Update failed:", err);
    }
  };
  
  

  return (
    <div className="profileUpdatePage">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Update Profile</h1>
          <div className="item">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              defaultValue={currentUser.user.username}
            />
          </div>
          <div className="item">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={currentUser.user.email}
            />
          </div>
          <div className="item">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" />
          </div>
          <button>Update</button>
          {error && <span>error</span>}
        </form>
      </div>
      <div className="sideContainer">
      <img src={currentUser.user.avatar || "noavatar.jpg"} alt="" className="avatar" />
      <UploadWidget
    uwConfig={{
      cloudName: "dm0s3wdln",
      uploadPreset: "ml_default",
    }}
    setState={setAvatar}
  />
      </div>
    </div>
  );
}

export default ProfileUpdatePage;
