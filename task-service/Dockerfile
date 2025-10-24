# Use OpenJDK 17 as base image
#FROM openjdk:17-jdk-slim

# Set working directory
#WORKDIR /app

# Copy Maven wrapper and pom.xml
#COPY mvnw .
#COPY mvnw.cmd .
#COPY .mvn .mvn
#COPY pom.xml .

# Copy source code
#COPY src src

# Make Maven wrapper executable
#RUN chmod +x ./mvnw

# Build the application
#RUN ./mvnw clean package -DskipTests

# Expose port 8082
#EXPOSE 8082

# Run the application
#CMD ["java", "-jar", "target/task-service-0.0.1-SNAPSHOT.jar"]
# Use an official OpenJDK image that includes Maven
FROM maven:3.9.6-eclipse-temurin-17 AS build

# Set working directory
WORKDIR /app

# Copy pom.xml and source code
COPY pom.xml .
COPY src ./src

# Build the project (skip tests for faster deploy)
RUN mvn clean package -DskipTests

# Stage 2 - run the app
FROM eclipse-temurin:17-jdk
WORKDIR /app

# Copy JAR file from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose the app port
EXPOSE 8082

# Run the Spring Boot app
ENTRYPOINT ["java", "-jar", "app.jar"]
