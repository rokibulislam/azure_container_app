import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { testDbConnection } from './db/pool.js';
import { config } from './config.js';
import { authRoutes } from './routes/auth.routes.js';
import { taskRoutes } from './routes/task.routes.js';
import { attachmentRoutes } from './routes/attachment.routes.js';
import { notFound } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';

export const app = express();

app.use(helmet());
app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));


app.get('/', (_req, res) => {
  res.json({ app: 'Task Manager API', status: 'running' });
});

app.get('/health', async (_req, res) => {
  try {
    await testDbConnection();

    res.json({
      ok: true,
      db: 'connected',
      sqlManagedIdentity: config.sql.useManagedIdentity,
      storageManagedIdentity: config.storage.useManagedIdentity
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      db: 'failed',
      error: error.message
    });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/attachments', attachmentRoutes);

app.use(notFound);
app.use(errorHandler);