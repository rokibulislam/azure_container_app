'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '../../lib/api';
import { setToken } from '../../lib/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await api.login({ email, password });
      setToken(result.token);
      router.push('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="card" style={{ maxWidth: 420, margin: '40px auto' }} onSubmit={handleSubmit}>
      <h2 style={{ marginBottom: 20 }}>Welcome back</h2>
      {error && <div className="error">{error}</div>}

      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />
      </div>

      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
      </div>

      <button type="submit" style={{ width: '100%' }} disabled={loading}>
        {loading ? 'Signing in…' : 'Sign in'}
      </button>

      <p className="form-footer">
        Don&apos;t have an account? <Link href="/register">Register</Link>
      </p>
    </form>
  );
}
