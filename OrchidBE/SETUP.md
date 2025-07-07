# Hướng dẫn chạy lại Docker Orchid Service (MongoDB)

## 📋 Yêu cầu trước khi chạy

- Docker và Docker Compose đã được cài đặt
- Port 8080, 27017, 9000, 9001, 3000, 9090 không bị chiếm dụng

## 🚀 Các bước chạy lại từ đầu

### 1. Dừng và xóa tất cả containers (nếu đang chạy)

```bash
# Dừng tất cả services
docker-compose down

# Xóa tất cả containers, networks, và volumes (nếu muốn reset hoàn toàn)
docker-compose down -v --remove-orphans

# Xóa images cũ (tùy chọn)
docker system prune -a
```

### 2. Tạo file môi trường `.env`

Tạo file `.env` trong thư mục gốc với nội dung:

```env
# MinIO Configuration
MINIO_ROOT_USER=orchid_admin
MINIO_ROOT_PASSWORD=SecurePassword@1234
MINIO_ACCESS_KEY=orchid_admin
MINIO_SECRET_KEY=SecurePassword@1234
MINIO_BUCKET=orchid-bucket

# JWT Configuration
JWT_SECRET=SuUqVc2LvgKHevyQg03Ua5WCiHRd2IaJe0jaVjHqD7U=
JWT_EXPIRATION=86400000

# Grafana Configuration
GRAFANA_ADMIN_PASSWORD=StrongGrafanaPassword789!

# Application Configuration
SPRING_PROFILES_ACTIVE=docker
```

### 3. Khởi động infrastructure services trước

```bash
# Khởi động MongoDB và MinIO trước
docker-compose up -d mongo minio

# Chờ các services khởi động hoàn tất (khoảng 30-60 giây)
docker-compose logs -f mongo
```

### 4. Khởi động tất cả services

```bash
# Khởi động toàn bộ stack
docker-compose up -d

# Hoặc khởi động với logs hiển thị
docker-compose up
```

## 🔍 Kiểm tra và debug

### Xem trạng thái các services

```bash
# Kiểm tra status
docker-compose ps

# Xem logs của service cụ thể
docker-compose logs -f orchid-service
docker-compose logs -f mongo
docker-compose logs -f minio
```

### Test các endpoints

```bash
# Test Spring Boot health check
curl http://localhost:8080/actuator/health

# Test MinIO (trong browser)
# http://localhost:9001
# Username: orchid_admin
# Password: SecurePassword@1234

# Test Grafana (trong browser)
# http://localhost:3000
# Username: admin
# Password: StrongGrafanaPassword789!
```

## 🛠️ Troubleshooting

### Nếu orchid-service không start

```bash
# Kiểm tra logs chi tiết
docker-compose logs orchid-service

# Restart service
docker-compose restart orchid-service

# Nếu vẫn lỗi, kiểm tra kết nối database
# Kiểm tra logs của mongo
docker-compose logs mongo
```

### Nếu MongoDB không khởi động

```bash
# Kiểm tra logs
docker-compose logs mongo

# Kiểm tra port
netstat -an | findstr :27017

# Restart MongoDB
docker-compose restart mongo
```

### Nếu MinIO không khởi động

```bash
# Kiểm tra logs
docker-compose logs minio

# Kiểm tra port
netstat -an | findstr :9000

# Restart MinIO
docker-compose restart minio
```

## 📊 Monitoring và Management

### Truy cập các service

- **Orchid API**: http://localhost:8080
- **MinIO Console**: http://localhost:9001
- **Grafana**: http://localhost:3000
- **Prometheus**: http://localhost:9090

### Backup và restore

```bash
# Backup volumes
docker-compose exec backup-service ls -la /backup/output

# Manual backup
# (Thay đổi volume nếu muốn backup MongoDB)
docker run --rm -v orchidbe_mongo-data:/source -v $(pwd)/backup:/backup alpine tar -czf /backup/mongo-backup.tar.gz /source
```

## 🔧 Lệnh hữu ích khác

### Xem resource usage

```bash
# Xem CPU/Memory usage
docker stats

# Xem disk usage
docker system df
```

### Cleanup

```bash
# Xóa images không dùng
docker image prune

# Xóa volumes không dùng
docker volume prune

# Xóa networks không dùng
docker network prune
```

### Development mode

```bash
# Chạy chỉ MongoDB và MinIO cho development
docker-compose up -d mongo minio

# Chạy Spring Boot locally với application.properties cấu hình:
# spring.data.mongodb.uri=mongodb://localhost:27017/orchid
```

## 🚨 Lưu ý quan trọng

1. **Đợi MongoDB khởi động hoàn tất** trước khi start ứng dụng
2. **Kiểm tra ports** không bị chiếm dụng
3. **Sử dụng file .env** để quản lý môi trường
4. **Backup dữ liệu** thường xuyên

## 📝 Thứ tự khởi động khuyến nghị

1. `mongo` + `minio` (infrastructure)
2. `orchid-service` (application)
3. `prometheus` + `grafana` (monitoring)
4. `backup-service` (backup)

Theo thứ tự này sẽ đảm bảo các dependencies được khởi động đúng cách.
