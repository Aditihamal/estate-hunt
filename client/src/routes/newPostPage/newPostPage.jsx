import { useState, useEffect } from "react";
import "./newPostPage.scss";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import apiRequest from "../../lib/apiRequest";
import UploadWidget from "../../components/uploadWidget/UploadWidget";
import { useNavigate, useParams } from "react-router-dom";

function NewPostPage() {
  const [value, setValue] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [post, setPost] = useState(null);



  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        try {
          const res = await apiRequest.get(`/posts/${id}`);
          setPost(res.data);
          setValue(res.data.postDetail.desc);
          setImages(res.data.images);
        } catch (err) {
          console.log(err);
        }
      };
      fetchPost();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData);

    if (parseInt(inputs.price) < 0) {
      setError("❌ Price cannot be negative.");
      return;
    }
    if (parseInt(inputs.bedroom) <= 0 || parseInt(inputs.bathroom) <= 0) {
      setError("❌ Bedroom and Bathroom must be at least 1.");
      return;
    }
    if (parseFloat(inputs.latitude) < -90 || parseFloat(inputs.latitude) > 90) {
      setError("❌ Invalid latitude. It must be between -90 and 90.");
      return;
    }
    if (parseFloat(inputs.longitude) < -180 || parseFloat(inputs.longitude) > 180) {
      setError("❌ Invalid longitude. It must be between -180 and 180.");
      return;
    }

    try {
      const res = id
        ? await apiRequest.put(`/posts/${id}`, {
            postData: {
              title: inputs.title,
              price: parseInt(inputs.price),
              address: inputs.address,
              city: inputs.city,
              bedroom: parseInt(inputs.bedroom),
              bathroom: parseInt(inputs.bathroom),
              type: inputs.type,
              property: inputs.property,
              latitude: inputs.latitude,
              longitude: inputs.longitude,
              images: images,
            },
            postDetail: {
              desc: value,
              utilities: inputs.utilities,
              pet: inputs.pet,
              income: inputs.income,
              size: parseInt(inputs.size),
              school: parseInt(inputs.school),
              bus: parseInt(inputs.bus),
              restaurant: parseInt(inputs.restaurant),
            },
          })
        : await apiRequest.post("/posts", {
            postData: {
              title: inputs.title,
              price: parseInt(inputs.price),
              address: inputs.address,
              city: inputs.city,
              bedroom: parseInt(inputs.bedroom),
              bathroom: parseInt(inputs.bathroom),
              type: inputs.type,
              property: inputs.property,
              latitude: inputs.latitude,
              longitude: inputs.longitude,
              images: images,
            },
            postDetail: {
              desc: value,
              utilities: inputs.utilities,
              pet: inputs.pet,
              income: inputs.income,
              size: parseInt(inputs.size),
              school: parseInt(inputs.school),
              bus: parseInt(inputs.bus),
              restaurant: parseInt(inputs.restaurant),
            },
          });
          navigate("/post/" + res.data.id);

    }catch (err) {
      console.error("Post creation failed:", err);
      if (err.response && err.response.status === 403) {
        setError(err.response.data.message); // Show backend error
      } else {
        setError("Something went wrong while posting. Please try again.");
      }
    }
    
  };
  const handleRemoveImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
  };
  

  return (
    <div className="newPostPage">
      <div className="formContainer">
        <h1>{id ? "Edit Post" : "Add New Post"}</h1>
        <div className="wrapper">
          <form onSubmit={handleSubmit}>
            <div className="item">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                name="title"
                type="text"
                defaultValue={post?.title || ""}
              />
            </div>
            <div className="item">
              <label htmlFor="price">Price</label>
              <input
                id="price"
                name="price"
                type="number"
                defaultValue={post?.price || ""}
              />
            </div>
            <div className="item">
              <label htmlFor="address">Address</label>
              <input
                id="address"
                name="address"
                type="text"
                defaultValue={post?.address || ""}
              />
            </div>
            <div className="item description">
              <label htmlFor="desc">Description</label>
              <ReactQuill theme="snow" onChange={setValue} value={value} />
            </div>
            <div className="item">
              <label htmlFor="city">City</label>
              <input
                id="city"
                name="city"
                type="text"
                defaultValue={post?.city || ""}
              />
            </div>
            <div className="item">
              <label htmlFor="bedroom">Bedroom Number</label>
              <input
                min={1}
                id="bedroom"
                name="bedroom"
                type="number"
                defaultValue={post?.bedroom || ""}
              />
            </div>
            <div className="item">
              <label htmlFor="bathroom">Bathroom Number</label>
              <input
                min={1}
                id="bathroom"
                name="bathroom"
                type="number"
                defaultValue={post?.bathroom || ""}
              />
            </div>
            <div className="item">
              <label htmlFor="latitude">Latitude</label>
              <input
                id="latitude"
                name="latitude"
                type="text"
                defaultValue={post?.latitude || ""}
              />
            </div>
            <div className="item">
              <label htmlFor="longitude">Longitude</label>
              <input
                id="longitude"
                name="longitude"
                type="text"
                defaultValue={post?.longitude || ""}
              />
            </div>
            <div className="item">
              <label htmlFor="type">Type</label>
              <select name="type" defaultValue={post?.type || "rent"}>
                <option value="rent">Rent</option>
                <option value="buy">Buy</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="property">Property</label>
              <select
                name="property"
                defaultValue={post?.property || "apartment"}
              >
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="condo">Condo</option>
                <option value="land">Land</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="utilities">Utilities Policy</label>
              <select
                name="utilities"
                defaultValue={post?.postDetail?.utilities || "owner"}
              >
                <option value="owner">Owner is responsible</option>
                <option value="tenant">Tenant is responsible</option>
                <option value="shared">Shared</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="pet">Pet Policy</label>
              <select
                name="pet"
                defaultValue={post?.postDetail?.pet || "allowed"}
              >
                <option value="allowed">Allowed</option>
                <option value="not-allowed">Not Allowed</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="income">Income Policy</label>
              <input
                id="income"
                name="income"
                type="text"
                placeholder="Income Policy"
                defaultValue={post?.postDetail?.income || ""}
              />
            </div>
            <div className="item">
              <label htmlFor="size">Total Size (sqft)</label>
              <input
                min={0}
                id="size"
                name="size"
                type="number"
                defaultValue={post?.postDetail?.size || ""}
              />
            </div>
            <div className="item">
              <label htmlFor="school">School</label>
              <input
                min={0}
                id="school"
                name="school"
                type="number"
                defaultValue={post?.postDetail?.school || ""}
              />
            </div>
            <div className="item">
              <label htmlFor="bus">Bus</label>
              <input
                min={0}
                id="bus"
                name="bus"
                type="number"
                defaultValue={post?.postDetail?.bus || ""}
              />
            </div>
            <div className="item">
              <label htmlFor="restaurant">Restaurant</label>
              <input
                min={0}
                id="restaurant"
                name="restaurant"
                type="number"
                defaultValue={post?.postDetail?.restaurant || ""}
              />
            </div>
            <button className="sendButton">{id ? "Update" : "Add"}</button>
            {error  && (
  <div style={{
    marginTop: "20px",
    padding: "12px 16px",
    backgroundColor: "#fff3cd",
    border: "1px solid #ffeeba",
    color: "#856404",
    borderRadius: "6px",
    fontWeight: "500"
  }}>
    🚫 {error.includes("subscribe") ? (
      <>
        {error} Please <a href="/subscribe" style={{ textDecoration: "underline", color: "#856404" }}>subscribe</a> to continue posting.
      </>
    ) : error}
  </div>
)}

          </form>
        </div>
      </div>
      <div className="sideContainer">
      {images.map((image, index) => (
  <div key={index} className="imagePreview">
    <img src={image} alt="preview" />
    <button type="button" onClick={() => handleRemoveImage(index)}>×</button>
  </div>
))}

        <UploadWidget
          uwConfig={{
            multiple: true,
            cloudName: "dm0s3wdln",
            uploadPreset: "ml_default",
            folder: "posts",
          }}
          setState={setImages}
        />
      </div>
    </div>
  );
}

export default NewPostPage;
