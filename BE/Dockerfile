# Multi-stage Dockerfile for Spring Boot Backend
# Stage 1: Build stage
FROM maven:3.9.9-eclipse-temurin-21-alpine AS builder

# Set working directory
WORKDIR /build

# Copy Maven wrapper and pom.xml first (for better layer caching)
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./

# Download dependencies (cached layer if pom.xml doesn't change)
RUN ./mvnw dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application (skip tests for faster builds)
RUN ./mvnw clean package -DskipTests -B

# Stage 2: Runtime stage
FROM eclipse-temurin:21-jre-alpine

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user for security
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

# Set working directory
WORKDIR /app

# Copy the built artifact from builder stage
COPY --from=builder /build/target/*.jar app.jar

# Change ownership to non-root user
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose application port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Run the application with optimized JVM settings
CMD ["java", \
     "-XX:+UseContainerSupport", \
     "-XX:MaxRAMPercentage=75.0", \
     "-XX:+ExitOnOutOfMemoryError", \
     "-Djava.security.egd=file:/dev/./urandom", \
     "-jar", \
     "app.jar"]
