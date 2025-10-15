import React, { useState, useEffect } from 'react';
import { Card, Badge, Button, Row, Col, Form, Alert } from 'react-bootstrap';
import { taskAPI } from '../services/api';

const TaskList = ({ onEditTask, onDeleteTask, refreshTrigger }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    priority: ''
  });

  useEffect(() => {
    fetchTasks();
  }, [refreshTrigger]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await taskAPI.getTasks();
      setTasks(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch tasks. Please try again.');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH': return 'danger';
      case 'MEDIUM': return 'warning';
      case 'LOW': return 'success';
      default: return 'secondary';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'TODO': return 'secondary';
      case 'IN_PROGRESS': return 'warning';
      case 'DONE': return 'success';
      default: return 'secondary';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isOverdue = (dueDate, status) => {
    if (!dueDate || status === 'DONE') return false;
    return new Date(dueDate) < new Date();
  };

  const filteredTasks = tasks.filter(task => {
    if (filters.status && task.status !== filters.status) return false;
    if (filters.priority && task.priority !== filters.priority) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Filters */}
      <Card className="filter-section mb-4">
        <Card.Body>
          <Row>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Filter by Status</Form.Label>
                <Form.Select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <option value="">All Statuses</option>
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="DONE">Done</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Filter by Priority</Form.Label>
                <Form.Select
                  value={filters.priority}
                  onChange={(e) => handleFilterChange('priority', e.target.value)}
                >
                  <option value="">All Priorities</option>
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4} className="d-flex align-items-end">
              <Button 
                variant="outline-secondary" 
                onClick={() => setFilters({ status: '', priority: '' })}
              >
                Clear Filters
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <Card>
          <Card.Body className="text-center py-5">
            <h5 className="text-muted">No tasks found</h5>
            <p className="text-muted">
              {tasks.length === 0 
                ? "You don't have any tasks yet. Create your first task to get started!"
                : "No tasks match your current filters. Try adjusting your filter criteria."
              }
            </p>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {filteredTasks.map(task => (
            <Col key={task.id} lg={6} xl={4} className="mb-3">
              <Card 
                className={`task-card h-100 priority-${task.priority.toLowerCase()} status-${task.status.toLowerCase()}`}
              >
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h6 className="card-title mb-0">{task.title}</h6>
                    <div className="d-flex gap-1">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => onEditTask(task)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => onDeleteTask(task.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                  
                  {task.description && (
                    <p className="card-text text-muted small mb-2">
                      {task.description}
                    </p>
                  )}
                  
                  <div className="d-flex flex-wrap gap-2 mb-2">
                    <Badge bg={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                    <Badge bg={getStatusColor(task.status)}>
                      {task.status.replace('_', ' ')}
                    </Badge>
                    {isOverdue(task.dueDate, task.status) && (
                      <Badge bg="danger">OVERDUE</Badge>
                    )}
                  </div>
                  
                  <small className="text-muted">
                    Due: {formatDate(task.dueDate)}
                  </small>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default TaskList;
