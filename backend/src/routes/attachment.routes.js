import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getAttachmentUrl } from '../controllers/attachment.controller.js';

export const attachmentRoutes = Router();

attachmentRoutes.use(requireAuth);
attachmentRoutes.get('/:id', asyncHandler(getAttachmentUrl));