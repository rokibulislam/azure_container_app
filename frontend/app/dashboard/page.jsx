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
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Dashboard</h1>
        <button onClick={() => router.push('/tasks/new')}>New Task</button>
      </div>
      {error && <div className="error">{error}</div>}
      <TaskList tasks={tasks} onComplete={handleComplete} onDelete={handleDelete} />
    </ProtectedRoute>
  );
}