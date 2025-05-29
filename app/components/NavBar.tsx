'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // <-- Use this instead
import Image from 'next/image';
const NavBar = () => {
  const pathname = usePathname(); // <-- Get current path

  const links = [
    { label: 'Activities', href: '/activities' },
    { label: 'Training', href: '/training' },
    { label: 'Programs', href: '/programs' },
    { label: 'Events', href: '/events' },
  ];


  return (
    <nav className='flex justify-between items-center px-5  h-14'>
      <div className='font-bold text-lg text-black'>
        <Link href="/">
          <Image
            className="pt-4"
            src="/g_logo.jpg"
            alt="Georgia Municipal Association Logo"
            width={150}
            height={150}
            priority
          />
        </Link>
      </div>
      <ul className='flex space-x-6 items-center'>
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={` pl-4 px-3 py-1 rounded-md transition-transform text-xl ${
                pathname === link.href
                  ? 'bg-blue-500 text-white font-semibold shadow transition-colors'
                  : 'text-zinc-500 hover:text-white hover:bg-blue-400  transition-colors'
              }`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavBar;