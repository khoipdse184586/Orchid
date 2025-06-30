import { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/esm/Container";
import { Button, Form, Modal, Card, Row, Col } from "react-bootstrap";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { getAuthHeaders } from "../utils/authUtils";
import { getRoleFromToken } from "../utils/tokenUtils";
import AdminLayout from "./AdminLayout";

export default function ListOfCategories() {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("categoryId");
  const [sortDirection, setSortDirection] = useState("desc");

  const handleClose = () => {
    setShow(false);
    setEditingCategory(null);
  };
  const handleShow = () => setShow(true);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  useEffect(() => {
    // Debug: Check user role
    const token = localStorage.getItem("authToken");
    const role = getRoleFromToken(token);
    console.log("Current user role:", role);
    console.log("Token:", token ? "Present" : "Missing");

    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8080/api/categories", {
        headers: getAuthHeaders(),
      });
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      if (error.response?.status === 401) {
        toast.error("Authentication failed. Please login again.");
      } else {
        toast.error("Failed to load categories!");
      }
    } finally {
      setLoading(false);
    }
  };

  // Sort and filter categories
  useEffect(() => {
    let result = [...categories];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (category) =>
          category.categoryName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          category.categoryId.toString().includes(searchTerm) ||
          (category.categoryDescription &&
            category.categoryDescription
              .toLowerCase()
              .includes(searchTerm.toLowerCase()))
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      let aValue, bValue;

      switch (sortField) {
        case "categoryName":
          aValue = a.categoryName.toLowerCase();
          bValue = b.categoryName.toLowerCase();
          break;
        case "categoryId":
          aValue = parseInt(a.categoryId);
          bValue = parseInt(b.categoryId);
          break;
        default:
          aValue = a.categoryName.toLowerCase();
          bValue = b.categoryName.toLowerCase();
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredCategories(result);
  }, [categories, searchTerm, sortField, sortDirection]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setValue("categoryName", category.categoryName);
    setValue("categoryDescription", category.categoryDescription);
    setShow(true);
  };

  const handleDelete = async (categoryId) => {
    try {
      await axios.delete(`http://localhost:8080/api/categories/${categoryId}`, {
        headers: getAuthHeaders(),
      });
      fetchCategories();
      toast.success("Category deleted successfully!");
    } catch (error) {
      console.log(error.message);
      if (error.response?.status === 401) {
        toast.error("Authentication failed. Please login again.");
      } else {
        toast.error("Failed to delete category!");
      }
    }
  };

  const onSubmit = async (data) => {
    try {
      // Debug: Log the data being sent
      console.log("Sending category data:", data);
      console.log("Auth headers:", getAuthHeaders());

      if (editingCategory) {
        // Update existing category
        await axios.put(
          `http://localhost:8080/api/categories/${editingCategory.categoryId}`,
          data,
          {
            headers: getAuthHeaders(),
          }
        );
        toast.success("Category updated successfully!");
      } else {
        // Create new category - only send categoryName if description is empty
        const requestData = data.categoryDescription
          ? data
          : { categoryName: data.categoryName };

        console.log("Creating category with data:", requestData);

        await axios.post("http://localhost:8080/api/categories", requestData, {
          headers: getAuthHeaders(),
        });
        toast.success("Category added successfully!");
      }

      setShow(false);
      fetchCategories();
      reset();
      setEditingCategory(null);
    } catch (error) {
      console.log("Error details:", error.response?.data);
      console.log("Error status:", error.response?.status);
      console.log("Error message:", error.message);

      if (error.response?.status === 401) {
        toast.error("Authentication failed. Please login again.");
      } else if (error.response?.status === 403) {
        toast.error(
          "Access denied. You don't have permission to create categories."
        );
      } else if (error.response?.status === 400) {
        toast.error("Invalid input data. Please check your form.");
      } else {
        toast.error(
          editingCategory
            ? "Failed to update category!"
            : "Failed to add category!"
        );
      }
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

  return (
    <AdminLayout>
      <Toaster />
      <div className="d-flex justify-content-between align-items-center mb-4 mt-4">
        <h2 className="text-primary">Manage Categories</h2>
        <Button onClick={handleShow} variant="primary" className="shadow-sm">
          <i className="bi bi-plus-circle me-2"></i>
          Add New Category
        </Button>
      </div>

      {/* Search and Sort Controls */}
      <Card className="shadow rounded custom-card mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Search Categories</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Search by name, ID, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="shadow-sm"
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Sort By</Form.Label>
                <Form.Select
                  value={sortField}
                  onChange={(e) => setSortField(e.target.value)}
                  className="shadow-sm"
                >
                  <option value="categoryId">Category ID</option>
                  <option value="categoryName">Category Name</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
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
            </Col>
          </Row>
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
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSort("categoryId")}
                >
                  Category ID
                  {sortField === "categoryId" && (
                    <i
                      className={`bi bi-arrow-${
                        sortDirection === "asc" ? "up" : "down"
                      } ms-1`}
                    ></i>
                  )}
                </th>
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSort("categoryName")}
                >
                  Category Name
                  {sortField === "categoryName" && (
                    <i
                      className={`bi bi-arrow-${
                        sortDirection === "asc" ? "up" : "down"
                      } ms-1`}
                    ></i>
                  )}
                </th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((category) => (
                <tr key={category.categoryId}>
                  <td className="fw-bold">#{category.categoryId}</td>
                  <td className="fw-bold text-primary">
                    {category.categoryName}
                  </td>
                  <td className="text-muted">
                    {category.categoryDescription || "No description"}
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="shadow-sm"
                        onClick={() => handleEdit(category)}
                      >
                        <i className="bi bi-pencil-square me-1"></i>
                        Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="shadow-sm"
                        onClick={() => {
                          if (
                            confirm(
                              "Are you sure you want to delete this category?"
                            )
                          ) {
                            handleDelete(category.categoryId);
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

      {filteredCategories.length === 0 && (
        <div className="text-center mt-5">
          <h4 className="text-muted">No categories available</h4>
          <p>Add your first category to get started.</p>
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
          <Modal.Title>
            {editingCategory ? "Edit Category" : "Add New Category"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3">
              <Form.Label>Category Name *</Form.Label>
              <Form.Control
                type="text"
                autoFocus
                {...register("categoryName", { required: true })}
                placeholder="Enter category name"
                className="shadow-sm"
              />
              {errors.categoryName &&
                errors.categoryName.type === "required" && (
                  <p className="text-danger mt-1">Category name is required</p>
                )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                {...register("categoryDescription")}
                placeholder="Enter category description"
                className="shadow-sm"
              />
            </Form.Group>

            <Modal.Footer className="d-flex justify-content-end">
              <Button
                variant="secondary"
                onClick={handleClose}
                className="me-2"
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit" className="shadow-sm">
                {editingCategory ? "Update Category" : "Add Category"}
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
