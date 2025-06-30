import React from "react";
import { Button } from "react-bootstrap";
import { FaBan } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Forbidden403() {
  const navigate = useNavigate();
  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light">
      <FaBan size={80} className="text-danger mb-3" />
      <h1 className="display-4 fw-bold mb-2">403 Forbidden</h1>
      <p className="lead text-muted mb-4">
        You do not have permission to access this page.
      </p>
      <Button variant="primary" onClick={() => navigate("/")}>
        Go to Home
      </Button>
    </div>
  );
}
