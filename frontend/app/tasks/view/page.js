'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ProtectedRoute from '../../../components/ProtectedRoute';
import TaskForm from '../../../components/TaskForm';
import AttachmentList from '../../../components/AttachmentList';
import { api } from '../../../lib/api';

export default function TaskViewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const taskId = searchParams.get('id');

  const [task, setTask] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [error, setError] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadTask() {
    try {
      if (!taskId) {
        setError('Missing task id');
        setLoading(false);
        return;
      }

      setError('');
      const result = await api.getTask(taskId);
      setTask(result.task);
      setAttachments(result.attachments || []);
    } catch (err) {
      setError(err.message || 'Failed to load task');
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate(values) {
    try {
      if (!taskId) return;

      setError('');
      await api.updateTask(taskId, values);
      await loadTask();
    } catch (err) {
      setError(err.message || 'Failed to update task');
    }
  }

  async function handleUpload(e) {
    e.preventDefault();

    try {
      if (!file || !taskId) return;

      setError('');
      const formData = new FormData();
      formData.append('file', file);

      await api.uploadAttachment(taskId, formData);
      setFile(null);
      await loadTask();
    } catch (err) {
      setError(err.message || 'Failed to upload attachment');
    }
  }

  async function handleOpenAttachment(attachmentId) {
    try {
      const result = await api.getAttachmentUrl(attachmentId);
      window.open(result.url, '_blank');
    } catch (err) {
      setError(err.message || 'Failed to open attachment');
    }
  }

  useEffect(() => {
    loadTask();
  }, [taskId]);

  return (
    <ProtectedRoute>
      <div
        className="row"
        style={{ justifyContent: 'space-between', alignItems: 'center' }}
      >
        <h1>Edit Task</h1>
        <button
          className="secondary"
          onClick={() => router.push('/dashboard.html')}
        >
          Back
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {loading ? (
        <p>Loading...</p>
      ) : !task ? (
        <p>Task not found.</p>
      ) : (
        <>
          <TaskForm
            initialValues={task}
            onSubmit={handleUpdate}
            submitText="Update Task"
          />

          <form className="card" onSubmit={handleUpload}>
            <h3>Upload attachment</h3>
            <div className="form-group">
              <input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </div>
            <button type="submit">Upload</button>
          </form>

          <AttachmentList
            attachments={attachments}
            onOpen={handleOpenAttachment}
          />
        </>
      )}
    </ProtectedRoute>
  );
}