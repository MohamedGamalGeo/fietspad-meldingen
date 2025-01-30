import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./Signup.module.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:2000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.status === 400) {
        setMessage(data.error);
      } else {
        navigate("/login");
      }
    } catch (error) {
      setMessage(error);
    }
  };

  return (
    <div className={styles.signupContainer}>
      <div className={styles.signupBox}>
        <h1>Join Us!</h1>
        <p>Create an account to report and track cycle path issues</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className={styles.inputField}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className={styles.inputField}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className={styles.inputField}
            required
          />
          <button type="submit" className={styles.submitButton}>
            Signup
          </button>
        </form>
        <div className={styles.message}>
          {message && <span>{message}</span>}
        </div>
        <div className={styles.loginPrompt}>
          <p>Already have an account?</p>
          <Link to="/login" className={styles.loginLink}>
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
