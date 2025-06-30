import React, { useEffect, useState } from "react";
import axios from "axios";
import { getRoleFromToken, getUsernameFromToken } from "../utils/tokenUtils";
import { getAuthHeaders } from "../utils/authUtils";
import { Container, Table, Button, Modal, Card } from "react-bootstrap";
import { getImageUrl } from "../utils/imageUtils";

export default function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const token = localStorage.getItem("authToken");
  const username = getUsernameFromToken(token);
  const baseUrl = "http://localhost:8080/api/orders";

  useEffect(() => {
    axios
      .get(baseUrl + "/my", { headers: getAuthHeaders() })
      .then((res) => setOrders(res.data));
  }, [username]);

  const handleView = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  return (
    <Container className="mt-4 userorders-fade-in">
      <Card className="shadow rounded custom-card mb-4">
        <Card.Body>
          <h2 className="text-primary mb-4 fw-bold userorders-animated-heading">
            <span className="me-2" style={{ fontSize: 32 }}>
              🧾
            </span>
            Your Orders
          </h2>
          <div className="orders-table-wrapper">
            <Table bordered responsive className="orders-table align-middle">
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
                        className="modern-view-btn d-flex align-items-center justify-content-center"
                      >
                        <span className="me-1" style={{ fontSize: 18 }}>
                          👁️
                        </span>{" "}
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
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
              <p>
                <strong>Status:</strong> {selectedOrder.orderStatus}
              </p>
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
              {/* Add more details as needed */}
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
        </Modal.Footer>
      </Modal>
      <style>{`
        body, .userorders-fade-in {
          background: linear-gradient(120deg, #e3f2fd 0%, #fce4ec 100%) !important;
          min-height: 100vh;
          animation: fadeInOrders 0.7s cubic-bezier(0.4,0,0.2,1);
        }
        @keyframes fadeInOrders {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: none; }
        }
        .userorders-animated-heading {
          animation: ordersHeadingPop 1.1s cubic-bezier(0.4,0,0.2,1);
          letter-spacing: 0.01em;
        }
        @keyframes ordersHeadingPop {
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
        .orders-table-wrapper {
          border-radius: 1.1rem;
          overflow: hidden;
          background: transparent;
          box-shadow: none;
        }
        .orders-table {
          margin-bottom: 0;
          background: transparent;
          border-collapse: separate;
          border-spacing: 0;
          width: 100%;
        }
        .orders-table thead th {
          background: #fff;
          color: #283593;
          font-weight: 800;
          font-size: 1.08rem;
          border: none;
          border-top-left-radius: 1.1rem;
          border-top-right-radius: 1.1rem;
          padding: 1.1rem 0.7rem;
          letter-spacing: 0.01em;
          box-shadow: 0 2px 8px #e3e7ef33;
        }
        .orders-table thead th:not(:first-child):not(:last-child) {
          border-radius: 0;
        }
        .orders-table tbody tr {
          background: rgba(255,255,255,0.92);
          transition: background 0.18s, box-shadow 0.18s, transform 0.13s;
          box-shadow: 0 1px 4px #38f9d733;
          border-radius: 0.7rem;
        }
        .orders-table tbody tr:hover {
          background: #e3f2fdcc;
          box-shadow: 0 4px 16px #43e97b33;
          transform: scale(1.012);
          z-index: 2;
        }
        .orders-table td {
          border: none;
          font-size: 1.05rem;
          vertical-align: middle;
          padding: 0.95rem 0.7rem;
        }
        .modern-view-btn {
          background: linear-gradient(90deg, #43e97b 0%, #38f9d7 100%);
          border: none;
          border-radius: 999px;
          font-weight: 700;
          font-size: 1.01rem;
          box-shadow: 0 2px 8px #38f9d733;
          transition: background 0.2s, box-shadow 0.2s, transform 0.13s;
          color: #fff;
          padding: 0.5rem 1.2rem;
          letter-spacing: 0.01em;
        }
        .modern-view-btn:hover, .modern-view-btn:focus {
          background: linear-gradient(90deg, #38f9d7 0%, #43e97b 100%);
          box-shadow: 0 4px 16px #43e97b33;
          transform: scale(1.08);
          color: #fff;
        }
        .custom-modal .modal-content {
          border-radius: 1.2rem;
          background: rgba(255,255,255,0.97);
          box-shadow: 0 8px 32px 0 #43e97b22;
          border: none;
          backdrop-filter: blur(6px);
        }
        .custom-modal .modal-header, .custom-modal .modal-footer {
          border: none;
          background: transparent;
        }
        .custom-modal .modal-title {
          font-weight: 700;
          color: #283593;
        }
        .custom-modal .btn-secondary {
          border-radius: 0.7rem;
          font-weight: 600;
          font-size: 1.01rem;
          background: #e3e7ef;
          color: #283593;
          border: none;
          box-shadow: 0 1px 4px #28359322;
          transition: background 0.2s, color 0.2s;
        }
        .custom-modal .btn-secondary:hover, .custom-modal .btn-secondary:focus {
          background: #43e97b;
          color: #fff;
        }
      `}</style>
    </Container>
  );
}
