import React from 'react';

export default function TaskList({ tasks, onEdit, onDelete, filters, onChangeFilters }) {
  return (
    <div className="card">
      <div className="card-body">
        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <label className="form-label">Status</label>
            <select className="form-select" value={filters.status} onChange={(e) => onChangeFilters({ ...filters, status: e.target.value })}>
              <option value="">All</option>
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Priority</label>
            <select className="form-select" value={filters.priority} onChange={(e) => onChangeFilters({ ...filters, priority: e.target.value })}>
              <option value="">All</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
        </div>

        {tasks.length === 0 ? (
          <div className="text-muted">No tasks found.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped align-middle">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((t) => (
                  <tr key={t.id}>
                    <td>{t.title}</td>
                    <td><span className="badge bg-secondary">{t.status}</span></td>
                    <td><span className="badge bg-info text-dark">{t.priority}</span></td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-outline-primary me-2" onClick={() => onEdit(t)}>Edit</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(t.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

