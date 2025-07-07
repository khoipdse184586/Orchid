# Orchid Service

Orchid Service là một RESTful API được xây dựng bằng Spring Boot, cung cấp các chức năng quản lý dữ liệu với tích hợp SQL Server và MinIO object storage.

## 📋 Mục lục

- [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
- [Cài đặt và chạy](#cài-đặt-và-chạy)
  - [Chạy với Docker (Khuyến nghị)](#chạy-với-docker-khuyến-nghị)
  - [Chạy local development](#chạy-local-development)
- [Cấu hình](#cấu-hình)
- [Monitoring và Logging](#monitoring-và-logging)
- [API Documentation](#api-documentation)
- [Kiểm tra ứng dụng](#kiểm-tra-ứng-dụng)
- [Sao lưu và phục hồi](#sao-lưu-và-phục-hồi)
- [Môi trường Production](#môi-trường-production)
- [CI/CD](#cicd)
- [Troubleshooting](#troubleshooting)

## 🔧 Yêu cầu hệ thống

### Để chạy với Docker:

- Docker 20.10+
- Docker Compose 2.0+
- Git

### Để chạy local development:

- Java 17+
- Maven 3.6+
- SQL Server 2019+ hoặc SQL Server Express
- Git

## 🚀 Cài đặt và chạy

### 1. Clone repository

```bash
git clone <repository-url>
cd orchid-service
```

### 2. Chạy với Docker (Khuyến nghị)

#### Bước 1: Tạo file .env

```bash
cp .env.example .env
```

Hoặc tạo file `.env` với nội dung:

```env
# Database Configuration
SPRING_DATASOURCE_USERNAME=sa
SPRING_DATASOURCE_PASSWORD=SecurePassword@123

# MinIO Configuration
MINIO_ROOT_USER=orchid_admin
MINIO_ROOT_PASSWORD=SecurePassword@1234
MINIO_ACCESS_KEY=dzBkJVM5Sam7yYJd58zAJcNb9h9WrIqpzphvzOpY2Yc=
MINIO_SECRET_KEY=5TmNPDaPhi9dvmVXo57CFNsOM7zkRPqy2wnyAS5Le/M=
MINIO_BUCKET=orchid-bucket

# JWT Configuration
JWT_SECRET=SuUqVc2LvgKHevyQg03Ua5WCiHRd2IaJe0jaVjHqD7U=
JWT_EXPIRATION=86400000

# Grafana Configuration
GRAFANA_ADMIN_PASSWORD=StrongGrafanaPassword789!

# Application Configuration
SPRING_PROFILES_ACTIVE=docker
```

#### Bước 2: Build và chạy ứng dụng

```bash
# Build JAR file
mvn clean package -DskipTests

# Chạy tất cả services với Docker Compose
docker-compose up -d

# Xem logs
docker-compose logs -f orchid-service
```

#### Bước 3: Truy cập ứng dụng

- **API**: http://localhost:8080
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **MinIO Console**: http://localhost:9001 (orchid_admin/SecurePassword@1234)
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3000 (admin/StrongGrafanaPassword789!)

### 3. Chạy local development

#### Bước 1: Cài đặt SQL Server

- Cài đặt SQL Server hoặc SQL Server Express
- Tạo database `OrchidDB`
- Đảm bảo SQL Server chạy trên port 1433

#### Bước 2: Chạy MinIO (tuỳ chọn)

```bash
# Chạy chỉ MinIO
docker run -d \
  --name minio \
  -p 9000:9000 -p 9001:9001 \
  -e MINIO_ROOT_USER=orchid_admin \
  -e MINIO_ROOT_PASSWORD=SecurePassword@1234 \
  -v minio-data:/data \
  minio/minio server /data --console-address ":9001"
```

#### Bước 3: Cấu hình môi trường

```bash
# Tạo file .env cho local
echo "SPRING_PROFILES_ACTIVE=local" > .env
```

#### Bước 4: Chạy ứng dụng

```bash
# Build project
mvn clean compile

# Chạy ứng dụng
mvn spring-boot:run

# Hoặc build JAR và chạy
mvn clean package -DskipTests
java -jar target/orchid-service.jar
```

## ⚙️ Cấu hình

### Environment Variables

| Variable                     | Mô tả                    | Default Value                                                                       |
| ---------------------------- | ------------------------ | ----------------------------------------------------------------------------------- |
| `SPRING_DATASOURCE_URL`      | Database connection URL  | `jdbc:sqlserver://localhost:1433;databaseName=OrchidDB;trustServerCertificate=true` |
| `SPRING_DATASOURCE_USERNAME` | Database username        | `sa`                                                                                |
| `SPRING_DATASOURCE_PASSWORD` | Database password        | `SecurePassword@123`                                                                |
| `MINIO_ENDPOINT`             | MinIO endpoint URL       | `http://localhost:9000`                                                             |
| `MINIO_ACCESS_KEY`           | MinIO access key         | `dzBkJVM5Sam7yYJd58zAJcNb9h9WrIqpzphvzOpY2Yc=`                                      |
| `MINIO_SECRET_KEY`           | MinIO secret key         | `5TmNPDaPhi9dvmVXo57CFNsOM7zkRPqy2wnyAS5Le/M=`                                      |
| `MINIO_BUCKET`               | MinIO bucket name        | `orchid-bucket`                                                                     |
| `JWT_SECRET`                 | JWT secret key           | `SuUqVc2LvgKHevyQg03Ua5WCiHRd2IaJe0jaVjHqD7U=`                                      |
| `JWT_EXPIRATION`             | JWT expiration time (ms) | `86400000`                                                                          |
| `GRAFANA_ADMIN_PASSWORD`     | Grafana admin password   | `StrongGrafanaPassword789!`                                                         |

### Profiles

- **local**: Để phát triển local
- **docker**: Để chạy trong Docker container
- **prod**: Để production (xem [Môi trường Production](#môi-trường-production))

## 📊 Monitoring và Logging

### Prometheus & Grafana

Hệ thống bao gồm Prometheus và Grafana để giám sát:

- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3000 (admin/StrongGrafanaPassword789!)

Dashboards mặc định:

- Spring Boot Application
- JVM (Micrometer)
- SQL Server Metrics
- MinIO Metrics

### Logging

Logs được lưu tại:

- **Container logs**: `docker-compose logs -f [service-name]`
- **Application logs**: `./logs/orchid-service.log`

## 📚 API Documentation

Sau khi chạy ứng dụng, truy cập:

- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/v3/api-docs

## 🔍 Kiểm tra ứng dụng

### Health Check

```bash
curl http://localhost:8080/actuator/health
```

### Test API

```bash
# Example API call
curl -X GET http://localhost:8080/api/orchids \
  -H "Content-Type: application/json"
```

### Kiểm tra MinIO

1. Truy cập MinIO Console: http://localhost:9001
2. Login: `orchid_admin`/`SecurePassword@1234`
3. Tạo bucket `orchid-bucket` nếu chưa có

## 💾 Sao lưu và phục hồi

### Sao lưu tự động

Hệ thống bao gồm service sao lưu tự động:

- Sao lưu hàng ngày vào lúc 2:00 AM
- Dữ liệu sao lưu được lưu trong thư mục `./backup`
- Các file sao lưu cũ hơn 7 ngày sẽ tự động bị xóa

### Sao lưu thủ công

```bash
# Chạy backup thủ công
docker-compose exec backup-service sh -c "tar -czf /backup/output/manual-backup-$(date +%Y%m%d%H%M%S).tar.gz /backup/sqlserver /backup/minio"
```

### Phục hồi dữ liệu

```bash
# Dừng các services
docker-compose down

# Giải nén file backup
tar -xzf ./backup/backup-YYYYMMDDHHMMSS.tar.gz -C /tmp

# Copy dữ liệu vào volumes
# (Cần điều chỉnh đường dẫn tùy theo cấu hình Docker volumes)
```

## 🌍 Môi trường Production

Để triển khai trong môi trường production, sử dụng file `docker-compose.prod.yml`:

```bash
# Chạy trong môi trường production
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

Cấu hình production bao gồm:

- SSL/TLS với HTTPS
- Nginx làm load balancer
- Nhiều instances của ứng dụng
- Redis caching
- Cấu hình tối ưu hiệu suất

### Cấu hình SSL

Đặt các file chứng chỉ SSL vào thư mục `./nginx/ssl/`:

- `server.crt`
- `server.key`
- `dhparam.pem`

Cập nhật biến môi trường trong `.env`:

```env
SSL_KEYSTORE_PASSWORD=your_keystore_password
```

## 🔄 CI/CD

Dự án được cấu hình với GitHub Actions để CI/CD tự động:

- **Build & Test**: Tự động khi push hoặc tạo pull request
- **Docker Image**: Tự động build và push lên Docker Hub khi merge vào nhánh main
- **Deployment**: Tự động triển khai lên các môi trường thích hợp

Xem `.github/workflows/ci-cd.yml` để biết chi tiết cấu hình.

## 🛠️ Troubleshooting

### Lỗi thường gặp

#### 1. Connection to SQL Server failed

```bash
# Kiểm tra SQL Server có chạy không
docker-compose logs sqlserver

# Kiểm tra connection trong container
docker exec -it orchid-service curl -f http://localhost:8080/actuator/health
```

#### 2. MinIO connection failed

```bash
# Kiểm tra MinIO service
docker-compose logs minio

# Test MinIO connection
curl http://localhost:9000/minio/health/live
```

#### 3. Application không start

```bash
# Xem logs chi tiết
docker-compose logs orchid-service

# Kiểm tra port conflicts
netstat -tulpn | grep :8080
```

#### 4. Database schema issues

```sql
-- Connect to SQL Server và check database
USE OrchidDB;
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES;
```

#### 5. Monitoring systems không hoạt động

```bash
# Kiểm tra Prometheus
docker-compose logs prometheus

# Kiểm tra Grafana
docker-compose logs grafana

# Kiểm tra endpoint metrics
curl http://localhost:8080/actuator/prometheus
```

### Useful Commands

```bash
# Restart tất cả services
docker-compose restart

# Rebuild và restart application
docker-compose up --build orchid-service

# Stop tất cả services
docker-compose down

# Stop và xóa volumes (cẩn thận - sẽ mất data!)
docker-compose down -v

# Xem logs của service cụ thể
docker-compose logs -f orchid-service

# Vào container để debug
docker exec -it orchid-service /bin/bash

# Kiểm tra metrics
curl -s http://localhost:8080/actuator/metrics | jq

# Kiểm tra health
curl -s http://localhost:8080/actuator/health | jq
```

## 🚨 Bảo mật

- Đổi tất cả mật khẩu mặc định trước khi triển khai
- Sử dụng HTTPS trong môi trường production
- Hạn chế quyền truy cập vào các endpoints Actuator
- Cập nhật JWT secret bằng khóa mạnh và độc nhất
- Thường xuyên cập nhật các dependencies để tránh lỗ hổng bảo mật

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Support

Nếu gặp vấn đề, vui lòng:

- Kiểm tra [Troubleshooting](#troubleshooting) section
- Tạo issue trên GitHub
- Liên hệ team development
