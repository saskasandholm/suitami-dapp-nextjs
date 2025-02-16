'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  CommandLineIcon,
  ChatBubbleLeftRightIcon,
  DocumentIcon,
  BeakerIcon,
  XMarkIcon,
  CpuChipIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: ChartBarIcon },
  {
    name: 'My Agents',
    href: '/dashboard/agents',
    icon: CommandLineIcon,
    subpages: true,
  },
  { name: 'Knowledge Base', href: '/dashboard/knowledge', icon: DocumentIcon },
  { name: 'Training Center', href: '/dashboard/training', icon: BeakerIcon },
  { name: 'Community', href: '/dashboard/community', icon: UserGroupIcon },
  { name: 'Conversations', href: '/dashboard/conversations', icon: ChatBubbleLeftRightIcon },
  { name: 'Settings', href: '/dashboard/settings', icon: Cog6ToothIcon },
];

// This would normally come from a central store or API
const agentsData: Record<number, { name: string }> = {
  1: { name: 'Community Manager AI' },
  2: { name: 'Social Media Assistant' },
  3: { name: 'Telegram Support Bot' },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '';
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeAgent, setActiveAgent] = useState<{ id: string; name: string } | null>(null);

  // Check if we're on an agent details page
  useEffect(() => {
    const match = pathname.match(/\/dashboard\/agents\/(\d+)/);
    if (match) {
      const agentId = parseInt(match[1]);
      const agent = agentsData[agentId];
      if (agent) {
        setActiveAgent({
          id: match[1],
          name: agent.name,
        });
      }
    } else {
      setActiveAgent(null);
    }
  }, [pathname]);

  return (
    <div className="min-h-screen">
      <div className="flex min-h-screen bg-dark-gradient">
        {/* Sidebar */}
        <motion.aside
          initial={{ x: -200 }}
          animate={{ x: 0 }}
          className={`${
            isSidebarOpen ? 'w-64' : 'w-20'
          } glass-effect border-r border-white/5 p-4 transition-all duration-300 fixed h-screen`}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-8">
              <Link href="/dashboard" className="text-gradient font-semibold text-xl">
                Aiden
              </Link>
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <svg
                  className="w-6 h-6 text-white/70"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={
                      isSidebarOpen ? 'M11 19l-7-7 7-7m8 14l-7-7 7-7' : 'M13 5l7 7-7 7M5 5l7 7-7 7'
                    }
                  />
                </svg>
              </button>
            </div>

            <nav className="flex-1">
              <ul className="space-y-2">
                {navigation.map(item => {
                  const isActive =
                    pathname === item.href ||
                    (item.subpages && pathname.startsWith(item.href + '/'));

                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
                          isActive
                            ? 'bg-[#87fafd]/10 text-accent'
                            : 'text-white/70 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <item.icon className={`w-6 h-6 ${isSidebarOpen ? 'mr-3' : ''}`} />
                        {isSidebarOpen && <span>{item.name}</span>}
                      </Link>

                      {/* Agent Details Subpage */}
                      {item.subpages && activeAgent && isSidebarOpen && (
                        <div className="ml-6 mt-1">
                          <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                            <div className="flex items-center space-x-2 min-w-0 flex-1">
                              <div className="w-5 h-5 rounded-full bg-accent/10 flex-shrink-0 flex items-center justify-center">
                                <CpuChipIcon className="w-3 h-3 text-accent" />
                              </div>
                              <span className="text-xs text-white/70 truncate">
                                {activeAgent.name}
                              </span>
                            </div>
                            <Link
                              href="/dashboard/agents"
                              className="p-1 rounded-lg hover:bg-white/20 transition-colors ml-1 flex-shrink-0"
                            >
                              <XMarkIcon className="w-3.5 h-3.5 text-white/50 hover:text-white" />
                            </Link>
                          </div>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="mt-auto">
              <div className="glass-card p-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-[#87fafd]/20 flex items-center justify-center">
                    <UserGroupIcon className="w-4 h-4 text-accent" />
                  </div>
                  {isSidebarOpen && (
                    <div className="ml-3">
                      <p className="text-sm text-white/70">Connected Wallet</p>
                      <p className="text-xs text-accent truncate">0x1234...5678</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.aside>

        {/* Main Content */}
        <main className={`flex-1 ${isSidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
          <div className="p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
