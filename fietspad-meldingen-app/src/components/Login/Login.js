import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./Login.module.css";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:2000/api/auth/login", {
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
        localStorage.setItem("token", data.token);
        navigate("/");
      }
    } catch (error) {
      setMessage("Error: Unable to login.");
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <h1>Welcome Back!</h1>
        <p>Log in to report cycle path issues and track your submissions</p>
        <form onSubmit={handleSubmit}>
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
            Login
          </button>
        </form>
        <div className={styles.message}>
          {message && <span>{message}</span>}
        </div>
        <div className={styles.registerPrompt}>
          <p>Don't have an account?</p>
          <Link to="/signup" className={styles.registerLink}>
            Register Now
          </Link>
        </div>
        <div className={styles.forgotPassword}>
          <Link to="/reset-password" className={styles.forgotLink}>
            Forgot Password?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
