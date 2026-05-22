import Link from 'next/link';

export default function Home() {
  return (
    <div className="hero">
      <h1>Task Manager</h1>
      <p>Organise your work, track progress, and manage file attachments — all in one place.</p>
      {/* v1.0.1 */}
      <div className="hero-actions">
        <Link href="/register" className="btn-primary">Get started</Link>
        <Link href="/login" className="btn-outline">Log in</Link>
      </div>
    </div>
  );
}
