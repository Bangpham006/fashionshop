# Stage 1: Build Spring Boot JAR with Maven
FROM maven:3.9.6-eclipse-temurin-21-alpine AS builder
WORKDIR /app

# Copy pom.xml and source code
COPY pom.xml .
COPY src ./src

# Build JAR with tests skipped
RUN mvn clean package -DskipTests

# Stage 2: Lightweight JRE 21 Runtime Image
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy built JAR from builder stage
COPY --from=builder /app/target/fashionshop-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

# Environment variables with optimized JVM memory
ENV JAVA_OPTS="-XX:+UseSerialGC -Xmx384m -Xms128m"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
