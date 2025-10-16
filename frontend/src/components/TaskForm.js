import React, { useEffect, useState } from 'react';

export default function TaskForm({ initialTask, onSave, onCancel }) {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('PENDING');
  const [priority, setPriority] = useState('MEDIUM');

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title || '');
      setStatus(initialTask.status || 'PENDING');
      setPriority(initialTask.priority || 'MEDIUM');
    }
  }, [initialTask]);

  function submit(e) {
    e.preventDefault();
    onSave({ title, status, priority });
  }

  return (
    <form onSubmit={submit} className="card p-3">
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Title</label>
          <input className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="col-md-3">
          <label className="form-label">Status</label>
          <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label">Priority</label>
          <select className="form-select" value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>
      </div>
      <div className="mt-3 d-flex gap-2">
        <button className="btn btn-primary" type="submit">Save</button>
        {onCancel && <button className="btn btn-secondary" type="button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}

