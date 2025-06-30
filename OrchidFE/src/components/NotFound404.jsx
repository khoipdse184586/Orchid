import React from "react";
import { Button } from "react-bootstrap";
import { FaExclamationTriangle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function NotFound404() {
  const navigate = useNavigate();
  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light">
      <FaExclamationTriangle size={80} className="text-warning mb-3" />
      <h1 className="display-4 fw-bold mb-2">404 Not Found</h1>
      <p className="lead text-muted mb-4">
        The page you are looking for does not exist.
      </p>
      <Button variant="primary" onClick={() => navigate("/")}>
        Go to Home
      </Button>
    </div>
  );
}
