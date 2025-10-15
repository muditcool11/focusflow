# Task Service

A Spring Boot 3 microservice for task management with JWT authentication.

## Features

- Task CRUD operations (Create, Read, Update, Delete)
- JWT authentication and authorization
- Task filtering by status and date range
- Overdue task detection
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

All endpoints require JWT authentication via the `Authorization: Bearer <token>` header.

### Task Management

#### Get All Tasks
- **GET** `/api/tasks`
- **Headers**: `Authorization: Bearer <jwt_token>`
- **Response** (200 OK):
  ```json
  [
    {
      "id": 1,
      "title": "Complete project documentation",
      "description": "Write comprehensive documentation for the project",
      "priority": "HIGH",
      "status": "IN_PROGRESS",
      "dueDate": "2024-01-15T10:00:00",
      "userId": 123,
      "createdAt": "2024-01-01T09:00:00",
      "updatedAt": "2024-01-02T14:30:00"
    }
  ]
  ```

#### Get Task by ID
- **GET** `/api/tasks/{id}`
- **Headers**: `Authorization: Bearer <jwt_token>`
- **Response** (200 OK):
  ```json
  {
    "id": 1,
    "title": "Complete project documentation",
    "description": "Write comprehensive documentation for the project",
    "priority": "HIGH",
    "status": "IN_PROGRESS",
    "dueDate": "2024-01-15T10:00:00",
    "userId": 123,
    "createdAt": "2024-01-01T09:00:00",
    "updatedAt": "2024-01-02T14:30:00"
  }
  ```

#### Create Task
- **POST** `/api/tasks`
- **Headers**: `Authorization: Bearer <jwt_token>`, `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "title": "New Task",
    "description": "Task description",
    "priority": "MEDIUM",
    "status": "TODO",
    "dueDate": "2024-01-20T15:00:00"
  }
  ```
- **Response** (201 Created):
  ```json
  {
    "id": 2,
    "title": "New Task",
    "description": "Task description",
    "priority": "MEDIUM",
    "status": "TODO",
    "dueDate": "2024-01-20T15:00:00",
    "userId": 123,
    "createdAt": "2024-01-01T10:00:00",
    "updatedAt": "2024-01-01T10:00:00"
  }
  ```

#### Update Task
- **PUT** `/api/tasks/{id}`
- **Headers**: `Authorization: Bearer <jwt_token>`, `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "title": "Updated Task",
    "description": "Updated description",
    "priority": "HIGH",
    "status": "IN_PROGRESS",
    "dueDate": "2024-01-25T12:00:00"
  }
  ```
- **Response** (200 OK):
  ```json
  {
    "id": 1,
    "title": "Updated Task",
    "description": "Updated description",
    "priority": "HIGH",
    "status": "IN_PROGRESS",
    "dueDate": "2024-01-25T12:00:00",
    "userId": 123,
    "createdAt": "2024-01-01T09:00:00",
    "updatedAt": "2024-01-02T16:00:00"
  }
  ```

#### Delete Task
- **DELETE** `/api/tasks/{id}`
- **Headers**: `Authorization: Bearer <jwt_token>`
- **Response** (200 OK):
  ```json
  {
    "message": "Task deleted successfully"
  }
  ```

### Task Filtering

#### Get Tasks by Status
- **GET** `/api/tasks/status/{status}`
- **Headers**: `Authorization: Bearer <jwt_token>`
- **Path Parameters**:
  - `status`: `TODO`, `IN_PROGRESS`, or `DONE`
- **Response** (200 OK): Array of tasks with the specified status

#### Get Overdue Tasks
- **GET** `/api/tasks/overdue`
- **Headers**: `Authorization: Bearer <jwt_token>`
- **Response** (200 OK): Array of overdue tasks

## Data Models

### Task Entity
```java
{
  "id": Long,                    // Auto-generated ID
  "title": String,               // Task title (required, max 255 chars)
  "description": String,         // Task description (max 1000 chars)
  "priority": Priority,          // LOW, MEDIUM, or HIGH
  "status": Status,              // TODO, IN_PROGRESS, or DONE
  "dueDate": LocalDateTime,      // Due date and time
  "userId": Long,                // Owner's user ID
  "createdAt": LocalDateTime,    // Creation timestamp
  "updatedAt": LocalDateTime     // Last update timestamp
}
```

### Priority Enum
- `LOW`
- `MEDIUM`
- `HIGH`

### Status Enum
- `TODO`
- `IN_PROGRESS`
- `DONE`

## Environment Variables

The following environment variables can be configured:

- `SPRING_DATASOURCE_URL`: MySQL database URL (default: `jdbc:mysql://localhost:3306/taskdb`)
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
   cd task-service
   ```

2. **Set up MySQL database**
   ```sql
   CREATE DATABASE taskdb;
   ```

3. **Configure environment variables** (optional)
   ```bash
   export SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/taskdb
   export SPRING_DATASOURCE_USERNAME=your_username
   export SPRING_DATASOURCE_PASSWORD=your_password
   export JWT_SECRET=your_jwt_secret
   ```

4. **Run the application**
   ```bash
   ./mvnw spring-boot:run
   ```

The application will be available at `http://localhost:8082`

### Docker

1. **Build the Docker image**
   ```bash
   docker build -t task-service .
   ```

2. **Run the container**
   ```bash
   docker run -p 8082:8082 \
     -e SPRING_DATASOURCE_URL=jdbc:mysql://host.docker.internal:3306/taskdb \
     -e SPRING_DATASOURCE_USERNAME=root \
     -e SPRING_DATASOURCE_PASSWORD=password \
     task-service
   ```

## Database Schema

The application uses the following table structure:

```sql
CREATE TABLE tasks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(1000),
    priority ENUM('LOW', 'MEDIUM', 'HIGH') NOT NULL,
    status ENUM('TODO', 'IN_PROGRESS', 'DONE') NOT NULL,
    due_date DATETIME,
    user_id BIGINT NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME
);
```

## Security

- JWT tokens are required for all API endpoints
- Tasks are isolated by user ID
- Users can only access their own tasks
- JWT tokens are signed using HS256 algorithm
- Authentication is stateless (no server-side sessions)
- CORS is enabled for cross-origin requests

## Testing the API

### Using curl

**Get all tasks:**
```bash
curl -X GET http://localhost:8082/api/tasks \
  -H "Authorization: Bearer your_jwt_token"
```

**Create a new task:**
```bash
curl -X POST http://localhost:8082/api/tasks \
  -H "Authorization: Bearer your_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Task",
    "description": "Task description",
    "priority": "MEDIUM",
    "status": "TODO",
    "dueDate": "2024-01-20T15:00:00"
  }'
```

**Update a task:**
```bash
curl -X PUT http://localhost:8082/api/tasks/1 \
  -H "Authorization: Bearer your_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Task",
    "description": "Updated description",
    "priority": "HIGH",
    "status": "IN_PROGRESS",
    "dueDate": "2024-01-25T12:00:00"
  }'
```

**Delete a task:**
```bash
curl -X DELETE http://localhost:8082/api/tasks/1 \
  -H "Authorization: Bearer your_jwt_token"
```

**Get tasks by status:**
```bash
curl -X GET http://localhost:8082/api/tasks/status/TODO \
  -H "Authorization: Bearer your_jwt_token"
```

**Get overdue tasks:**
```bash
curl -X GET http://localhost:8082/api/tasks/overdue \
  -H "Authorization: Bearer your_jwt_token"
```

## Error Responses

### 401 Unauthorized
```json
{
  "error": "Invalid or missing token"
}
```

### 404 Not Found
```json
{
  "error": "Task not found"
}
```

### 400 Bad Request
```json
{
  "error": "Validation failed",
  "details": "Title is required"
}
```

## Project Structure

```
task-service/
├── src/main/java/com/example/taskservice/
│   ├── controller/
│   │   └── TaskController.java
│   ├── entity/
│   │   ├── Task.java
│   │   ├── Priority.java
│   │   └── Status.java
│   ├── repository/
│   │   └── TaskRepository.java
│   ├── security/
│   │   ├── JwtAuthenticationFilter.java
│   │   └── SecurityConfig.java
│   ├── service/
│   │   └── TaskService.java
│   ├── util/
│   │   └── JwtUtil.java
│   └── TaskServiceApplication.java
├── src/main/resources/
│   └── application.properties
├── src/test/java/com/example/taskservice/
│   └── TaskServiceApplicationTests.java
├── Dockerfile
├── pom.xml
└── README.md
```
