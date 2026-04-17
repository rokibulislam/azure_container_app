import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { register, login, me } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.js';

export const authRoutes = Router();

authRoutes.post('/register', asyncHandler(register));
authRoutes.post('/login', asyncHandler(login));
authRoutes.get('/me', requireAuth, asyncHandler(me));