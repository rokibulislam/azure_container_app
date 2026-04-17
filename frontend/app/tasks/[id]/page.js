'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProtectedRoute from '../../../components/ProtectedRoute';
import TaskForm from '../../../components/TaskForm';
import AttachmentList from '../../../components/AttachmentList';
import { api } from '../../../lib/api';

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [task, setTask] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [error, setError] = useState('');
  const [file, setFile] = useState(null);

  async function loadTask() {
    try {
      const result = await api.getTask(params.id);
      setTask(result.task);
      setAttachments(result.attachments || []);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleUpdate(values) {
    await api.updateTask(params.id, values);
    await loadTask();
  }

  async function handleUpload(e) {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    await api.uploadAttachment(params.id, formData);
    setFile(null);
    await loadTask();
  }

  async function handleOpenAttachment(attachmentId) {
    const result = await api.getAttachmentUrl(attachmentId);
    window.open(result.url, '_blank');
  }

  useEffect(() => {
    loadTask();
  }, [params.id]);

  if (!task) {
    return (
      <ProtectedRoute>
        <p>Loading...</p>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Edit Task</h1>
        <button className="secondary" onClick={() => router.push('/dashboard')}>Back</button>
      </div>

      {error && <div className="error">{error}</div>}

      <TaskForm initialValues={task} onSubmit={handleUpdate} submitText="Update Task" />

      <form className="card" onSubmit={handleUpload}>
        <h3>Upload attachment</h3>
        <div className="form-group">
          <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        </div>
        <button type="submit">Upload</button>
      </form>

      <AttachmentList attachments={attachments} onOpen={handleOpenAttachment} />
    </ProtectedRoute>
  );
}