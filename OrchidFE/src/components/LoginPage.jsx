import React, { useState } from "react";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  getRoleFromToken,
  mapRoleToRoleId,
  getUsernameFromToken,
} from "../utils/tokenUtils";

function LoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 3) {
      newErrors.password = "Password must be at least 3 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Make API call to your login endpoint
      const response = await axios.post(
        "http://localhost:8080/api/accounts/login",
        {
          username: formData.username,
          password: formData.password,
        }
      );

      // Check if login was successful
      if (response.status === 200 && response.data.token) {
        const token = response.data.token;

        // Parse token to get role and username
        const roleFromToken = getRoleFromToken(token);
        const usernameFromToken = getUsernameFromToken(token);

        console.log("Role from token:", roleFromToken);
        console.log("Username from token:", usernameFromToken);

        // Store authentication state and token
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem(
          "username",
          usernameFromToken || formData.username
        );
        localStorage.setItem("authToken", token);

        // Store role information from token
        if (roleFromToken) {
          const roleId = mapRoleToRoleId(roleFromToken);
          localStorage.setItem("userRole", roleId);
          localStorage.setItem("userRoleName", roleFromToken);
        } else {
          // Fallback to default user role if role not found in token
          localStorage.setItem("userRole", "4");
          localStorage.setItem("userRoleName", "USER");
        }

        // Set default authorization header for future API calls
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        // Redirect based on role
        const userRole = localStorage.getItem("userRole");
        if (userRole === "1" || userRole === "2" || userRole === "3") {
          // Admin roles
          navigate("/");
        } else {
          // User role
          navigate("/home");
        }
      } else {
        setErrors({ general: "Login failed. Please check your credentials." });
      }
    } catch (error) {
      console.error("Login error:", error);

      if (error.response) {
        // Server responded with error status
        if (error.response.status === 401) {
          setErrors({ general: "Invalid username or password." });
        } else if (error.response.status === 400) {
          setErrors({ general: "Please check your input and try again." });
        } else {
          setErrors({
            general: `Login failed: ${
              error.response.data?.message || "Server error"
            }`,
          });
        }
      } else if (error.request) {
        // Network error
        setErrors({ general: "Network error. Please check your connection." });
      } else {
        // Other error
        setErrors({ general: "Login failed. Please try again." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container d-flex align-items-center justify-content-center bg-light min-vh-100">
      <Container>
        <div className="d-flex justify-content-center">
          <div style={{ maxWidth: "400px", width: "100%" }}>
            <Card className="login-card shadow-lg fade-in custom-card">
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <div className="orchid-icon mb-2" style={{ fontSize: 40 }}>
                    🌸
                  </div>
                  <h2 className="fw-bold text-primary mb-2">Welcome Back</h2>
                  <p className="text-muted">
                    Sign in to your Orchid Garden account
                  </p>
                </div>

                {errors.general && (
                  <Alert variant="danger" className="mb-3">
                    {errors.general}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Username</Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Enter your username"
                      isInvalid={!!errors.username}
                      className="py-2 shadow-sm"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.username}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      isInvalid={!!errors.password}
                      className="py-2 shadow-sm"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Check
                      type="checkbox"
                      label="Remember me"
                      className="text-muted"
                    />
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 glass-btn d-flex align-items-center justify-content-center"
                    disabled={isLoading}
                  >
                    <span
                      className="me-2 glass-btn-icon"
                      style={{ fontSize: 22 }}
                    >
                      🔓
                    </span>
                    {isLoading ? "Signing in..." : "Sign In"}
                    <span className="glass-btn-light" />
                  </Button>
                </Form>

                <div className="text-center">
                  <small className="text-muted">
                    Don't have an account?{" "}
                    <Link
                      to="/register"
                      className="text-decoration-none fw-semibold"
                    >
                      Sign up here
                    </Link>
                  </small>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      </Container>
      <style>{`
        .login-container {
          background: linear-gradient(120deg, #e3f2fd 0%, #fce4ec 100%);
          min-height: 100vh;
        }
        .login-card {
          border-radius: 1.5rem;
          border: none;
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.12);
          animation: fadeInLogin 0.7s cubic-bezier(0.4,0,0.2,1);
        }
        .fade-in {
          animation: fadeInLogin 0.7s cubic-bezier(0.4,0,0.2,1);
        }
        @keyframes fadeInLogin {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: none; }
        }
        .custom-card .form-control {
          border-radius: 0.7rem;
          font-size: 1.08rem;
          border: 1.5px solid #e3e7ef;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .custom-card .form-control:focus {
          border-color: #43a047;
          box-shadow: 0 0 0 2px #43a04733;
        }
        .custom-card .btn-primary {
          background: linear-gradient(90deg, #43a047 0%, #66bb6a 100%);
          border: none;
          border-radius: 0.7rem;
          font-size: 1.1rem;
          font-weight: 600;
          padding: 0.7rem 0;
          box-shadow: 0 2px 8px #43a04722;
          transition: background 0.2s, box-shadow 0.2s;
        }
        .custom-card .btn-primary:hover, .custom-card .btn-primary:focus {
          background: linear-gradient(90deg, #388e3c 0%, #43a047 100%);
          box-shadow: 0 4px 16px #43a04733;
        }
        .orchid-icon {
          filter: drop-shadow(0 2px 8px #43a04722);
        }
        .custom-card .form-check-label {
          font-size: 1rem;
        }
        .custom-card .form-check-input:checked {
          background-color: #43a047;
          border-color: #43a047;
        }
        .custom-card .form-check-input:focus {
          box-shadow: 0 0 0 2px #43a04733;
        }
        .custom-card .alert-danger {
          border-radius: 0.7rem;
        }
        .custom-card .form-label {
          font-weight: 500;
        }
        .custom-card .form-control::placeholder {
          color: #b0b8c1;
          opacity: 1;
        }
        .glass-btn {
          position: relative;
          background: rgba(67, 233, 123, 0.18);
          border: 2.5px solid rgba(67, 233, 123, 0.35);
          border-radius: 999px;
          font-size: 1.22rem;
          font-weight: 800;
          padding: 1.1rem 0;
          box-shadow: 0 8px 32px 0 rgba(67, 233, 123, 0.18), 0 2px 8px #38f9d733;
          letter-spacing: 0.03em;
          color: #222;
          overflow: hidden;
          backdrop-filter: blur(8px);
          transition: border 0.3s, box-shadow 0.2s, background 0.2s, color 0.2s, transform 0.13s;
          z-index: 1;
        }
        .glass-btn:hover, .glass-btn:focus {
          border: 2.5px solid;
          border-image: linear-gradient(90deg, #43e97b, #38f9d7, #43e97b) 1;
          box-shadow: 0 12px 36px 0 #38f9d744, 0 2px 16px #43e97b33;
          color: #111;
          transform: scale(1.045);
        }
        .glass-btn:active {
          transform: scale(0.98);
        }
        .glass-btn-light {
          content: '';
          position: absolute;
          left: -75%;
          top: 0;
          width: 50%;
          height: 100%;
          background: linear-gradient(120deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.01) 100%);
          filter: blur(2px);
          opacity: 0.7;
          pointer-events: none;
          transition: left 0.5s cubic-bezier(0.4,0,0.2,1);
          z-index: 2;
        }
        .glass-btn:hover .glass-btn-light {
          left: 120%;
          transition: left 0.7s cubic-bezier(0.4,0,0.2,1);
        }
        .glass-btn-icon {
          display: inline-block;
          transition: transform 0.18s cubic-bezier(0.4,0,0.2,1);
        }
        .glass-btn:hover .glass-btn-icon {
          animation: shakeX 0.4s 1;
        }
        @keyframes shakeX {
          10%, 90% { transform: translateX(-2px); }
          20%, 80% { transform: translateX(4px); }
          30%, 50%, 70% { transform: translateX(-6px); }
          40%, 60% { transform: translateX(6px); }
          100% { transform: none; }
        }
      `}</style>
    </div>
  );
}

export default LoginPage;
