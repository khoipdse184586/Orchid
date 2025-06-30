import React, { useState } from "react";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { FaUser, FaEnvelope, FaLock, FaSignInAlt } from "react-icons/fa";

function RegisterPage() {
  const [formData, setFormData] = useState({
    accountName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
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
    // Clear success message when user starts typing
    if (successMessage) {
      setSuccessMessage("");
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Account Name validation
    if (!formData.accountName.trim()) {
      newErrors.accountName = "Account name is required";
    } else if (formData.accountName.trim().length < 2) {
      newErrors.accountName = "Account name must be at least 2 characters";
    } else if (formData.accountName.trim().length > 50) {
      newErrors.accountName = "Account name must be less than 50 characters";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 3) {
      newErrors.password = "Password must be at least 3 characters";
    } else if (formData.password.length > 50) {
      newErrors.password = "Password must be less than 50 characters";
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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
    setErrors({});
    setSuccessMessage("");

    try {
      // Make API call to your register endpoint
      const response = await axios.post(
        "http://localhost:8080/api/accounts/register",
        {
          accountName: formData.accountName.trim(),
          email: formData.email.trim(),
          password: formData.password,
        }
      );

      // Check if registration was successful
      if (response.status === 200 && response.data.accountId) {
        setSuccessMessage(
          "Registration successful! You can now login with your credentials."
        );

        // Clear form data
        setFormData({
          accountName: "",
          email: "",
          password: "",
          confirmPassword: "",
        });

        // Redirect to login page after 2 seconds
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setErrors({ general: "Registration failed. Please try again." });
      }
    } catch (error) {
      console.error("Registration error:", error);

      if (error.response) {
        // Server responded with error status
        if (error.response.status === 400) {
          setErrors({
            general: "Invalid input data. Please check your information.",
          });
        } else if (error.response.status === 409) {
          setErrors({ general: "Account with this email already exists." });
        } else if (error.response.status === 422) {
          setErrors({ general: "Validation failed. Please check your input." });
        } else {
          setErrors({
            general: `Registration failed: ${
              error.response.data?.message || "Server error"
            }`,
          });
        }
      } else if (error.request) {
        // Network error
        setErrors({ general: "Network error. Please check your connection." });
      } else {
        // Other error
        setErrors({ general: "Registration failed. Please try again." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container d-flex align-items-center justify-content-center bg-light min-vh-100">
      <Container>
        <div className="d-flex justify-content-center">
          <div style={{ maxWidth: "450px", width: "100%" }}>
            <Card className="login-card shadow-lg fade-in custom-card">
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <div className="orchid-icon mb-2" style={{ fontSize: 40 }}>
                    🌸
                  </div>
                  <h2 className="fw-bold text-primary mb-2">Create Account</h2>
                  <p className="text-muted">Join Orchid Garden today</p>
                </div>

                {errors.general && (
                  <Alert variant="danger" className="mb-3">
                    {errors.general}
                  </Alert>
                )}

                {successMessage && (
                  <Alert variant="success" className="mb-3">
                    {successMessage}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold d-flex align-items-center">
                      <FaUser className="me-2" />
                      Account Name
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="accountName"
                      value={formData.accountName}
                      onChange={handleChange}
                      placeholder="Enter your account name"
                      isInvalid={!!errors.accountName}
                      className="py-2 shadow-sm"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.accountName}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold d-flex align-items-center">
                      <FaEnvelope className="me-2" />
                      Email Address
                    </Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email address"
                      isInvalid={!!errors.email}
                      className="py-2 shadow-sm"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold d-flex align-items-center">
                      <FaLock className="me-2" />
                      Password
                    </Form.Label>
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
                    <Form.Label className="fw-semibold d-flex align-items-center">
                      <FaLock className="me-2" />
                      Confirm Password
                    </Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      isInvalid={!!errors.confirmPassword}
                      className="py-2 shadow-sm"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.confirmPassword}
                    </Form.Control.Feedback>
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
                      📝
                    </span>
                    {isLoading ? "Signing up..." : "Sign Up"}
                    <span className="glass-btn-light" />
                  </Button>
                </Form>

                <div className="text-center">
                  <small className="text-muted">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="text-decoration-none fw-semibold"
                    >
                      Sign in here
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
        .custom-card .alert-danger, .custom-card .alert-success {
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
          background: rgba(255, 94, 98, 0.16);
          border: 2.5px solid rgba(255, 94, 98, 0.32);
          border-radius: 999px;
          font-size: 1.22rem;
          font-weight: 800;
          padding: 1.1rem 0;
          box-shadow: 0 8px 32px 0 rgba(255, 94, 98, 0.18), 0 2px 8px #ff5e6233;
          letter-spacing: 0.03em;
          color: #fff;
          overflow: hidden;
          backdrop-filter: blur(8px);
          transition: border 0.3s, box-shadow 0.2s, background 0.2s, color 0.2s, transform 0.13s;
          z-index: 1;
        }
        .glass-btn:hover, .glass-btn:focus {
          border: 2.5px solid;
          border-image: linear-gradient(90deg, #ff9966, #ff5e62, #ff9966) 1;
          box-shadow: 0 12px 36px 0 #ff5e6244, 0 2px 16px #ff996633;
          color: #fff;
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

export default RegisterPage;
