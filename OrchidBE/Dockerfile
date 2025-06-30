# Giai đoạn build
FROM maven:3.8-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests

# Giai đoạn chạy
FROM eclipse-temurin:17-jre-jammy
RUN addgroup --system spring && adduser --system spring --ingroup spring
WORKDIR /app

# Cài đặt curl cho healthcheck
RUN apt-get update && apt-get install -y curl && apt-get clean

# Tạo thư mục logs và cấp quyền
RUN mkdir -p /app/logs && chown -R spring:spring /app

# Copy JAR từ giai đoạn build
COPY --from=build /app/target/orchid-service.jar /app/orchid-service.jar
COPY --chown=spring:spring --from=build /app/target/orchid-service.jar /app/orchid-service.jar

# Expose port
EXPOSE 8080

# Cấu hình health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

# Chuyển sang user không phải root
USER spring:spring

# Entry point với JVM options tối ưu
ENTRYPOINT ["java", "-Xmx512m", "-Xms256m", "-XX:+UseG1GC", "-XX:MaxGCPauseMillis=200", "-Djava.security.egd=file:/dev/./urandom", "-jar", "/app/orchid-service.jar"]