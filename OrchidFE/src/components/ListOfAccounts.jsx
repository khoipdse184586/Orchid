import { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/esm/Container";
import { Button, Form, Modal, Card, Badge } from "react-bootstrap";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { getAuthHeaders } from "../utils/authUtils";
import AdminLayout from "./AdminLayout";

export default function ListOfAccounts() {
  const [accounts, setAccounts] = useState([]);
  const [roles, setRoles] = useState([]);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingAccount, setEditingAccount] = useState(null);

  const handleClose = () => {
    setShow(false);
    setEditingAccount(null);
  };
  const handleShow = () => setShow(true);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm();

  useEffect(() => {
    fetchAccounts();
    fetchRoles();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8080/api/accounts", {
        headers: getAuthHeaders(),
      });
      const sortedData = response.data.sort(
        (a, b) => parseInt(b.accountId) - parseInt(a.accountId)
      );
      setAccounts(sortedData);
    } catch (error) {
      console.error("Error fetching accounts:", error);
      if (error.response?.status === 401) {
        toast.error("Authentication failed. Please login again.");
      } else {
        toast.error("Failed to load accounts!");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/roles", {
        headers: getAuthHeaders(),
      });
      setRoles(response.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const handleEdit = (account) => {
    setEditingAccount(account);
    setValue("accountName", account.accountName);
    setValue("email", account.email);
    setValue("roleId", account.role?.roleId || 4);
    setShow(true);
  };

  const handleDelete = async (accountId) => {
    try {
      await axios.delete(`http://localhost:8080/api/accounts/${accountId}`, {
        headers: getAuthHeaders(),
      });
      fetchAccounts();
      toast.success("Account deleted successfully!");
    } catch (error) {
      console.log(error.message);
      if (error.response?.status === 401) {
        toast.error("Authentication failed. Please login again.");
      } else {
        toast.error("Failed to delete account!");
      }
    }
  };

  const onSubmit = async (data) => {
    try {
      if (editingAccount) {
        // Update existing account
        await axios.put(
          `http://localhost:8080/api/accounts/${editingAccount.accountId}`,
          data,
          {
            headers: getAuthHeaders(),
          }
        );
        toast.success("Account updated successfully!");
      } else {
        // Create new account (admin registration)
        await axios.post(
          "http://localhost:8080/api/accounts/register/admin",
          data,
          {
            headers: getAuthHeaders(),
          }
        );
        toast.success("Account created successfully!");
      }

      setShow(false);
      fetchAccounts();
      reset();
      setEditingAccount(null);
    } catch (error) {
      console.log(error.message);
      if (error.response?.status === 401) {
        toast.error("Authentication failed. Please login again.");
      } else if (error.response?.status === 400) {
        toast.error("Invalid input data. Please check your form.");
      } else {
        toast.error(
          editingAccount
            ? "Failed to update account!"
            : "Failed to create account!"
        );
      }
    }
  };

  const getRoleBadgeColor = (roleName) => {
    switch (roleName) {
      case "ADMIN":
        return "danger";
      case "USER":
        return "primary";
      default:
        return "secondary";
    }
  };

  if (loading) {
    return (
      <Container className="mt-4">
        <div className="text-center">
          <h4>Loading accounts...</h4>
        </div>
      </Container>
    );
  }

  return (
    <AdminLayout>
      <Toaster />
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">Manage Accounts</h2>
        <Button onClick={handleShow} variant="primary" className="shadow-sm">
          <i className="bi bi-plus-circle me-2"></i>
          Add New Account
        </Button>
      </div>

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
                <th>Account ID</th>
                <th>Account Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((account) => (
                <tr key={account.accountId}>
                  <td className="fw-bold">#{account.accountId}</td>
                  <td className="fw-bold">{account.accountName}</td>
                  <td className="text-muted">{account.email}</td>
                  <td>
                    <Badge
                      bg={getRoleBadgeColor(account.role?.roleName)}
                      className="custom-badge"
                    >
                      {account.role?.roleName || "USER"}
                    </Badge>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="shadow-sm"
                        onClick={() => handleEdit(account)}
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
                              "Are you sure you want to delete this account?"
                            )
                          ) {
                            handleDelete(account.accountId);
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

      {accounts.length === 0 && (
        <div className="text-center mt-5">
          <h4 className="text-muted">No accounts available</h4>
          <p>Add your first account to get started.</p>
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
            {editingAccount ? "Edit Account" : "Add New Account"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3">
              <Form.Label>Account Name *</Form.Label>
              <Form.Control
                type="text"
                autoFocus
                {...register("accountName", { required: true })}
                placeholder="Enter account name"
                className="shadow-sm"
              />
              {errors.accountName && errors.accountName.type === "required" && (
                <p className="text-danger mt-1">Account name is required</p>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email *</Form.Label>
              <Form.Control
                type="email"
                {...register("email", {
                  required: true,
                  pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                })}
                placeholder="Enter email address"
                className="shadow-sm"
              />
              {errors.email && errors.email.type === "required" && (
                <p className="text-danger mt-1">Email is required</p>
              )}
              {errors.email && errors.email.type === "pattern" && (
                <p className="text-danger mt-1">Please enter a valid email</p>
              )}
            </Form.Group>

            {!editingAccount && (
              <Form.Group className="mb-3">
                <Form.Label>Password *</Form.Label>
                <Form.Control
                  type="password"
                  {...register("password", {
                    required: !editingAccount,
                    minLength: 3,
                  })}
                  placeholder="Enter password"
                  className="shadow-sm"
                />
                {errors.password && errors.password.type === "required" && (
                  <p className="text-danger mt-1">Password is required</p>
                )}
                {errors.password && errors.password.type === "minLength" && (
                  <p className="text-danger mt-1">
                    Password must be at least 3 characters
                  </p>
                )}
              </Form.Group>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Role *</Form.Label>
              <Form.Select
                {...register("roleId", { required: true })}
                className="shadow-sm"
              >
                <option value="">Select a role</option>
                {roles.map((role) => (
                  <option key={role.roleId} value={role.roleId}>
                    {role.roleName}
                  </option>
                ))}
              </Form.Select>
              {errors.roleId && errors.roleId.type === "required" && (
                <p className="text-danger mt-1">Role is required</p>
              )}
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
                {editingAccount ? "Update Account" : "Create Account"}
              </Button>
            </Modal.Footer>
          </form>
        </Modal.Body>
      </Modal>
    </AdminLayout>
  );
}
