import { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/esm/Container";
import {
  Button,
  Form,
  FormGroup,
  Image,
  Modal,
  Badge,
  Card,
} from "react-bootstrap";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { getImageUrl } from "../utils/imageUtils";
import AdminLayout from "./AdminLayout";

export default function ListOfOrchids() {
  const [orchids, setOrchids] = useState([]);
  const [categories, setCategories] = useState([]);
  const [show, setShow] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("orchidId");
  const [sortDirection, setSortDirection] = useState("desc");

  const handleClose = () => {
    setShow(false);
    setSelectedFile(null);
  };
  const handleShow = () => setShow(true);

  const handleCategoryModalClose = () => {
    setShowCategoryModal(false);
  };
  const handleCategoryModalShow = () => setShowCategoryModal(true);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    fetchOrchids();
    fetchCategories();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("authToken");
    return {
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchOrchids = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8080/api/orchids", {
        headers: getAuthHeaders(),
      });
      const sortedData = response.data.sort(
        (a, b) => parseInt(b.orchidId) - parseInt(a.orchidId)
      );
      setOrchids(sortedData);
    } catch (error) {
      console.error("Error fetching orchids:", error);
      if (error.response?.status === 401) {
        toast.error("Authentication failed. Please login again.");
      } else {
        toast.error("Failed to load orchids!");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/categories", {
        headers: getAuthHeaders(),
      });
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories!");
    }
  };

  const handleDelete = async (orchidId) => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/orchids/${orchidId}`,
        {
          headers: getAuthHeaders(),
        }
      );
      fetchOrchids();
      toast.success("Orchid deleted successfully!");
    } catch (error) {
      console.log(error.message);
      if (error.response?.status === 401) {
        toast.error("Authentication failed. Please login again.");
      } else {
        toast.error("Failed to delete orchid!");
      }
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleCreateCategory = async (categoryName) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/categories",
        { categoryName },
        {
          headers: getAuthHeaders(),
        }
      );
      fetchCategories(); // Refresh categories list
      toast.success("Category created successfully!");
      return response.data;
    } catch (error) {
      console.error("Error creating category:", error);
      if (error.response?.status === 401) {
        toast.error("Authentication failed. Please login again.");
      } else if (error.response?.status === 400) {
        toast.error("Invalid category name. Please try again.");
      } else {
        toast.error("Failed to create category!");
      }
      return null;
    }
  };

  const onSubmit = async (data) => {
    try {
      if (!selectedFile) {
        toast.error("Please select an image file");
        return;
      }

      const formData = new FormData();
      formData.append("orchidName", data.orchidName);
      formData.append(
        "orchidDescription",
        data.orchidDescription || "Beautiful orchid"
      );
      formData.append("orchidUrl", selectedFile);
      formData.append("price", data.price || 100);
      formData.append("isNatural", data.isNatural || false);
      formData.append("categoryId", data.categoryId || 1); // Use selected category or default

      const response = await axios.post(
        "http://localhost:8080/api/orchids",
        formData,
        {
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setShow(false);
      fetchOrchids();
      reset();
      setSelectedFile(null);
      toast.success("Orchid added successfully!");
    } catch (error) {
      console.log(error.message);
      if (error.response?.status === 401) {
        toast.error("Authentication failed. Please login again.");
      } else if (error.response?.status === 400) {
        toast.error("Invalid input data. Please check your form.");
      } else {
        toast.error("Failed to add orchid!");
      }
    }
  };

  // Filter and sort orchids
  const filteredOrchids = orchids
    .filter(
      (orchid) =>
        orchid.orchidName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        orchid.orchidDescription
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let aValue, bValue;
      switch (sortField) {
        case "orchidName":
          aValue = a.orchidName.toLowerCase();
          bValue = b.orchidName.toLowerCase();
          break;
        case "price":
          aValue = parseFloat(a.price);
          bValue = parseFloat(b.price);
          break;
        case "orchidId":
        default:
          aValue = parseInt(a.orchidId);
          bValue = parseInt(b.orchidId);
      }
      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
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

  return (
    <AdminLayout>
      <Toaster />
      <div className="d-flex justify-content-between align-items-center mb-4 mt-4">
        <h2 className="text-primary">Manage Orchids</h2>
        <div className="d-flex gap-2">
          <Button
            onClick={handleCategoryModalShow}
            variant="outline-primary"
            className="shadow-sm"
          >
            <i className="bi bi-tags me-2"></i>
            Add Category
          </Button>
          <Button onClick={handleShow} variant="primary" className="shadow-sm">
            <i className="bi bi-plus-circle me-2"></i>
            Add New Orchid
          </Button>
        </div>
      </div>
      {/* Search and Sort Controls */}
      <Card className="shadow rounded custom-card mb-4">
        <Card.Body>
          <div className="row g-3 align-items-end">
            <div className="col-md-6">
              <Form.Group>
                <Form.Label>Search Orchids</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Search by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="shadow-sm"
                />
              </Form.Group>
            </div>
            <div className="col-md-3">
              <Form.Group>
                <Form.Label>Sort By</Form.Label>
                <Form.Select
                  value={sortField}
                  onChange={(e) => setSortField(e.target.value)}
                  className="shadow-sm"
                >
                  <option value="orchidId">Orchid ID</option>
                  <option value="orchidName">Orchid Name</option>
                  <option value="price">Price</option>
                </Form.Select>
              </Form.Group>
            </div>
            <div className="col-md-3">
              <Form.Group>
                <Form.Label>Sort Direction</Form.Label>
                <Form.Select
                  value={sortDirection}
                  onChange={(e) => setSortDirection(e.target.value)}
                  className="shadow-sm"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </Form.Select>
              </Form.Group>
            </div>
          </div>
        </Card.Body>
      </Card>
      <Card className="shadow rounded custom-card mb-4">
        <Card.Body>
          <Table
            striped
            bordered
            hover
            responsive
            className="custom-table align-middle"
          >
            <thead className="table-dark">
              <tr>
                <th>Image</th>
                <th>Orchid Name</th>
                <th>Description</th>
                <th>Category</th>
                <th>Price</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrchids.map((orchid) => (
                <tr key={orchid.orchidId}>
                  <td>
                    <Image
                      src={getImageUrl(orchid.orchidUrl)}
                      width={60}
                      height={60}
                      rounded
                      className="shadow-sm custom-image"
                      style={{ objectFit: "cover" }}
                    />
                  </td>
                  <td className="fw-bold">{orchid.orchidName}</td>
                  <td className="text-muted">
                    {orchid.orchidDescription?.substring(0, 50)}
                    {orchid.orchidDescription?.length > 50 && "..."}
                  </td>
                  <td>
                    <Badge bg="info" className="custom-badge">
                      {orchid.category?.categoryName || "Uncategorized"}
                    </Badge>
                  </td>
                  <td className="fw-bold text-primary">${orchid.price}</td>
                  <td>
                    <Badge
                      bg={orchid.isNatural ? "success" : "warning"}
                      className="custom-badge"
                    >
                      {orchid.isNatural ? "Natural" : "Industry"}
                    </Badge>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <Link to={`/edit/${orchid.orchidId}`}>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="shadow-sm"
                        >
                          <i className="bi bi-pencil-square me-1"></i>
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="shadow-sm"
                        onClick={() => {
                          if (
                            confirm(
                              "Are you sure you want to delete this orchid?"
                            )
                          ) {
                            handleDelete(orchid.orchidId);
                          }
                        }}
                      >
                        <i className="bi bi-trash3 me-1"></i>
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {orchids.length === 0 && (
        <div className="text-center mt-5">
          <h4 className="text-muted">No orchids available</h4>
          <p>Add your first orchid to get started.</p>
        </div>
      )}

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        size="lg"
        className="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New Orchid</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3">
              <Form.Label>Orchid Name *</Form.Label>
              <Form.Control
                type="text"
                autoFocus
                {...register("orchidName", { required: true })}
                placeholder="Enter orchid name"
                className="shadow-sm"
              />
              {errors.orchidName && errors.orchidName.type === "required" && (
                <p className="text-danger mt-1">Orchid name is required</p>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                {...register("orchidDescription")}
                placeholder="Enter orchid description"
                className="shadow-sm"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Orchid Image *</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="form-control shadow-sm"
              />
              {!selectedFile && (
                <p className="text-danger mt-1">Please select an image file</p>
              )}
              {selectedFile && (
                <p className="text-success mt-1">
                  File selected: {selectedFile.name}
                </p>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category *</Form.Label>
              <Form.Select
                {...register("categoryId", { required: true })}
                className="shadow-sm"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.categoryId} value={category.categoryId}>
                    {category.categoryName}
                  </option>
                ))}
              </Form.Select>
              {errors.categoryId && (
                <p className="text-danger mt-1">Please select a category</p>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Price *</Form.Label>
              <Form.Control
                type="number"
                min="0"
                step="0.01"
                {...register("price", { required: true, min: 0 })}
                placeholder="Enter price"
                className="shadow-sm"
              />
              {errors.price && (
                <p className="text-danger mt-1">Valid price is required</p>
              )}
            </Form.Group>

            <FormGroup className="mb-3">
              <Form.Check
                type="switch"
                id="natural-switch"
                label="Natural Orchid"
                {...register("isNatural")}
              />
            </FormGroup>

            <Modal.Footer className="d-flex justify-content-end">
              <Button
                variant="secondary"
                onClick={handleClose}
                className="me-2"
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit" className="shadow-sm">
                Add Orchid
              </Button>
            </Modal.Footer>
          </form>
        </Modal.Body>
      </Modal>

      {/* Add Category Modal */}
      <Modal
        show={showCategoryModal}
        onHide={handleCategoryModalClose}
        backdrop="static"
        size="md"
        className="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const categoryName = formData.get("categoryName");
              if (categoryName.trim()) {
                handleCreateCategory(categoryName.trim());
                handleCategoryModalClose();
                e.target.reset();
              } else {
                toast.error("Please enter a category name");
              }
            }}
          >
            <Form.Group className="mb-3">
              <Form.Label>Category Name *</Form.Label>
              <Form.Control
                type="text"
                name="categoryName"
                autoFocus
                placeholder="Enter category name"
                className="shadow-sm"
                required
              />
            </Form.Group>

            <Modal.Footer className="d-flex justify-content-end">
              <Button
                variant="secondary"
                onClick={handleCategoryModalClose}
                className="me-2"
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit" className="shadow-sm">
                Add Category
              </Button>
            </Modal.Footer>
          </form>
        </Modal.Body>
      </Modal>
      <style>{`
        .mt-4 { margin-top: 5.5rem !important; }
        .modal.show .modal-dialog { margin-top: 5.5rem !important; }
      `}</style>
    </AdminLayout>
  );
}
