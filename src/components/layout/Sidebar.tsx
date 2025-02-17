'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { HomeIcon, UsersIcon, ChartBarIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebarOpen');
      return saved ? JSON.parse(saved) : true; // Default to open
    }
    return true;
  });
  const [isInitialRender, setIsInitialRender] = useState(true);

  useEffect(() => {
    setIsInitialRender(false);
  }, []);

  const toggleSidebar = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    localStorage.setItem('sidebarOpen', JSON.stringify(newState));
  };

  const sidebarItems = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Community', href: '/dashboard/community', icon: UsersIcon },
    { name: 'Analytics', href: '/dashboard/analytics', icon: ChartBarIcon },
    { name: 'Settings', href: '/dashboard/settings', icon: Cog6ToothIcon },
  ];

  return (
    <motion.aside
      className="fixed left-0 top-[65px] h-[calc(100vh-65px)] w-64 bg-black/20 backdrop-blur-xl border-r border-white/5"
      initial={false}
      animate={{
        x: isOpen ? 0 : -256,
        width: isOpen ? 256 : 0,
      }}
      transition={{
        duration: isInitialRender ? 0 : 0.2,
        ease: 'easeInOut',
      }}
    >
      <div className="flex flex-col h-full">
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-2">
            {sidebarItems.map(item => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="flex items-center px-4 py-2.5 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors group"
                >
                  <item.icon className="w-5 h-5 mr-3 text-white/50 group-hover:text-accent transition-colors" />
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-white/5">
          <button
            onClick={toggleSidebar}
            className="w-full px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center justify-center"
          >
            <span>{isOpen ? 'Collapse Sidebar' : ''}</span>
          </button>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
