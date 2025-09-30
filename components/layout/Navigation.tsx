'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

function NavLink({ href, children }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        isActive
          ? 'bg-primary-100 text-primary-700'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
      aria-current={isActive ? 'page' : undefined}
    >
      {children}
    </Link>
  );
}

export default function Navigation() {
  return (
    <nav className="hidden md:flex items-center space-x-1" aria-label="Main navigation">
      <NavLink href="/feed">Feed</NavLink>
      <NavLink href="/about">About</NavLink>
      <NavLink href="/safety">Safety</NavLink>
      <NavLink href="/contact">Contact</NavLink>
    </nav>
  );
}
