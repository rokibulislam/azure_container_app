import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  listTasks,
  getTask,
  createTaskHandler,
  updateTaskHandler,
  completeTaskHandler,
  deleteTaskHandler
} from '../controllers/task.controller.js';
import { uploadTaskAttachment } from '../controllers/attachment.controller.js';

export const taskRoutes = Router();

taskRoutes.use(requireAuth);

taskRoutes.get('/', asyncHandler(listTasks));
taskRoutes.get('/:id', asyncHandler(getTask));
taskRoutes.post('/', asyncHandler(createTaskHandler));
taskRoutes.put('/:id', asyncHandler(updateTaskHandler));
taskRoutes.post('/:id/complete', asyncHandler(completeTaskHandler));
taskRoutes.delete('/:id', asyncHandler(deleteTaskHandler));
taskRoutes.post('/:id/upload', upload.single('file'), asyncHandler(uploadTaskAttachment));