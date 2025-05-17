import { Link, useLoaderData } from "react-router-dom";
import "./agentDetailPage.scss";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";

function AgentDetailPage() {
  const { agent, posts, feedbacks } = useLoaderData();
  const { currentUser } = useContext(AuthContext);

  const [feedback, setFeedback] = useState("");
  const [feedbackList, setFeedbackList] = useState(feedbacks);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    if (!agent?.id) {
      console.error("Agent ID is undefined.");
      return;
    }

    if (!currentUser?.id) {
      console.error(
        "Current User ID is undefined. User might not be logged in."
      );
      return;
    }

    try {
      const response = await apiRequest.post(
        `/users/agents/${agent.id}/feedback`,
        {
          content: feedback,
          user: currentUser,
        }
      );

      setFeedbackList([...feedbackList, response.data]);
      setFeedback(""); // Clear input after successful submission
    } catch (err) {
      console.error("Failed to submit feedback:", err);
    }
  };

  return (
    <div className="agentDetailPage">
      <div className="agentInfo">
        <img src={agent.avatar || "/noavatar.jpg"} alt={agent.username} />
        <h1>{agent.username}</h1>
        <p>{agent.email}</p>
      </div>

      <div className="agentPosts">
        {posts.length === 0 ? (
          <h2 className="noProperties">No properties listed yet.</h2>
        ) : (
          <div>
            <h2>Posted Properties</h2>
            <div className="postList">
              {posts.map((post) => (
                <Link to={`/post/${post.id}`} key={post.id} className="postCard">
                  <div className="imageContainer">
                    <img src={post.images[0]} alt={post.title} />
                  </div>
                  <div className="textContainer">
                    <h3>{post.title}</h3>
                    <p className="address">
                      <img src="/pin.png" alt="Location" />
                      <span>{post.address}</span>
                    </p>
                    <p className="price">$ {post.price}</p>
                    <div className="features">
                      <div className="feature">
                        <img src="/bed.png" alt="Bedroom" />
                        <span>{post.bedroom} bedroom</span>
                      </div>
                      <div className="feature">
                        <img src="/bath.png" alt="Bathroom" />
                        <span>{post.bathroom} bathroom</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* <div className="feedbackSection">
        {currentUser?.userType === "Buyer" && (
          <div>
            <h2>Leave Feedback</h2>
            <form onSubmit={handleFeedbackSubmit} className="feedbackForm">
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Write your feedback..."
                required
              />
              <button type="submit">Submit</button>
            </form>
          </div>
        )}
        <div className="feedbackList">
          <h2>Feedback from Buyers</h2>
          {feedbackList.length === 0 ? (
            <p className="noFeedback">No feedback available.</p>
          ) : (
            <div className="feedbackContainer">
              {feedbackList.map((fb) => (
                <div key={fb.id} className="feedbackCard">
                  <img
                    src={fb.user.avatar || "/noavatar.jpg"}
                    alt={fb.user.username}
                  />
                  <div className="feedbackText">
                    <h3>{fb.user.username}</h3>
                    <p>{fb.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div> */}
    </div>
  );
}

export default AgentDetailPage;
