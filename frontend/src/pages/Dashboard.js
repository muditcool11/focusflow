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

  const load = React.useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchTasks(filters);
      const items = Array.isArray(data) ? data : data?.content || [];
      setTasks(items);
    } catch (err) {
      // Backend may return { error: '...' } or { message: '...' }
      const backendMsg = err?.response?.data?.message || err?.response?.data?.error;
      setError(backendMsg || 'Failed to load tasks');
      // Keep console log for debugging network/401 issues
      // eslint-disable-next-line no-console
      console.error('Failed to load tasks', err?.response || err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    load();
  }, [filters.status, filters.priority, load]);

  const handleSave = React.useCallback(async (task) => {
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
  }, [editing, load]);

  const handleDelete = React.useCallback(async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await deleteTask(id);
      await load();
    } catch (err) {
      alert(err?.response?.data?.message || 'Delete failed');
    }
  }, [load]);

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
  ), [tasks, loading, error, filters, editing, handleDelete, handleSave]);

  return (
    <>
      <Header />
      {body}
    </>
  );
}

