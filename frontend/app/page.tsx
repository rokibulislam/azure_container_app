import Link from 'next/link';

export default function Home() {
  return (
    <div className="card">
      <h1>Task Manager</h1>
      <p className="muted">
        Manage tasks, upload attachments, and deploy the app to Azure using PaaS services.
      </p>
      <div className="row">
        <Link href="/login" className="link">Login</Link>
        <Link href="/register" className="link">Register</Link>
      </div>
    </div>
  );
}