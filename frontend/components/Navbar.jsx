'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { isAuthenticated, removeToken } from '../lib/auth';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setLoggedIn(isAuthenticated());
  }, [pathname]);

  function logout() {
    removeToken();
    setLoggedIn(false);
    router.push('/login');
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link href="/" className="navbar-brand">Task Manager</Link>
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
              <button className="nav-logout" onClick={logout}>Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
