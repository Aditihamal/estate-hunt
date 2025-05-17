import "./homePage.scss";
import SearchBar from "../../components/searchBar/SearchBar";
import Card from "../../components/card/Card";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";

function HomePage() {
  const [posts, setPosts] = useState([]);
 

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await apiRequest.get("/posts?limit=6"); // Fetch 6 posts
        setPosts(res.data);
      } catch (err) {
        console.log("Failed to fetch listings:", err);
      }
    };
    fetchPosts();
  }, []);

 

  return (
<div className="homePage">
  {/* 👇 Grouping text + image together */}
  <div className="heroSection">
    <div className="textContainer">
      <div className="wrapper">
        <h1 className="title">Explore your Dream</h1>
        <p>
          Discover the best real estate deals in your area. Whether you're looking for a new home, an investment property, or commercial space, we have the expertise and listings to help you find exactly what you need.
        </p>
        <SearchBar />
        <div className="boxes">
          {/* <div className="box">
            <h1>16+</h1>
            <h2>Years of Experience</h2>
          </div>
          <div className="box">
            <h1>200</h1>
            <h2>Award Gained</h2>
          </div>
          <div className="box">
            <h1>2000+</h1>
            <h2>Property Ready</h2>
          </div> */}
          
        </div>
      </div>
    </div>
    <div className="imgContainer">
      <img src="/bo.png" alt="" />
    </div>
  </div>

  {/* 👇 Listings section now comes below hero */}
  <div className="featuredListings">
    <div className="wrapper">
      <h2>Featured Listings</h2>
      <div className="cardGrid">
        {posts.length === 0 ? (
          <p>Loading...</p>
        ) : (
          posts.map((post) => <Card key={post.id} item={post} disableSave={true} />)
        )}
      </div>
    </div>
  </div>
</div>

  );
}

export default HomePage;
