import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./card.scss";

function Card({item, onDelete, onSave, onEdit, disableSave = false }) {
  console.log("Rendering Card for item:", item);

  if (!item) return null;

  const { currentUser } = useContext(AuthContext);
  const [saved, setSaved] = useState(item.isSaved);
  const navigate = useNavigate();

  useEffect(() => {
    setSaved(item.isSaved);
  }, [item.isSaved]);
  // console.log("item.userId", item.userId);
  // console.log("currentUser.id", currentUser?.id);
  // console.log("Full currentUser:", currentUser);


  const handleSave = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    setSaved((prev) => !prev);
    try {
      await onSave(item.id, saved);
    } catch (err) {
      console.log(err);
      setSaved((prev) => !prev);
    }
  };
  

  return (
    <div className="card">
      <Link to={`/post/${item.id}`} className="imageContainer">
        <img src={item.images[0]} alt="" />
      </Link>
      <div className="textContainer">
        <h2 className="title">
          <Link to={`/post/${item.id}`}>{item.title}</Link>
        </h2>
        <p className="address">
          <img src="/pin.png" alt="" />
          <span>{item.address}</span>
        </p>
        <p className="price">NPR {item.price}</p>
        <div className="bottom">
          <div className="features">
            <div className="feature">
              <img src="/bed.png" alt="" />
              <span>{item.bedroom} bedroom</span>
            </div>
            <div className="feature">
              <img src="/bath.png" alt="" />
              <span>{item.bathroom} bathroom</span>
            </div>
          </div>
          <div className="icons">
          {currentUser && item.userId === currentUser.user.id ? (


              <>
                <button className="icon" onClick={() => navigate(`/edit/${item.id}`)}>
                  <img src="./edit.png" alt="" />
                  <span>Edit</span>
                </button>


                <button className="icon" onClick={() => onDelete(item.id)}>
                  <img src="./delete.png" alt="" />
                  <span>Delete</span>
                </button>
              </>
           ) : (
            !disableSave && (
              <button
                className="icon"
                onClick={handleSave}
                style={{
                  backgroundColor: saved ? "#fece51" : "white",
                }}
              >
                <img src="./save.png" alt="" />
                <span>{saved ? "Saved" : "Save"}</span>
              </button>
            )
          )}
          
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
