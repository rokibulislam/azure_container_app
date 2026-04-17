'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { isAuthenticated, removeToken } from '../lib/auth';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setLoggedIn(isAuthenticated());
  }, []);

  function logout() {
    removeToken();
    setLoggedIn(false);
    router.push('/login');
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link href="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 700 }}>
          Task Manager
        </Link>
        <div className="nav-links">
          {!loggedIn ? (
            <>
              <Link href="/login">Login</Link>
              <Link href="/register">Register</Link>
            </>
          ) : (
            <>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/tasks/new">New Task</Link>
              <button onClick={logout}>Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}