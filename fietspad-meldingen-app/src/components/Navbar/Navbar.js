import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";
import { getUsernameFromToken } from "../../utils/jwtUtils";

const Navbar = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState(null);
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    // Get JWT token (from local storage, API, or cookies)
    const token = localStorage.getItem("token");

    if (token) {
      const extractedUsername = getUsernameFromToken(token);
      setUsername(extractedUsername);
      console.log(extractedUsername);
    }
  }, []);

  return (
    <nav className={styles.navbar}>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
      </ul>
      {token && (
        <ul>
          {username == "Admin" ? (
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
          ) : (
            <li>
              <Link to="/map">Map</Link>
            </li>
          )}
        </ul>
      )}
      <ul>
        <li>
          {!token ? (
            <Link to="/login">Login</Link>
          ) : (
            <button onClick={handleLogout} className={styles.logoutButton}>
              Logout
            </button>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
