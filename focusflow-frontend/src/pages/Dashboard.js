import React, { useState } from 'react';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import { taskAPI } from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [error, setError] = useState('');

  const handleCreateTask = () => {
    setEditingTask(null);
    setShowTaskForm(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskAPI.deleteTask(taskId);
        setRefreshTrigger(prev => prev + 1);
        setError('');
      } catch (err) {
        setError('Failed to delete task. Please try again.');
        console.error('Error deleting task:', err);
      }
    }
  };

  const handleTaskFormSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
    setError('');
  };

  const handleCloseTaskForm = () => {
    setShowTaskForm(false);
    setEditingTask(null);
  };

  return (
    <Container fluid className="py-4">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="h2 mb-1">Welcome back, {user?.username}!</h1>
              <p className="text-muted">Manage your tasks and stay focused</p>
            </div>
            <Button 
              variant="primary" 
              size="lg"
              onClick={handleCreateTask}
            >
              <i className="bi bi-plus-circle me-2"></i>
              Add New Task
            </Button>
          </div>

          {error && (
            <Alert variant="danger" dismissible onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          <TaskList
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            refreshTrigger={refreshTrigger}
          />

          <TaskForm
            show={showTaskForm}
            onHide={handleCloseTaskForm}
            task={editingTask}
            onSuccess={handleTaskFormSuccess}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
