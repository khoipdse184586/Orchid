import { useEffect, useState } from "react";
import Container from "react-bootstrap/esm/Container";
import { Button, Col, Row, Card, Badge, Form } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";
import { getImageUrl } from "../utils/imageUtils";

export default function HomeScreen() {
  const [orchids, setOrchids] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchOrchids();
    fetchCategories();
  }, []);

  const fetchOrchids = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get the authentication token
      const token = localStorage.getItem("authToken");

      if (!token) {
        setError("Authentication required. Please login again.");
        return;
      }

      const response = await axios.get("http://localhost:8080/api/orchids", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const sortedData = response.data.sort(
        (a, b) => parseInt(b.orchidId) - parseInt(a.orchidId)
      );
      setOrchids(sortedData);
    } catch (error) {
      console.error("Error fetching orchids:", error);

      if (error.response) {
        if (error.response.status === 401) {
          setError("Authentication failed. Please login again.");
        } else if (error.response.status === 403) {
          setError(
            "Access denied. You do not have permission to view orchids."
          );
        } else {
          setError(
            `Failed to load orchids: ${
              error.response.data?.message || "Server error"
            }`
          );
        }
      } else if (error.request) {
        setError("Network error. Please check your connection.");
      } else {
        setError("Failed to load orchids. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      const response = await axios.get("http://localhost:8080/api/categories", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const filteredOrchids = orchids.filter((orchid) => {
    const matchesSearch =
      orchid.orchidName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orchid.orchidDescription.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      !selectedCategory ||
      orchid.category?.categoryId === parseInt(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <Container className="mt-4">
        <div className="text-center">
          <h4>Loading orchids...</h4>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <div className="text-center text-danger">
          <h4>{error}</h4>
          <Link to="/login">
            <Button variant="primary" className="mt-3">
              Go to Login
            </Button>
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-4 home-fade-in">
      <div className="mb-4 text-center">
        <h2 className="text-primary fw-bold home-animated-heading">
          <span className="me-2" style={{ fontSize: 36 }}>
            🌸
          </span>
          Welcome to Orchid Garden
        </h2>
        <p className="text-muted fs-5">
          Discover our beautiful collection of orchids
        </p>
      </div>

      {/* Search and Filter Section */}
      <Row className="mb-4">
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Search orchids..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="shadow-sm"
          />
        </Col>
        <Col md={6}>
          <Form.Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="shadow-sm"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.categoryId} value={category.categoryId}>
                {category.categoryName}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      <Row className="g-4">
        {filteredOrchids.map((orchid) => (
          <Col md={4} lg={3} key={orchid.orchidId}>
            <Card className="h-100 shadow-sm custom-card">
              <Card.Img
                variant="top"
                src={getImageUrl(orchid.orchidUrl)}
                alt={orchid.orchidName}
                style={{ height: "250px", objectFit: "cover" }}
              />
              <Card.Body className="d-flex flex-column">
                <Card.Title className="fw-bold">{orchid.orchidName}</Card.Title>
                <Card.Text className="text-muted flex-grow-1">
                  {orchid.orchidDescription}
                </Card.Text>

                <div className="d-flex justify-content-between align-items-center mb-3">
                  <Badge
                    bg={orchid.isNatural ? "success" : "warning"}
                    className="mb-2 custom-badge"
                  >
                    {orchid.isNatural ? "Natural" : "Industry"}
                  </Badge>
                  <span className="fw-bold text-primary">${orchid.price}</span>
                </div>

                <Link to={`/detail/${orchid.orchidId}`}>
                  <Button variant="primary" className="w-100 shadow-sm">
                    View Details
                  </Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {filteredOrchids.length === 0 && (
        <div className="text-center mt-5">
          <h4 className="text-muted">
            {orchids.length === 0
              ? "No orchids available"
              : "No orchids match your search criteria"}
          </h4>
          <p>
            {orchids.length === 0
              ? "Check back later for new additions to our collection."
              : "Try adjusting your search or filter criteria."}
          </p>
        </div>
      )}

      <style>{`
        body, .home-fade-in {
          background: linear-gradient(120deg, #e3f2fd 0%, #fce4ec 100%) !important;
          min-height: 100vh;
          animation: fadeInHome 0.7s cubic-bezier(0.4,0,0.2,1);
        }
        @keyframes fadeInHome {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: none; }
        }
        .home-animated-heading {
          animation: homeHeadingPop 1.1s cubic-bezier(0.4,0,0.2,1);
          letter-spacing: 0.01em;
        }
        @keyframes homeHeadingPop {
          0% { opacity: 0; transform: scale(0.85) translateY(30px); }
          60% { opacity: 1; transform: scale(1.08) translateY(-8px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .custom-card {
          border-radius: 1.3rem;
          border: none;
          background: rgba(255,255,255,0.82);
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.10), 0 2px 8px #38f9d733;
          transition: box-shadow 0.22s, transform 0.18s, background 0.18s;
          backdrop-filter: blur(6px);
          overflow: hidden;
          position: relative;
        }
        .custom-card:hover {
          box-shadow: 0 16px 48px 0 #43e97b33, 0 4px 24px #38f9d744;
          background: rgba(255,255,255,0.95);
          transform: scale(1.035) translateY(-4px);
          z-index: 2;
        }
        .custom-card .card-title {
          font-size: 1.18rem;
          font-weight: 700;
          color: #283593;
        }
        .custom-card .card-text {
          font-size: 1.01rem;
          color: #6c757d;
        }
        .custom-card .btn-primary {
          background: linear-gradient(90deg, #43e97b 0%, #38f9d7 100%);
          border: none;
          border-radius: 0.7rem;
          font-weight: 700;
          font-size: 1.08rem;
          box-shadow: 0 2px 8px #38f9d733;
          transition: background 0.2s, box-shadow 0.2s, transform 0.13s;
        }
        .custom-card .btn-primary:hover, .custom-card .btn-primary:focus {
          background: linear-gradient(90deg, #38f9d7 0%, #43e97b 100%);
          box-shadow: 0 4px 16px #43e97b33;
          transform: scale(1.04);
        }
        .custom-badge {
          font-size: 0.98rem;
          padding: 0.45em 1em;
          border-radius: 0.7em;
          font-weight: 600;
          letter-spacing: 0.01em;
        }
        .form-control, .form-select {
          border-radius: 0.8rem;
          font-size: 1.08rem;
          border: 1.5px solid #e3e7ef;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-shadow: 0 1px 4px #e3e7ef33;
        }
        .form-control:focus, .form-select:focus {
          border-color: #43a047;
          box-shadow: 0 0 0 2px #43a04733;
        }
      `}</style>
    </Container>
  );
}
