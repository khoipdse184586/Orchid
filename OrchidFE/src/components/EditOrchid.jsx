import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/esm/Container";
import {
  Button,
  Col,
  Form,
  FormGroup,
  Image,
  Row,
  Card,
} from "react-bootstrap";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { getAuthHeaders } from "../utils/authUtils";
import { getImageUrl } from "../utils/imageUtils";

export default function EditOrchid() {
  const baseUrl = "http://localhost:8080/api/orchids";
  const { id } = useParams();
  const navigate = useNavigate();
  const [api, setAPI] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [categories, setCategories] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm({
    defaultValues: {
      orchidName: "",
      orchidDescription: "",
      price: 0,
      isNatural: false,
      categoryId: 1,
    },
  });

  useEffect(() => {
    // Fetch orchid data and categories
    const fetchData = async () => {
      try {
        const [orchidResponse, categoriesResponse] = await Promise.all([
          axios.get(`${baseUrl}/${id}`, { headers: getAuthHeaders() }),
          axios.get("http://localhost:8080/api/categories", {
            headers: getAuthHeaders(),
          }),
        ]);

        setAPI(orchidResponse.data);
        setCategories(categoriesResponse.data);

        // Set default values to prevent null/undefined issues
        setValue("orchidName", orchidResponse.data.orchidName || "");
        setValue(
          "orchidDescription",
          orchidResponse.data.orchidDescription || ""
        );
        setValue("price", orchidResponse.data.price || 0);
        setValue("isNatural", orchidResponse.data.isNatural || false);
        setValue("categoryId", orchidResponse.data.categoryId || 1);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch orchid data.");
      }
    };

    fetchData();
  }, [id, setValue, baseUrl]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("orchidName", data.orchidName);
    formData.append("orchidDescription", data.orchidDescription);
    formData.append("price", data.price);
    formData.append("isNatural", data.isNatural || false);
    formData.append("categoryId", data.categoryId);
    if (selectedFile) {
      formData.append("orchidUrl", selectedFile);
    } else if (api.orchidUrl) {
      // If no new file, backend may require a file, so this may need to be handled server-side
      // Optionally, you can skip or send a placeholder
    }
    axios
      .put(`${baseUrl}/${id}`, formData, {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        toast.success("Orchid edited successfully!");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to edit orchid.");
      });
  };

  return (
    <Container className="py-5">
      <Toaster />
      <Row className="justify-content-center">
        <Col md={8} lg={7}>
          <Card className="shadow rounded custom-card p-4">
            <Card.Body>
              <h2 className="text-primary mb-4">Edit Orchid</h2>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Label>Name</Form.Label>
                  <Controller
                    name="orchidName"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Form.Control
                        {...field}
                        value={field.value || ""}
                        type="text"
                        className="shadow-sm"
                      />
                    )}
                  />
                  {errors.orchidName &&
                    errors.orchidName.type === "required" && (
                      <p className="text-warning">Name is required</p>
                    )}
                </Form.Group>

                <Form.Group className="mb-3" controlId="orchidDescription">
                  <Form.Label>Description</Form.Label>
                  <Controller
                    name="orchidDescription"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Form.Control
                        {...field}
                        value={field.value || ""}
                        as="textarea"
                        rows={3}
                        className="shadow-sm"
                      />
                    )}
                  />
                  {errors.orchidDescription &&
                    errors.orchidDescription.type === "required" && (
                      <p className="text-warning">Description is required</p>
                    )}
                </Form.Group>
                <Form.Group className="mb-3" controlId="price">
                  <Form.Label>Price</Form.Label>
                  <Controller
                    name="price"
                    control={control}
                    rules={{ required: true, min: 0.01 }}
                    render={({ field }) => (
                      <Form.Control
                        {...field}
                        value={field.value || 0}
                        type="number"
                        min="0.01"
                        step="0.01"
                        className="shadow-sm"
                      />
                    )}
                  />
                  {errors.price && (
                    <p className="text-warning">Valid price is required</p>
                  )}
                </Form.Group>
                <Form.Group className="mb-3" controlId="categoryId">
                  <Form.Label>Category</Form.Label>
                  <Controller
                    name="categoryId"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Form.Select
                        {...field}
                        value={field.value || ""}
                        className="shadow-sm"
                      >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                          <option
                            key={category.categoryId}
                            value={category.categoryId}
                          >
                            {category.categoryName}
                          </option>
                        ))}
                      </Form.Select>
                    )}
                  />
                  {errors.categoryId && (
                    <p className="text-warning">Please select a category</p>
                  )}
                </Form.Group>

                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlTextarea1"
                >
                  <Form.Label>Image</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="shadow-sm"
                  />
                  {api.orchidUrl && !selectedFile && (
                    <div className="mt-2">
                      <span className="text-muted">Current image: </span>
                      <a
                        href={getImageUrl(api.orchidUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View
                      </a>
                    </div>
                  )}
                </Form.Group>

                <FormGroup className="mb-3">
                  <Form.Check
                    type="switch"
                    id="custom-switch"
                    label="Natural"
                    {...register("isNatural")}
                  />
                </FormGroup>

                <Button variant="primary" type="submit" className="w-100 py-2">
                  Save
                </Button>
              </form>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="d-none d-md-block">
          <Image
            src={getImageUrl(api.orchidUrl)}
            width={240}
            thumbnail
            className="shadow-lg p-3 mb-5 bg-body-tertiary rounded custom-image"
          />
        </Col>
      </Row>
    </Container>
  );
}
