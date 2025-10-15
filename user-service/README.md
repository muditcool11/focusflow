# User Service

A Spring Boot 3 microservice for user authentication with JWT tokens.

## Features

- User registration and login
- JWT authentication with HS256 algorithm
- BCrypt password encryption
- MySQL database integration
- RESTful API endpoints

## Technology Stack

- Spring Boot 3.2.0
- Spring Security
- Spring Data JPA
- MySQL 8.0
- JWT (JSON Web Tokens)
- Maven
- Docker

## API Endpoints

### Authentication

#### Register User
- **POST** `/api/auth/register`
- **Content-Type**: `application/json`
- **Request Body**:
  ```json
  {
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response** (201 Created):
  ```json
  {
    "message": "User registered successfully",
    "user": {
      "id": 1,
      "username": "johndoe",
      "email": "john@example.com"
    }
  }
  ```

#### Login User
- **POST** `/api/auth/login`
- **Content-Type**: `application/json`
- **Request Body**:
  ```json
  {
    "username": "johndoe",
    "password": "password123"
  }
  ```
- **Response** (200 OK):
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "type": "Bearer",
    "username": "johndoe",
    "email": "john@example.com"
  }
  ```

## Environment Variables

The following environment variables can be configured:

- `SPRING_DATASOURCE_URL`: MySQL database URL (default: `jdbc:mysql://localhost:3306/userdb`)
- `SPRING_DATASOURCE_USERNAME`: Database username (default: `root`)
- `SPRING_DATASOURCE_PASSWORD`: Database password (default: `password`)
- `JWT_SECRET`: JWT signing secret (default: `mySecretKey`)
- `JWT_EXPIRATION`: JWT expiration time in milliseconds (default: `86400000` - 24 hours)

## Running the Application

### Prerequisites

- Java 17 or higher
- Maven 3.6 or higher
- MySQL 8.0 or higher

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd user-service
   ```

2. **Set up MySQL database**
   ```sql
   CREATE DATABASE userdb;
   ```

3. **Configure environment variables** (optional)
   ```bash
   export SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/userdb
   export SPRING_DATASOURCE_USERNAME=your_username
   export SPRING_DATASOURCE_PASSWORD=your_password
   export JWT_SECRET=your_jwt_secret
   ```

4. **Run the application**
   ```bash
   mvn spring-boot:run
   ```

The application will be available at `http://localhost:8081`

### Docker

1. **Build the Docker image**
   ```bash
   docker build -t user-service .
   ```

2. **Run the container**
   ```bash
   docker run -p 8081:8081 \
     -e SPRING_DATASOURCE_URL=jdbc:mysql://host.docker.internal:3306/userdb \
     -e SPRING_DATASOURCE_USERNAME=root \
     -e SPRING_DATASOURCE_PASSWORD=password \
     user-service
   ```

## Database Schema

The application uses the following table structure:

```sql
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);
```

## Security

- Passwords are encrypted using BCrypt
- JWT tokens are signed using HS256 algorithm
- Authentication is stateless (no server-side sessions)
- CORS is enabled for cross-origin requests

## Testing the API

### Using curl

**Register a new user:**
```bash
curl -X POST http://localhost:8081/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

## Project Structure

```
user-service/
├── src/main/java/com/example/userservice/
│   ├── controller/
│   │   └── AuthController.java
│   ├── dto/
│   │   ├── LoginRequest.java
│   │   ├── LoginResponse.java
│   │   └── RegisterRequest.java
│   ├── entity/
│   │   └── User.java
│   ├── repository/
│   │   └── UserRepository.java
│   ├── security/
│   │   ├── JwtAuthenticationFilter.java
│   │   └── SecurityConfig.java
│   ├── service/
│   │   └── UserService.java
│   ├── util/
│   │   └── JwtUtil.java
│   └── UserServiceApplication.java
├── src/main/resources/
│   └── application.yml
├── Dockerfile
├── pom.xml
└── README.md
```
