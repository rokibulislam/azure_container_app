import { getPool } from './pool.js';

const schemaSql = `
IF OBJECT_ID('dbo.attachments', 'U') IS NOT NULL DROP TABLE dbo.attachments;
IF OBJECT_ID('dbo.tasks', 'U') IS NOT NULL DROP TABLE dbo.tasks;
IF OBJECT_ID('dbo.users', 'U') IS NOT NULL DROP TABLE dbo.users;

CREATE TABLE users (
  id INT IDENTITY(1,1) PRIMARY KEY,
  username NVARCHAR(100) NOT NULL UNIQUE,
  email NVARCHAR(255) NOT NULL UNIQUE,
  password_hash NVARCHAR(255) NOT NULL,
  created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);

CREATE TABLE tasks (
  id INT IDENTITY(1,1) PRIMARY KEY,
  user_id INT NOT NULL,
  title NVARCHAR(255) NOT NULL,
  description NVARCHAR(MAX) NULL,
  status NVARCHAR(50) NOT NULL DEFAULT 'pending',
  due_date DATETIME2 NULL,
  created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
  updated_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
  CONSTRAINT FK_tasks_users FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE attachments (
  id INT IDENTITY(1,1) PRIMARY KEY,
  task_id INT NOT NULL,
  blob_name NVARCHAR(500) NOT NULL,
  original_filename NVARCHAR(255) NOT NULL,
  content_type NVARCHAR(100) NULL,
  uploaded_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
  CONSTRAINT FK_attachments_tasks FOREIGN KEY (task_id) REFERENCES tasks(id)
);
`;

async function runMigration() {
  const pool = await getPool();
  await pool.request().batch(schemaSql);
  console.log('Migration complete');
  process.exit(0);
}

runMigration().catch((err) => {
  console.error('Migration failed', err);
  process.exit(1);
});