import "./listPage.scss";
import Filter from "../../components/filter/Filter";
import Card from "../../components/card/Card";
import Map from "../../components/map/Map";
import { Await, useLoaderData, useNavigate } from "react-router-dom";
import { Suspense, useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";

function ListPage() {
  const data = useLoaderData();
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [sortOrder, setSortOrder] = useState("default");
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }, []);

  const handleSave = async (postId, isSaved) => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    try {
      await apiRequest.post("/users/save", { postId });
      navigate(0); // Refresh the page to update the saved status
    } catch (err) {
      console.log(err);
    }
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  const sortPosts = (posts) => {
    if (sortOrder === "high-to-low") {
      return posts.sort((a, b) => b.price - a.price);
    } else if (sortOrder === "low-to-high") {
      return posts.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "nearest" && userLocation) {
      return posts.sort(
        (a, b) =>
          calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            a.latitude,
            a.longitude
          ) -
          calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            b.latitude,
            b.longitude
          )
      );
    } else if (sortOrder === "farthest" && userLocation) {
      return posts.sort(
        (a, b) =>
          calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            b.latitude,
            b.longitude
          ) -
          calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            a.latitude,
            a.longitude
          )
      );
    }
    return posts;
  };

  return (
    <div className="listPage">
      <div className="listContainer">
        <div className="wrapper">
          <Filter />
          <div className="sortOptions">
            <label htmlFor="sort">Sort by:</label>
            <select id="sort" value={sortOrder} onChange={handleSortChange}>
              <option value="default">Default</option>
              <option value="high-to-low">Price: High to Low</option>
              <option value="low-to-high">Price: Low to High</option>
              <option value="nearest">Distance: Nearest</option>
              <option value="farthest">Distance: Farthest</option>
            </select>
          </div>
          <Suspense fallback={<p>Loading...</p>}>
          <Await resolve={data.postResponse} errorElement={<p>Error loading posts!</p>}>
            {(postResponse) => {
              const validPosts = Array.isArray(postResponse.data)
                ? postResponse.data.filter((post) => post && post.id)
                : [];

              const sortedPosts = sortPosts(validPosts); // ✅ apply sorting

              return sortedPosts.map((post) => (
                <Card key={post.id} item={post} onSave={handleSave} />
              ));
            }}
          </Await>



          </Suspense>
        </div>
      </div>
      <div className="mapContainer">
        <Suspense fallback={<p>Loading...</p>}>
          <Await
            resolve={data.postResponse}
            errorElement={<p>Error loading posts!</p>}
          >
            {(postResponse) => <Map items={postResponse.data} />}
          </Await>
        </Suspense>
      </div>
    </div>
  );
}

export default ListPage;
