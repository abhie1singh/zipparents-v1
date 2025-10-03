'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { isAdmin } from '@/lib/admin/middleware';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, userData, loading } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    async function checkAdminAccess() {
      if (loading) return;

      if (!user) {
        router.push('/feed');
        return;
      }

      try {
        const adminStatus = await isAdmin(user.uid);
        if (!adminStatus) {
          router.push('/feed');
          return;
        }
        setIsAuthorized(true);
      } catch (error) {
        console.error('Error checking admin status:', error);
        router.push('/feed');
      } finally {
        setCheckingAuth(false);
      }
    }

    checkAdminAccess();
  }, [user, loading, router]);

  if (loading || checkingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-gray-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">ZipParents Admin</h1>
              {userData?.role && (
                <span className="ml-4 px-3 py-1 bg-primary-600 text-white text-xs font-medium rounded-full">
                  {userData.role.toUpperCase()}
                </span>
              )}
            </div>
            <div className="text-sm text-gray-300">
              {userData?.displayName || userData?.email}
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-white shadow-md min-h-screen">
          <nav className="p-4 space-y-2">
            <NavLink href="/admin" label="Dashboard" icon="dashboard" />
            <NavLink href="/admin/users" label="Users" icon="users" />
            <NavLink href="/admin/reports" label="Reports" icon="reports" />
            <NavLink href="/admin/events" label="Events" icon="events" />
            <NavLink href="/admin/logs" label="Moderation Logs" icon="logs" />

            <div className="pt-4 mt-4 border-t border-gray-200">
              <NavLink href="/feed" label="Back to App" icon="back" />
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

interface NavLinkProps {
  href: string;
  label: string;
  icon: string;
}

function NavLink({ href, label, icon }: NavLinkProps) {
  const iconMap: Record<string, JSX.Element> = {
    dashboard: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    users: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    reports: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    events: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    logs: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    back: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
    ),
  };

  return (
    <Link
      href={href}
      className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition-colors text-gray-700"
    >
      {iconMap[icon] || iconMap.dashboard}
      <span className="font-medium">{label}</span>
    </Link>
  );
}
