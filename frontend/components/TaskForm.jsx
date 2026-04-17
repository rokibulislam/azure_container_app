'use client';

import { useState } from 'react';

export default function TaskForm({ initialValues, onSubmit, submitText = 'Save' }) {
  const [title, setTitle] = useState(initialValues?.title || '');
  const [description, setDescription] = useState(initialValues?.description || '');
  const [status, setStatus] = useState(initialValues?.status || 'pending');
  const [dueDate, setDueDate] = useState(initialValues?.due_date ? initialValues.due_date.slice(0, 16) : '');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    await onSubmit({ title, description, status, dueDate: dueDate || null });
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}

      <div className="form-group">
        <label>Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea rows="4" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

      <div className="form-group">
        <label>Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="form-group">
        <label>Due date</label>
        <input type="datetime-local" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
      </div>

      <button type="submit">{submitText}</button>
    </form>
  );
}