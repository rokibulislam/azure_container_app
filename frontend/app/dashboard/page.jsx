'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../components/ProtectedRoute';
import TaskList from '../../components/TaskList';
import { api } from '../../lib/api';

export default function DashboardPage() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');
  const router = useRouter();

  async function loadTasks() {
    try {
      const result = await api.getTasks();
      setTasks(result.tasks || []);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleComplete(taskId) {
    await api.completeTask(taskId);
    await loadTasks();
  }

  async function handleDelete(taskId) {
    await api.deleteTask(taskId);
    await loadTasks();
  }

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <ProtectedRoute>
      <div className="page-header">
        <h1>Dashboard {tasks.length > 0 && <span style={{ fontSize: 16, fontWeight: 400, color: '#6b7280' }}>({tasks.length} task{tasks.length !== 1 ? 's' : ''})</span>}</h1>
        <button onClick={() => router.push('/tasks/new')}>New Task</button>
      </div>
      {error && <div className="error">{error}</div>}
      <TaskList tasks={tasks} onComplete={handleComplete} onDelete={handleDelete} />
    </ProtectedRoute>
  );
}