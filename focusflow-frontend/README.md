# FocusFlow Frontend

A modern React-based task management application with JWT authentication and Bootstrap 5 styling.

## Features

- 🎯 **Task Management**: Create, read, update, and delete tasks
- 🔐 **JWT Authentication**: Secure login and registration
- 🎨 **Bootstrap 5**: Modern, responsive UI design
- 🔍 **Task Filtering**: Filter by status and priority
- 📱 **Responsive Design**: Works on all devices
- ⚡ **Real-time Updates**: Instant task management

## Technology Stack

- React 18.2.0
- React Router DOM 6.11.2
- Bootstrap 5.3.0
- React Bootstrap 2.7.2
- Axios 1.4.0
- Context API for state management

## Project Structure

```
focusflow-frontend/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── Header.js
│   │   ├── LoginForm.js
│   │   ├── RegisterForm.js
│   │   ├── TaskList.js
│   │   └── TaskForm.js
│   ├── contexts/
│   │   └── AuthContext.js
│   ├── pages/
│   │   ├── Dashboard.js
│   │   ├── Login.js
│   │   └── Register.js
│   ├── services/
│   │   └── api.js
│   ├── App.js
│   ├── index.js
│   └── index.css
├── package.json
├── env.example
└── README.md
```

## Prerequisites

- Node.js 16.0 or higher
- npm 7.0 or higher
- Backend services running (user-service and task-service)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd focusflow-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file and configure:
   ```env
   # Backend API Base URL
   REACT_APP_API_BASE_URL=http://localhost:8081
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_BASE_URL` | Backend API base URL | `http://localhost:8081` |

## Backend Integration

This frontend integrates with two backend services:

### User Service (Port 8081)
- **Authentication**: Login and registration
- **Endpoints**: `/api/auth/login`, `/api/auth/register`

### Task Service (Port 8082)
- **Task Management**: CRUD operations
- **Endpoints**: `/api/tasks/*`

## API Configuration

The application uses axios with interceptors for:

- **Automatic JWT token attachment** to all requests
- **Token expiration handling** with automatic logout
- **Error handling** for network and authentication errors

## Components

### Header
- Navigation bar with user authentication status
- Logout functionality
- Responsive design

### LoginForm
- Username and password authentication
- Form validation
- Error handling
- Auto-redirect after successful login

### RegisterForm
- User registration with validation
- Password confirmation
- Email validation
- Auto-login after registration

### TaskList
- Display tasks in card format
- Filter by status and priority
- Edit and delete actions
- Overdue task highlighting
- Responsive grid layout

### TaskForm
- Create new tasks
- Edit existing tasks
- Form validation
- Priority and status selection
- Due date picker

### Dashboard
- Main application page
- Task management interface
- Statistics and overview
- Quick actions

## Authentication Flow

1. **Login/Register**: User authenticates with backend
2. **Token Storage**: JWT token stored in localStorage
3. **Auto-attachment**: Token automatically added to API requests
4. **Expiration Handling**: Automatic logout on token expiration
5. **Route Protection**: Protected routes require authentication

## Styling

- **Bootstrap 5**: Modern CSS framework
- **Custom CSS**: Additional styling in `index.css`
- **Responsive Design**: Mobile-first approach
- **Color Coding**: Priority and status indicators
- **Hover Effects**: Interactive task cards

## Available Scripts

- `npm start`: Start development server
- `npm build`: Build for production
- `npm test`: Run tests
- `npm eject`: Eject from Create React App

## Production Build

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Serve the build folder**
   ```bash
   npx serve -s build
   ```

## Docker Support

Create a `Dockerfile` for containerization:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure backend services have CORS enabled
   - Check API base URL configuration

2. **Authentication Issues**
   - Verify JWT token is being stored correctly
   - Check token expiration
   - Ensure backend is running

3. **API Connection Issues**
   - Verify backend services are running
   - Check environment variables
   - Test API endpoints directly

### Development Tips

- Use browser developer tools to inspect network requests
- Check console for error messages
- Verify localStorage for JWT token storage
- Test API endpoints with tools like Postman

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
