'use client';

import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../../components/ProtectedRoute';
import TaskForm from '../../../components/TaskForm';
import { api } from '../../../lib/api';

export default function NewTaskPage() {
  const router = useRouter();

  async function handleCreate(values) {
    await api.createTask(values);
    router.push('/dashboard');
  }

  return (
    <ProtectedRoute>
      <h1>Create Task</h1>
      <TaskForm onSubmit={handleCreate} submitText="Create Task" />
    </ProtectedRoute>
  );
}