# 🚀 Orchid Service API Guide for Frontend

## 📋 Table of Contents

- [Base URL & Authentication](#base-url--authentication)
- [Authentication Flow](#authentication-flow)
- [API Endpoints](#api-endpoints)
- [Error Handling](#error-handling)
- [Examples](#examples)

---

## 🌐 Base URL & Authentication

**Base URL**: `http://localhost:8080`

**Authentication**: JWT Bearer Token

- All protected endpoints require `Authorization: Bearer <token>` header
- Token expires after 24 hours (86400000ms)

---

## 🔐 Authentication Flow

### 1. Login

```http
POST /api/accounts/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Response**:

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9..."
}
```

### 2. Register User

```http
POST /api/accounts/register
Content-Type: application/json

{
  "accountName": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### 3. Register Admin

```http
POST /api/accounts/register/admin
Content-Type: application/json

{
  "accountName": "Admin User",
  "email": "admin@example.com",
  "password": "admin123"
}
```

---

## 📡 API Endpoints

### 🔑 Account Management

| Method | Endpoint                       | Auth Required | Description       |
| ------ | ------------------------------ | ------------- | ----------------- |
| POST   | `/api/accounts/login`          | ❌            | User login        |
| POST   | `/api/accounts/register`       | ❌            | Register new user |
| POST   | `/api/accounts/register/admin` | ❌            | Register admin    |
| GET    | `/api/accounts`                | ✅            | Get all accounts  |

### 🌸 Orchid Management

| Method | Endpoint                             | Auth Required | Description             |
| ------ | ------------------------------------ | ------------- | ----------------------- |
| GET    | `/api/orchids`                       | ✅            | Get all orchids         |
| GET    | `/api/orchids/{id}`                  | ✅            | Get orchid by ID        |
| GET    | `/api/orchids/category/{categoryId}` | ✅            | Get orchids by category |
| POST   | `/api/orchids`                       | ✅            | Create new orchid       |
| PUT    | `/api/orchids/{id}`                  | ✅            | Update orchid           |
| DELETE | `/api/orchids/{id}`                  | ✅            | Delete orchid           |

### 📂 Category Management

| Method | Endpoint               | Auth Required | Description         |
| ------ | ---------------------- | ------------- | ------------------- |
| GET    | `/api/categories`      | ✅            | Get all categories  |
| GET    | `/api/categories/{id}` | ✅            | Get category by ID  |
| POST   | `/api/categories`      | ✅            | Create new category |
| PUT    | `/api/categories/{id}` | ✅            | Update category     |
| DELETE | `/api/categories/{id}` | ✅            | Delete category     |

### 🛒 Order Management

| Method | Endpoint           | Auth Required | Description      |
| ------ | ------------------ | ------------- | ---------------- |
| GET    | `/api/orders`      | ✅            | Get all orders   |
| GET    | `/api/orders/{id}` | ✅            | Get order by ID  |
| POST   | `/api/orders`      | ✅            | Create new order |
| PUT    | `/api/orders/{id}` | ✅            | Update order     |
| DELETE | `/api/orders/{id}` | ✅            | Delete order     |

### 🏷️ Role Management

| Method | Endpoint          | Auth Required | Description     |
| ------ | ----------------- | ------------- | --------------- |
| GET    | `/api/roles`      | ✅            | Get all roles   |
| GET    | `/api/roles/{id}` | ✅            | Get role by ID  |
| POST   | `/api/roles`      | ✅            | Create new role |
| PUT    | `/api/roles/{id}` | ✅            | Update role     |
| DELETE | `/api/roles/{id}` | ✅            | Delete role     |

---

## 📊 Data Models

### Account

```json
{
  "accountId": 1,
  "accountName": "John Doe",
  "email": "john@example.com",
  "password": "hashedPassword",
  "role": {
    "roleId": 1,
    "roleName": "USER"
  }
}
```

### Orchid

```json
{
  "orchidId": 1,
  "orchidName": "Phalaenopsis White",
  "orchidDescription": "Beautiful white orchid",
  "orchidUrl": "https://minio-url/orchid-image.jpg",
  "price": 25.99,
  "isNatural": true,
  "category": {
    "categoryId": 1,
    "categoryName": "Phalaenopsis"
  }
}
```

### Category

```json
{
  "categoryId": 1,
  "categoryName": "Phalaenopsis",
  "categoryDescription": "Moth orchids"
}
```

### Order

```json
{
  "orderId": 1,
  "orderDate": "2024-01-01T10:00:00",
  "orderStatus": "PENDING",
  "totalAmount": 25.99,
  "account": {
    "accountId": 1,
    "accountName": "John Doe"
  },
  "orderDetails": [
    {
      "orderDetailId": 1,
      "quantity": 1,
      "price": 25.99,
      "orchid": {
        "orchidId": 1,
        "orchidName": "Phalaenopsis White"
      }
    }
  ]
}
```

---

## 🔧 Request Examples

### Create Orchid (Multipart Form Data)

```javascript
const formData = new FormData();
formData.append("orchidName", "Phalaenopsis White");
formData.append("orchidDescription", "Beautiful white orchid");
formData.append("price", "25.99");
formData.append("isNatural", "true");
formData.append("categoryId", "1");
formData.append("orchidUrl", fileInput.files[0]);

fetch("/api/orchids", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
  },
  body: formData,
});
```

### Create Category (JSON)

```javascript
fetch("/api/categories", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    categoryName: "Phalaenopsis",
    categoryDescription: "Moth orchids",
  }),
});
```

### Get Orchids with Auth

```javascript
fetch("/api/orchids", {
  method: "GET",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

---

## ⚠️ Error Handling

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

### Error Response Format

```json
{
  "error": "Error message",
  "timestamp": "2024-01-01T10:00:00",
  "status": 400
}
```

### Authentication Error

```json
{
  "error": "Invalid credentials"
}
```

---

## 🛠️ Frontend Implementation Tips

### 1. Token Management

```javascript
// Store token in localStorage
localStorage.setItem("token", response.token);

// Get token for requests
const token = localStorage.getItem("token");

// Check if token is expired
const isTokenExpired = () => {
  const token = localStorage.getItem("token");
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};
```

### 2. API Service Class

```javascript
class ApiService {
  constructor() {
    this.baseURL = "http://localhost:8080";
    this.token = localStorage.getItem("token");
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem("token", token);
  }

  getHeaders() {
    const headers = {
      "Content-Type": "application/json",
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    const response = await fetch(url, config);

    if (response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
      return;
    }

    return response.json();
  }

  // Auth methods
  async login(username, password) {
    const response = await this.request("/api/accounts/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });

    if (response.token) {
      this.setToken(response.token);
    }

    return response;
  }

  async register(accountData) {
    return this.request("/api/accounts/register", {
      method: "POST",
      body: JSON.stringify(accountData),
    });
  }

  // Orchid methods
  async getOrchids() {
    return this.request("/api/orchids");
  }

  async createOrchid(formData) {
    const url = `${this.baseURL}/api/orchids`;
    const config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      body: formData,
    };

    const response = await fetch(url, config);
    return response.json();
  }

  // Category methods
  async getCategories() {
    return this.request("/api/categories");
  }

  async createCategory(categoryData) {
    return this.request("/api/categories", {
      method: "POST",
      body: JSON.stringify(categoryData),
    });
  }
}
```

### 3. Usage Example

```javascript
const api = new ApiService();

// Login
const loginResult = await api.login("admin", "admin123");

// Get orchids
const orchids = await api.getOrchids();

// Create orchid
const formData = new FormData();
formData.append("orchidName", "New Orchid");
formData.append("orchidDescription", "Description");
formData.append("price", "30.00");
formData.append("isNatural", "true");
formData.append("categoryId", "1");
formData.append("orchidUrl", file);

const newOrchid = await api.createOrchid(formData);
```

---

## 🔍 Swagger Documentation

Access interactive API documentation at:
**http://localhost:8080/swagger-ui.html**

- Test endpoints directly
- View request/response schemas
- Authorize with JWT token

---

## 📝 Notes

1. **File Upload**: Orchid images are stored in MinIO and served via URLs
2. **Token Expiry**: JWT tokens expire after 24 hours
3. **CORS**: API supports CORS for frontend integration
4. **Validation**: All inputs are validated on both client and server
5. **Error Handling**: Always check response status and handle errors gracefully

---

## 🚨 Security Considerations

1. **Never store passwords in plain text**
2. **Always use HTTPS in production**
3. **Validate all user inputs**
4. **Handle token expiration gracefully**
5. **Implement proper logout functionality**
6. **Use secure storage for sensitive data**
