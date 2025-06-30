import React, { useEffect, useState } from "react";
import axios from "axios";
import { getAuthHeaders } from "../utils/authUtils";
import { Container, Table, Button, Modal, Form, Card } from "react-bootstrap";
import { getImageUrl } from "../utils/imageUtils";
import AdminLayout from "./AdminLayout";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editStatus, setEditStatus] = useState("");
  const baseUrl = "http://localhost:8080/api/orders";

  const fetchOrders = () => {
    axios
      .get(baseUrl, { headers: getAuthHeaders() })
      .then((res) => setOrders(res.data));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleView = (order) => {
    setSelectedOrder(order);
    setEditStatus(order.orderStatus);
    setShowModal(true);
  };

  const handleUpdate = () => {
    axios
      .put(
        `${baseUrl}/${selectedOrder.orchidId || selectedOrder.id}`,
        {
          ...selectedOrder,
          orderStatus: editStatus,
        },
        { headers: getAuthHeaders() }
      )
      .then(() => {
        fetchOrders();
        setShowModal(false);
      });
  };

  const handleDelete = (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      axios
        .delete(`${baseUrl}/${orderId}`, { headers: getAuthHeaders() })
        .then(() => fetchOrders());
    }
  };

  return (
    <AdminLayout>
      <Card className="shadow rounded custom-card mb-4">
        <Card.Body>
          <h2 className="text-primary mb-4">All Orders (Admin)</h2>
          <Table
            striped
            bordered
            hover
            responsive
            className="custom-table align-middle"
          >
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Status</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.orchidId || order.id}>
                  <td>{order.orchidId || order.id}</td>
                  <td>{order.orderDate}</td>
                  <td>{order.orderStatus}</td>
                  <td>{order.price}</td>
                  <td>
                    <Button
                      size="sm"
                      onClick={() => handleView(order)}
                      className="me-2 shadow-sm"
                    >
                      View/Update
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(order.orchidId || order.id)}
                      className="shadow-sm"
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        className="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Order Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <div>
              <p>
                <strong>Order ID:</strong>{" "}
                {selectedOrder.orchidId || selectedOrder.id}
              </p>
              <p>
                <strong>Date:</strong> {selectedOrder.orderDate}
              </p>
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Control
                  type="text"
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="shadow-sm"
                />
              </Form.Group>
              <p>
                <strong>Total:</strong> {selectedOrder.price}
              </p>
              {selectedOrder.orderDetails &&
                selectedOrder.orderDetails.length > 0 && (
                  <div className="mt-4">
                    <h5 className="mb-3">Order Items</h5>
                    <Table
                      size="sm"
                      bordered
                      hover
                      responsive
                      className="custom-table align-middle"
                    >
                      <thead>
                        <tr>
                          <th>Image</th>
                          <th>Name</th>
                          <th>Quantity</th>
                          <th>Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.orderDetails.map((detail) => (
                          <tr key={detail.id}>
                            <td>
                              <img
                                src={getImageUrl(detail.orchidUrl)}
                                alt={detail.orchidName}
                                style={{
                                  width: 60,
                                  height: 60,
                                  objectFit: "cover",
                                  borderRadius: 8,
                                }}
                              />
                            </td>
                            <td>{detail.orchidName}</td>
                            <td>{detail.quantity}</td>
                            <td>{detail.price}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowModal(false)}
            className="shadow-sm"
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleUpdate}
            className="shadow-sm"
          >
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  );
}
