import { registerUser, loginUser } from '../services/auth.service.js';

export async function register(req, res) {
  const { username, email, password, confirmPassword } = req.body;

  if (!username || !email || !password || !confirmPassword) {
    return res.status(400).json({
      message: 'Username, email, password, and confirmPassword are required'
    });
  }

  if (String(username).trim().length < 3) {
    return res.status(400).json({
      message: 'Username must be at least 3 characters'
    });
  }

  if (String(password).length < 6) {
    return res.status(400).json({
      message: 'Password must be at least 6 characters'
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({
      message: 'Passwords do not match'
    });
  }

  const result = await registerUser({ username, email, password });
  res.status(201).json(result);
}

export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const result = await loginUser({ email, password });
  res.json(result);
}

export async function me(req, res) {
  res.json({ user: req.user });
}