import { defer } from "react-router-dom";
import apiRequest from "./apiRequest";

export const singlePageLoader = async ({ request, params }) => {
  const res = await apiRequest("/posts/" + params.id);
  return res.data;
};
export const listPageLoader = async ({ request, params }) => {
  const query = request.url.split("?")[1];
  console.log("QUERY RECEIVED:", query);
  const postPromise = apiRequest("/posts?" + query);
  return defer({
    postResponse: postPromise,
  });
};

export const profilePageLoader = async () => {
  const postPromise = apiRequest("/users/profilePosts");
  return defer({
    postResponse: postPromise,
  });
};

export const agentPageLoader = async () => {
  const response = await apiRequest.get("/users/agents");
  return {
    agents: response.data,
  };
};

export const agentDetailPageLoader = async ({ params }) => {
  const agentResponse = await apiRequest.get(
    `/users/agents/${params.id}/posts`
  );
  const feedbackResponse = await apiRequest.get(
    `/users/agents/${params.id}/feedback`
  );


  return {
    agent: agentResponse.data.agent,
    posts: agentResponse.data.posts,
    feedbacks: feedbackResponse.data.feedbacks,
  };
};
export const subscriptionPlansLoader = async () => {
  const res = await apiRequest.get("/subscription/plans");

  return {
    plans: res.data,
  };
};
