import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Badge, Button } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";
import { getAuthHeaders } from "../utils/authUtils";
import { getImageUrl } from "../utils/imageUtils";

export default function CategoryDisplay() {
  const [categories, setCategories] = useState([]);
  const [orchidsByCategory, setOrchidsByCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Authentication required. Please login again.");
        return;
      }

      const [categoriesResponse, orchidsResponse] = await Promise.all([
        axios.get("http://localhost:8080/api/categories", {
          headers: getAuthHeaders(),
        }),
        axios.get("http://localhost:8080/api/orchids", {
          headers: getAuthHeaders(),
        }),
      ]);

      setCategories(categoriesResponse.data);

      // Group orchids by category
      const grouped = {};
      orchidsResponse.data.forEach((orchid) => {
        const categoryId = orchid.category?.categoryId || "uncategorized";
        if (!grouped[categoryId]) {
          grouped[categoryId] = [];
        }
        grouped[categoryId].push(orchid);
      });
      setOrchidsByCategory(grouped);
    } catch (error) {
      console.error("Error fetching data:", error);
      if (error.response?.status === 401) {
        setError("Authentication failed. Please login again.");
      } else {
        setError("Failed to load categories. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="mt-4">
        <div className="text-center">
          <h4>Loading categories...</h4>
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
    <Container className="mt-4">
      <div className="mb-4">
        <h2 className="text-primary">Browse by Category</h2>
        <p className="text-muted">
          Explore our orchids organized by categories
        </p>
      </div>

      <Row className="g-4">
        {categories.map((category) => {
          const categoryOrchids = orchidsByCategory[category.categoryId] || [];
          return (
            <Col lg={6} key={category.categoryId}>
              <Card className="h-100 shadow-sm custom-card">
                <Card.Header className="bg-light">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="text-primary mb-0">
                      {category.categoryName}
                    </h5>
                    <Badge bg="primary" className="custom-badge">
                      {categoryOrchids.length} orchids
                    </Badge>
                  </div>
                </Card.Header>
                <Card.Body>
                  <p className="text-muted mb-3">
                    {category.categoryDescription || "No description available"}
                  </p>

                  {categoryOrchids.length > 0 ? (
                    <div>
                      <h6 className="mb-3">Featured Orchids:</h6>
                      <Row className="g-2">
                        {categoryOrchids.slice(0, 3).map((orchid) => (
                          <Col xs={4} key={orchid.orchidId}>
                            <Card className="border-0 bg-light">
                              <Card.Img
                                variant="top"
                                src={getImageUrl(orchid.orchidUrl)}
                                alt={orchid.orchidName}
                                style={{ height: "80px", objectFit: "cover" }}
                              />
                              <Card.Body className="p-2">
                                <small className="fw-bold d-block text-truncate">
                                  {orchid.orchidName}
                                </small>
                                <small className="text-primary fw-bold">
                                  ${orchid.price}
                                </small>
                              </Card.Body>
                            </Card>
                          </Col>
                        ))}
                      </Row>

                      {categoryOrchids.length > 3 && (
                        <div className="text-center mt-3">
                          <Link to={`/category/${category.categoryId}`}>
                            <Button variant="outline-primary" size="sm">
                              View All {categoryOrchids.length} Orchids
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center text-muted">
                      <p>No orchids in this category yet.</p>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>

      {categories.length === 0 && (
        <div className="text-center mt-5">
          <h4 className="text-muted">No categories available</h4>
          <p>Categories will be added by administrators.</p>
        </div>
      )}
    </Container>
  );
}
