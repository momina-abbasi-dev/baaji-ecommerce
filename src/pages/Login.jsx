import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { loginUser } from "../api";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const data = await loginUser(formData);

      if (data.token) {
        localStorage.setItem("token", data.token);
        login(data);
        setSuccess("Login successful!");
        navigate(data.role === "admin" ? "/admin" : "/");
      } else {
        setError("Invalid response from server.");
      }
    } catch (err) {
      setError(err.message || "Invalid email or password.");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <h2>Welcome Back</h2>
        <p className="auth-subtitle">Log in to continue your journey</p>

        {error && <p className="auth-error">{error}</p>}
        {success && <p className="auth-success">{success}</p>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Login</button>
        </form>

        <p className="auth-link">
          Don’t have an account? <Link to="/signup">Create one</Link>
        </p>
      </div>
    </div>
  );
}

export default Login