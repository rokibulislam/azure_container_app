import {
  listTasksByUser,
  getTaskById,
  createTask,
  updateTask,
  completeTask,
  deleteTask,
  listTaskAttachments
} from '../services/task.service.js';

export async function listTasks(req, res) {
  const tasks = await listTasksByUser(req.user.id);
  res.json({ tasks });
}

export async function getTask(req, res) {
  const task = await getTaskById(Number(req.params.id), req.user.id);
  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  const attachments = await listTaskAttachments({ taskId: Number(req.params.id), userId: req.user.id });
  res.json({ task, attachments });
}

export async function createTaskHandler(req, res) {
  const { title, description, dueDate } = req.body;
  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }

  const task = await createTask({
    userId: req.user.id,
    title,
    description,
    dueDate: dueDate || null
  });

  res.status(201).json({ task });
}

export async function updateTaskHandler(req, res) {
  const { title, description, dueDate, status } = req.body;
  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }

  const task = await updateTask({
    taskId: Number(req.params.id),
    userId: req.user.id,
    title,
    description,
    dueDate: dueDate || null,
    status: status || 'pending'
  });

  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  res.json({ task });
}

export async function completeTaskHandler(req, res) {
  const task = await completeTask({
    taskId: Number(req.params.id),
    userId: req.user.id
  });

  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  res.json({ task });
}

export async function deleteTaskHandler(req, res) {
  const task = await deleteTask({
    taskId: Number(req.params.id),
    userId: req.user.id
  });

  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  res.json({ message: 'Task deleted', task });
}