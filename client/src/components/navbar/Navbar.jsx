import { useContext, useState } from "react";
import "./navbar.scss";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function Navbar() {
  const [open, setOpen] = useState(false);
  const { currentUser } = useContext(AuthContext);
  <Link to="/ContactData">Contact</Link>;

  return (
    <nav>
      <div className="left">
        <a href="/" className="logo">
          <img src="/logo.png" alt="logo" />
          <span>EstateHunt</span>
        </a>
        <a href="/">Home</a>
        <a href="/agents">Agents</a>
      </div>
      <div className="right">
        {currentUser ? (
          <div className="user">
            <img src={currentUser?.user?.avatar || "/noavatar.jpg"} alt="" />
            <span>{currentUser?.user?.username}</span>

            <Link to="/profile" className="profile">
              <span>Profile</span>
            </Link>
          </div>
        ) : (
          <>
            <a href="/login"  className="register">Log in</a>
            <a href="/register" className="register">
              Sign up
            </a>
          </>
        )}
        {currentUser && (
          <Link to="/subscribe" className="subscribeBtn">
          <span>Subscribe</span>
        </Link>
        
        )}

        <div className="menuIcon">
          <img
            src="/menu.png"
            alt=""
            onClick={() => setOpen((prev) => !prev)}
          />
        </div>
        <div className={open ? "menu active" : "menu"}>
          <a href="/">Home</a>
          <a href="/agents">Agents</a>
          <a href="/">Log in</a>
          <a href="/">Sign up</a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
