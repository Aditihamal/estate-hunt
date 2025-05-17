import "./singlePage.scss";
import Slider from "../../components/slider/Slider";
import Map from "../../components/map/Map";
import { useNavigate, useLoaderData } from "react-router-dom";
import DOMPurify from "dompurify";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";


function SinglePage() {
  const post = useLoaderData();
  const [saved, setSaved] = useState(post.isSaved);
  const { currentUser } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyInputs, setReplyInputs] = useState({});
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [editingReply, setEditingReply] = useState(null);
const [newReplyContent, setNewReplyContent] = useState("");



  const fetchComments = async () => {
    try {
      const res = await apiRequest.get(`/comments/${post.id}`);
      setComments(res.data);
    } catch (err) {
      console.error("Failed to load comments:", err);
    }
  };
  
  useEffect(() => {
    fetchComments();
  }, [post.id]);


  const navigate = useNavigate();

  useEffect(() => {
    setSaved(post.isSaved);
  }, [post.isSaved]);

  const handleSave = async () => {
    if (!currentUser) {
      navigate("/login");
      return;

    }
    setSaved((prev) => !prev);
    try {
      await apiRequest.post("/users/save", { postId: post.id });
    } catch (err) {
      console.log(err);
      setSaved((prev) => !prev);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
  
    if (!currentUser || !currentUser.token) {
      // Redirect to login if not authenticated
      navigate("/login");
      return;
    }
  
    try {
      console.log("Sending comment with token:", currentUser.token);
  
      await apiRequest.post("/comments", {
        postId: post.id,
        content: newComment,
      });
  
      // Optionally: refresh comments or add the new comment to state
      setNewComment(""); // clear textarea
      // You can also refetch comments if needed
      fetchComments(); // if you have this function
    } catch (err) {
      console.error("Failed to post comment:", err);
    }
  };
  const handleEditClick = (comment) => {
    setEditingCommentId(comment.id);
    setEditContent(comment.content);
  };
  
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiRequest.patch(`/comments/${editingCommentId}`, {
        content: editContent,
      });
      setEditingCommentId(null);
      setEditContent("");
      const res = await apiRequest.get(`/comments/${post.id}`);
      setComments(res.data);
    } catch (err) {
      console.error("Failed to update comment:", err);
    }
  };
  
  const handleDelete = async (commentId) => {
    try {
      await apiRequest.delete(`/comments/${commentId}`);
      const res = await apiRequest.get(`/comments/${post.id}`);
      setComments(res.data);
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  };
  

  const handleEditReplyClick = (replyId, currentContent) => {
    setEditingReply(replyId);
    setNewReplyContent(currentContent);
  };
  
  const handleReplyEditSubmit = async (e, replyId) => {
    e.preventDefault();
    try {
      await apiRequest.patch(`/replies/${replyId}`, {
        content: newReplyContent,
      });
      setEditingReply(null);
      setNewReplyContent("");
      fetchComments(); // Refresh after edit
    } catch (err) {
      console.error("Failed to update reply:", err);
    }
  };
  
  
  const handleDeleteReply = async (replyId) => {
    try {
      await apiRequest.delete(`/replies/${replyId}`);
      // Optionally refetch comments and replies after successful deletion
    } catch (err) {
      console.error("Failed to delete reply:", err);
    }
  };
  const handleReplySubmit = async (e, commentId) => {
    e.preventDefault();
  
    const replyContent = replyInputs[commentId];
    if (!replyContent || replyContent.trim() === "") return;
  
    try {
      await apiRequest.post("/replies", {
        commentId,
        content: replyContent,
      });
  
      // Clear the reply input after successful submission
      setReplyInputs((prev) => ({ ...prev, [commentId]: "" }));
  
      // Refresh the comments with updated replies
      fetchComments();
    } catch (err) {
      console.error("❌ Failed to post reply:", err);
    }
  };
  
  
  return (
    <div className="singlePage">
      <div className="details">
        <div className="wrapper">
          <Slider images={post.images} />
          <div className="info">
            <div className="top">
              <div className="post">
                <h1>{post.title}</h1>
                <div className="address">
                  <img src="/pin.png" alt="" />
                  <span>{post.address}</span>
                </div>
                <div className="price">NPR {post.price}</div>
              </div>
              <div className="user">
              <img src={post?.user?.avatar || "/noavatar.jpg"} alt="User" />

                <span>{post.user.username}</span>
              </div>
            </div>
            <div
              className="bottom"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(post.postDetail.desc),
              }}
            ></div>
          </div>
        </div>
      </div>
      <div className="features">
        <div className="wrapper">
          <p className="title">General</p>
          <div className="listVertical">
            <div className="feature">
              <img src="/utility.png" alt="" />
              <div className="featureText">
                <span>Utilities</span>
                {post.postDetail.utilities === "owner" ? (
                  <p>Owner is responsible</p>
                ) : (
                  <p>Tenant is responsible</p>
                )}
              </div>
            </div>
            <div className="feature">
              <img src="/pet.png" alt="" />
              <div className="featureText">
                <span>Pet Policy</span>
                {post.postDetail.pet === "allowed" ? (
                  <p>Pets Allowed</p>
                ) : (
                  <p>Pets not Allowed</p>
                )}
              </div>
            </div>
            <div className="feature">
              <img src="/fee.png" alt="" />
              <div className="featureText">
                <span>Income Policy</span>
                <p>{post.postDetail.income}</p>
              </div>
            </div>
          </div>
          <p className="title">Sizes</p>
          <div className="sizes">
            <div className="size">
              <img src="/size.png" alt="" />
              <span>{post.postDetail.size} sqft</span>
            </div>
            <div className="size">
              <img src="/bed.png" alt="" />
              <span>{post.bedroom} beds</span>
            </div>
            <div className="size">
              <img src="/bath.png" alt="" />
              <span>{post.bathroom} bathroom</span>
            </div>
          </div>
          <p className="title">Nearby Places</p>
          <div className="listHorizontal">
            <div className="feature">
              <img src="/school.png" alt="" />
              <div className="featureText">
                <span>School</span>
                <p>
                  {post.postDetail.school > 999
                    ? post.postDetail.school / 1000 + "km"
                    : post.postDetail.school + "m"}{" "}
                  away
                </p>
              </div>
            </div>
            <div className="feature">
              <img src="/pet.png" alt="" />
              <div className="featureText">
                <span>Bus Stop</span>
                <p>{post.postDetail.bus}m away</p>
              </div>
            </div>
            <div className="feature">
              <img src="/fee.png" alt="" />
              <div className="featureText">
                <span>Restaurant</span>
                <p>{post.postDetail.restaurant}m away</p>
              </div>
            </div>
          </div>
          <p className="title">Location</p>
          <div className="mapContainer">
            <Map items={[post]} />
          </div>
          <div className="buttons">
            <button
              onClick={handleSave}
              style={{
                backgroundColor: saved ? "#fece51" : "white",
              }}
            >
              <img src="/save.png" alt="" />
              {saved ? "Place Saved" : "Save the Place"}
            </button>
          </div>
        </div>
      </div>
   
      <div className="commentSection">
  <h3>Comments</h3>
  <form onSubmit={handleCommentSubmit}>
    <textarea
      value={newComment}
      onChange={(e) => setNewComment(e.target.value)}
      placeholder="Write a comment..."
    />
    <button type="submit">Post</button>
  </form>

  <div className="commentList">
    {comments.length === 0 ? (
      <p>No comments yet.</p>
    ) : (
      comments.map((c) => {
       

        return (
          <div className="comment" key={c.id}>
            
            <b>
              {c.user?.username}
              {c.user?.userType === "Agent" && (
                <span className="agentTag"> (Agent)</span>
              )}
            </b>

            {editingCommentId === c.id ? (
              <form onSubmit={handleEditSubmit} className="editForm">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />
                <button type="submit">Save</button>
                <button type="button" onClick={() => setEditingCommentId(null)}>
                  Cancel
                </button>
              </form>
            ) : (
              <>
                <p>{c.content}</p>
                <small>{new Date(c.createdAt).toLocaleString()}</small>
              </>
            )}

            {String(currentUser?.user?.id) === String(c.userId) &&
              editingCommentId !== c.id && (
                <div className="commentActions">
                  <button onClick={() => handleEditClick(c)}>Edit</button>
                  <button onClick={() => handleDelete(c.id)}>Delete</button>
                </div>
            )}
            <div className="replies">
              {c.replies && c.replies.length > 0 && (
                <div className="replyList">
                  {c.replies.map((r) => (
                    
                    <div className="reply" key={r.id}>
                      <p>
                        <b>
                          {r.agent?.username || "Agent"}
                          {r.agent?.userType === "Agent" && (
                            <span className="agentTag"> (Agent)</span>
                          )}
                        </b>{" "}
                        {r.content}
                      </p>
                      <small>{new Date(r.createdAt).toLocaleString()}</small>

                      {currentUser?.user?.id === r.agent?.id && (
                        <div className="actions">
                          {/* <button onClick={() => handleEditReplyClick(r.id, r.content)}>Edit</button>
                          <button onClick={() => handleDeleteReply(r.id)}>Delete</button> */}
                        </div>
                      )}


                      {editingReply === r.id && (
                        <form onSubmit={(e) => handleReplyEditSubmit(e, r.id)}>
                          <input
                            type="text"
                            value={newReplyContent}
                            onChange={(e) =>
                              setNewReplyContent(e.target.value)
                            }
                            placeholder="Edit your reply..."
                          />
                          <button type="submit">Save</button>
                        </form>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {currentUser?.user?.userType === "Agent" && (
                <form
                  onSubmit={(e) => handleReplySubmit(e, c.id)}
                  className="replyForm"
                >
                  <input
                    type="text"
                    placeholder="Write a reply..."
                    value={replyInputs[c.id] || ""}
                    onChange={(e) =>
                      setReplyInputs({
                        ...replyInputs,
                        [c.id]: e.target.value,
                      })
                    }
                  />
                  <button type="submit">Reply</button>
                </form>
              )}
            </div>
          </div>
        );
      })
    )}
         </div>
      </div>
    </div> // ✅ This closes the top-level <div className="singlePage">
  );
}

export default SinglePage;
