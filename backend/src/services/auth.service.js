import { getPool, sql } from '../db/pool.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { signToken } from '../utils/jwt.js';

export async function registerUser({ username, email, password }) {
  const normalizedUsername = username.trim().toLowerCase();
  const normalizedEmail = email.trim().toLowerCase();
  const passwordHash = await hashPassword(password);
  const pool = await getPool();

  const existing = await pool
    .request()
    .input('username', sql.NVarChar(100), normalizedUsername)
    .input('email', sql.NVarChar(255), normalizedEmail)
    .query(`
      SELECT TOP 1 id
      FROM users
      WHERE email = @email OR username = @username
    `);

  if (existing.recordset.length > 0) {
    const err = new Error('Email or username already registered');
    err.status = 409;
    throw err;
  }

  const result = await pool
    .request()
    .input('username', sql.NVarChar(100), normalizedUsername)
    .input('email', sql.NVarChar(255), normalizedEmail)
    .input('password_hash', sql.NVarChar(255), passwordHash)
    .query(`
      INSERT INTO users (username, email, password_hash)
      OUTPUT INSERTED.id, INSERTED.username, INSERTED.email, INSERTED.created_at
      VALUES (@username, @email, @password_hash)
    `);

  const user = result.recordset[0];
  const token = signToken({
    sub: user.id,
    username: user.username,
    email: user.email
  });

  return { user, token };
}

export async function loginUser({ email, password }) {
  const normalizedEmail = email.trim().toLowerCase();
  const pool = await getPool();

  const result = await pool
    .request()
    .input('email', sql.NVarChar(255), normalizedEmail)
    .query(`
      SELECT TOP 1 id, username, email, password_hash, created_at
      FROM users
      WHERE email = @email
    `);

  const user = result.recordset[0];
  if (!user) {
    const err = new Error('Invalid email or password');
    err.status = 401;
    throw err;
  }

  const valid = await comparePassword(password, user.password_hash);
  if (!valid) {
    const err = new Error('Invalid email or password');
    err.status = 401;
    throw err;
  }

  const token = signToken({
    sub: user.id,
    username: user.username,
    email: user.email
  });

  return {
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      created_at: user.created_at
    },
    token
  };
}