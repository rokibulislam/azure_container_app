import { getPool, sql } from '../db/pool.js';

export async function listTasksByUser(userId) {
  const pool = await getPool();
  const result = await pool
    .request()
    .input('user_id', sql.Int, userId)
    .query(`
      SELECT
        t.id,
        t.title,
        t.description,
        t.status,
        t.due_date,
        t.created_at,
        t.updated_at,
        (
          SELECT COUNT(*) FROM attachments a WHERE a.task_id = t.id
        ) AS attachment_count
      FROM tasks t
      WHERE t.user_id = @user_id
      ORDER BY t.created_at DESC
    `);

  return result.recordset;
}

export async function getTaskById(taskId, userId) {
  const pool = await getPool();
  const result = await pool
    .request()
    .input('task_id', sql.Int, taskId)
    .input('user_id', sql.Int, userId)
    .query(`
      SELECT TOP 1 *
      FROM tasks
      WHERE id = @task_id AND user_id = @user_id
    `);

  return result.recordset[0] || null;
}

export async function createTask({ userId, title, description, dueDate }) {
  const pool = await getPool();
  const result = await pool
    .request()
    .input('user_id', sql.Int, userId)
    .input('title', sql.NVarChar(255), title)
    .input('description', sql.NVarChar(sql.MAX), description || null)
    .input('due_date', sql.DateTime2, dueDate || null)
    .query(`
      INSERT INTO tasks (user_id, title, description, due_date)
      OUTPUT INSERTED.*
      VALUES (@user_id, @title, @description, @due_date)
    `);

  return result.recordset[0];
}

export async function updateTask({ taskId, userId, title, description, dueDate, status }) {
  const pool = await getPool();
  const result = await pool
    .request()
    .input('task_id', sql.Int, taskId)
    .input('user_id', sql.Int, userId)
    .input('title', sql.NVarChar(255), title)
    .input('description', sql.NVarChar(sql.MAX), description || null)
    .input('due_date', sql.DateTime2, dueDate || null)
    .input('status', sql.NVarChar(50), status)
    .query(`
      UPDATE tasks
      SET
        title = @title,
        description = @description,
        due_date = @due_date,
        status = @status,
        updated_at = SYSUTCDATETIME()
      OUTPUT INSERTED.*
      WHERE id = @task_id AND user_id = @user_id
    `);

  return result.recordset[0] || null;
}

export async function completeTask({ taskId, userId }) {
  const pool = await getPool();
  const result = await pool
    .request()
    .input('task_id', sql.Int, taskId)
    .input('user_id', sql.Int, userId)
    .query(`
      UPDATE tasks
      SET status = 'completed', updated_at = SYSUTCDATETIME()
      OUTPUT INSERTED.*
      WHERE id = @task_id AND user_id = @user_id
    `);

  return result.recordset[0] || null;
}

export async function deleteTask({ taskId, userId }) {
  const pool = await getPool();
  const result = await pool
    .request()
    .input('task_id', sql.Int, taskId)
    .input('user_id', sql.Int, userId)
    .query(`
      DELETE FROM tasks
      OUTPUT DELETED.*
      WHERE id = @task_id AND user_id = @user_id
    `);

  return result.recordset[0] || null;
}

export async function listTaskAttachments({ taskId, userId }) {
  const pool = await getPool();
  const result = await pool
    .request()
    .input('task_id', sql.Int, taskId)
    .input('user_id', sql.Int, userId)
    .query(`
      SELECT a.*
      FROM attachments a
      INNER JOIN tasks t ON t.id = a.task_id
      WHERE a.task_id = @task_id AND t.user_id = @user_id
      ORDER BY a.uploaded_at DESC
    `);

  return result.recordset;
}