import React, { useEffect, useMemo, useState } from 'react';
import Header from '../components/Header';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import { createTask, deleteTask, fetchTasks, updateTask } from '../services/taskApi';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ status: '', priority: '' });
  const [editing, setEditing] = useState(null);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const data = await fetchTasks(filters);
      setTasks(Array.isArray(data) ? data : data?.content || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [filters.status, filters.priority]);

  async function handleSave(task) {
    try {
      if (editing) {
        await updateTask(editing.id, task);
      } else {
        await createTask(task);
      }
      setEditing(null);
      await load();
    } catch (err) {
      alert(err?.response?.data?.message || 'Save failed');
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this task?')) return;
    try {
      await deleteTask(id);
      await load();
    } catch (err) {
      alert(err?.response?.data?.message || 'Delete failed');
    }
  }

  const body = useMemo(() => (
    <div className="container">
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row g-4">
        <div className="col-lg-7">
          {loading ? (
            <div className="text-muted">Loading tasks...</div>
          ) : (
            <TaskList tasks={tasks} onEdit={setEditing} onDelete={handleDelete} filters={filters} onChangeFilters={setFilters} />
          )}
        </div>
        <div className="col-lg-5">
          <TaskForm initialTask={editing} onSave={handleSave} onCancel={() => setEditing(null)} />
        </div>
      </div>
    </div>
  ), [tasks, loading, error, filters, editing]);

  return (
    <>
      <Header />
      {body}
    </>
  );
}

