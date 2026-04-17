import { getPool, sql } from '../db/pool.js';
import { uploadPrivateFile, generateReadUrl } from './blob.service.js';

export async function saveTaskAttachment({ taskId, userId, file }) {
  const pool = await getPool();

  const taskCheck = await pool
    .request()
    .input('task_id', sql.Int, taskId)
    .input('user_id', sql.Int, userId)
    .query('SELECT TOP 1 id FROM tasks WHERE id = @task_id AND user_id = @user_id');

  if (taskCheck.recordset.length === 0) {
    const err = new Error('Task not found');
    err.status = 404;
    throw err;
  }

  const uploadResult = await uploadPrivateFile({
    buffer: file.buffer,
    originalFilename: file.originalname,
    contentType: file.mimetype
  });

  const insertResult = await pool
    .request()
    .input('task_id', sql.Int, taskId)
    .input('blob_name', sql.NVarChar(500), uploadResult.blobName)
    .input('original_filename', sql.NVarChar(255), file.originalname)
    .input('content_type', sql.NVarChar(100), file.mimetype)
    .query(`
      INSERT INTO attachments (task_id, blob_name, original_filename, content_type)
      OUTPUT INSERTED.*
      VALUES (@task_id, @blob_name, @original_filename, @content_type)
    `);

  return insertResult.recordset[0];
}

export async function getAttachmentAccessUrl({ attachmentId, userId }) {
  const pool = await getPool();
  const result = await pool
    .request()
    .input('attachment_id', sql.Int, attachmentId)
    .input('user_id', sql.Int, userId)
    .query(`
      SELECT TOP 1 a.*
      FROM attachments a
      INNER JOIN tasks t ON t.id = a.task_id
      WHERE a.id = @attachment_id AND t.user_id = @user_id
    `);

  const attachment = result.recordset[0];
  if (!attachment) {
    const err = new Error('Attachment not found');
    err.status = 404;
    throw err;
  }

  const url = await generateReadUrl(attachment.blob_name, 15);
  return {
    attachment,
    url,
    expiresInMinutes: 15
  };
}