# 🖼️ Frontend Image Loading Guide

## 🚨 Vấn đề: Ảnh hiện trắng

Khi gọi API `/api/orchids`, ảnh trả về URL dạng:

```
http://minio:9000/orchid-bucket/filename.jpg?X-Amz-Algorithm=...
```

**Vấn đề**: URL này chỉ hoạt động trong Docker network, không truy cập được từ browser.

---

## ✅ Giải pháp

### 1. Thay thế URL trong Frontend

```javascript
// Thay thế URL MinIO internal bằng URL public
function fixImageUrl(imageUrl) {
  if (!imageUrl) return "";

  // Thay thế minio:9000 bằng localhost:9000
  return imageUrl.replace("http://minio:9000", "http://localhost:9000");
}

// Sử dụng
const orchids = await api.getOrchids();
orchids.forEach((orchid) => {
  orchid.orchidUrl = fixImageUrl(orchid.orchidUrl);
});
```

### 2. Tạo Utility Function

```javascript
// utils/imageUtils.js
export const fixImageUrl = (imageUrl) => {
  if (!imageUrl) return "";

  // Loại bỏ query parameters presigned
  const baseUrl = imageUrl.split("?")[0];

  // Thay thế domain
  return baseUrl.replace("http://minio:9000", "http://localhost:9000");
};

// Sử dụng trong component
import { fixImageUrl } from "../utils/imageUtils";

function OrchidCard({ orchid }) {
  return (
    <div>
      <img
        src={fixImageUrl(orchid.orchidUrl)}
        alt={orchid.orchidName}
        onError={(e) => {
          // Fallback nếu ảnh lỗi
          e.target.src = "/placeholder-image.jpg";
        }}
      />
    </div>
  );
}
```

### 3. API Service Wrapper

```javascript
class ApiService {
  // ... existing code ...

  async getOrchids() {
    const orchids = await this.request("/api/orchids");

    // Fix image URLs
    return orchids.map((orchid) => ({
      ...orchid,
      orchidUrl: this.fixImageUrl(orchid.orchidUrl),
    }));
  }

  fixImageUrl(imageUrl) {
    if (!imageUrl) return "";
    const baseUrl = imageUrl.split("?")[0];
    return baseUrl.replace("http://minio:9000", "http://localhost:9000");
  }
}
```

---

## 🔧 Cách test

### 1. Kiểm tra URL trực tiếp

```javascript
// Lấy URL ảnh từ API
const orchids = await fetch("/api/orchids", {
  headers: { Authorization: `Bearer ${token}` },
}).then((r) => r.json());

console.log("Original URL:", orchids[0].orchidUrl);

// Fix URL
const fixedUrl = orchids[0].orchidUrl.replace(
  "http://minio:9000",
  "http://localhost:9000"
);
console.log("Fixed URL:", fixedUrl);
```

### 2. Test trong browser

- Mở Developer Tools
- Paste URL đã fix vào tab Network
- Kiểm tra response

---

## 🚨 Lưu ý quan trọng

### 1. CORS Issues

Nếu vẫn lỗi, thêm error handling:

```javascript
<img
  src={fixImageUrl(orchid.orchidUrl)}
  onError={(e) => {
    console.error("Image load failed:", e.target.src);
    e.target.src = "/fallback-image.jpg";
  }}
/>
```

### 2. Production Environment

Trong production, thay đổi URL:

```javascript
const isProduction = process.env.NODE_ENV === "production";
const minioUrl = isProduction
  ? "https://your-domain.com"
  : "http://localhost:9000";

function fixImageUrl(imageUrl) {
  return imageUrl.replace("http://minio:9000", minioUrl);
}
```

### 3. Alternative: Proxy Setup

Nếu vẫn không được, setup proxy trong development:

```javascript
// vite.config.js hoặc webpack.config.js
export default {
  server: {
    proxy: {
      "/minio": {
        target: "http://localhost:9000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/minio/, ""),
      },
    },
  },
};
```

---

## 📝 Tóm tắt

**Vấn đề**: URL MinIO internal không truy cập được từ browser
**Giải pháp**: Thay thế `minio:9000` bằng `localhost:9000`
**Code**:

```javascript
orchid.orchidUrl.replace("http://minio:9000", "http://localhost:9000");
```

**Kết quả**: Ảnh sẽ hiển thị bình thường! 🎉
