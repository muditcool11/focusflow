## Multi-stage Dockerfile: build with official Maven image, run with lightweight JRE

### Build stage ###
FROM maven:3.9.5-eclipse-temurin-17 AS build

WORKDIR /workspace

# Copy POM first to leverage Docker layer caching for dependencies
COPY pom.xml ./

# Copy source
COPY src ./src

# Build the application (skip tests for faster build)
RUN mvn -B -f pom.xml clean package -DskipTests


### Runtime stage ###
FROM eclipse-temurin:17-jre-jammy

WORKDIR /app

# Copy the built jar from the build stage
COPY --from=build /workspace/target/task-service-0.0.1-SNAPSHOT.jar ./task-service.jar

EXPOSE 8082

ENTRYPOINT ["java", "-jar", "/app/task-service.jar"]
