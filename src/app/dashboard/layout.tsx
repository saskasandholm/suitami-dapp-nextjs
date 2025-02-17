'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
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
  BanknotesIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dashboardSidebarOpen');
      return saved ? JSON.parse(saved) : true; // Default to open
    }
    return true;
  });
  const [isInitialRender, setIsInitialRender] = useState(true);
  const [activeAgent, setActiveAgent] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    setIsInitialRender(false);
  }, []);

  // Update localStorage when sidebar state changes
  const toggleSidebar = () => {
    const newState = !isSidebarOpen;
    setIsSidebarOpen(newState);
    localStorage.setItem('dashboardSidebarOpen', JSON.stringify(newState));
  };

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

  const getIconHoverScale = (name: string) => {
    // Simple consistent scale for all icons
    return name === 'Settings' ? 1.1 : 1.08;
  };

  const getIconSpecificAnimation = (name: string) => {
    const baseTransition = {
      duration: 0.3,
      ease: 'easeInOut',
    };

    switch (name) {
      case 'Overview':
        return {
          y: [0, -2, 0], // Simple up-down bounce
          transition: baseTransition,
        };
      case 'My Agents':
        return {
          x: [0, 2, -2, 0], // Command line cursor effect
          transition: baseTransition,
        };
      case 'Knowledge Base':
        return {
          rotateY: [-10, 10, 0], // Subtle page flip
          transition: baseTransition,
        };
      case 'Training Center':
        return {
          y: [0, -2, 0, 2, 0], // Bubbling effect
          transition: baseTransition,
        };
      case 'Community':
        return {
          scale: [1, 1.15, 1.08], // Welcoming expansion
          transition: baseTransition,
        };
      case 'Conversations':
        return {
          y: [0, -2, 0], // Simple up-down bounce
          transition: baseTransition,
        };
      case 'Settings':
        return {
          rotate: 180, // Smooth gear rotation
          transition: baseTransition,
        };
      default:
        return {};
    }
  };

  const getIconSpecificTiming = (name: string) => {
    // Removed special timing cases to keep behavior consistent
    return {
      duration: 0.3,
      ease: 'easeInOut',
    };
  };

  return (
    <div className="min-h-screen">
      <div className="flex min-h-screen bg-dark-gradient">
        {/* Sidebar */}
        <motion.aside
          initial={false}
          animate={{
            width: isSidebarOpen ? 256 : 80,
            x: 0,
          }}
          transition={{
            duration: 0.3, // Slower animation
            ease: [0.32, 0.72, 0, 1],
            type: 'tween',
          }}
          className="glass-effect border-r border-white/5 p-4 fixed h-screen"
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-8">
              <Link href="/dashboard" className="flex items-center p-3">
                <div className={`relative w-8 h-8 ${isSidebarOpen ? 'mr-3' : ''}`}>
                  <Image
                    src="/aiden-icon.svg"
                    alt="Aiden"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -4 }}
                      transition={{ duration: 0.2 }}
                      className="text-gradient font-semibold text-xl whitespace-nowrap overflow-hidden"
                    >
                      Aiden
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <motion.svg
                  className="w-6 h-6 text-white/70"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  animate={{ rotate: isSidebarOpen ? 0 : 180 }}
                  transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={
                      isSidebarOpen ? 'M11 19l-7-7 7-7m8 14l-7-7 7-7' : 'M13 5l7 7-7 7M5 5l7 7-7 7'
                    }
                  />
                </motion.svg>
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
                        <motion.div
                          animate={{ marginRight: isSidebarOpen ? 12 : 0 }}
                          whileHover={
                            !isSidebarOpen
                              ? {
                                  scale: getIconHoverScale(item.name),
                                  ...getIconSpecificAnimation(item.name),
                                }
                              : undefined
                          }
                          transition={{
                            type: 'spring',
                            stiffness: 300, // Reduced from 400 for smoother feel
                            damping: 15, // Increased from 10 for less wobble
                          }}
                        >
                          <item.icon
                            className={`w-6 h-6 ${isActive ? 'text-accent' : ''}`}
                            style={{ transformOrigin: 'center' }} // Ensure animations pivot from center
                          />
                        </motion.div>
                        <AnimatePresence>
                          {isSidebarOpen && (
                            <motion.span
                              initial={{ opacity: 0, x: -4 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -4 }}
                              transition={{ duration: 0.2 }}
                              className="whitespace-nowrap overflow-hidden"
                            >
                              {item.name}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </Link>

                      {/* Agent Details Subpage */}
                      {item.subpages && activeAgent && isSidebarOpen && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="ml-6 mt-1"
                        >
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
                        </motion.div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="mt-auto">
              <div className="glass-card">
                <div className="flex items-center">
                  <motion.div
                    className={`relative h-10 ${isSidebarOpen ? 'w-full' : 'w-[52px]'} rounded-lg bg-[#87fafd]/10 flex items-center ${
                      !isSidebarOpen ? 'hover:bg-[#87fafd]/20' : ''
                    }`}
                    animate={{
                      width: isSidebarOpen ? '100%' : 52,
                    }}
                    transition={{
                      duration: 0.3,
                      ease: [0.32, 0.72, 0, 1],
                      type: 'tween',
                    }}
                    whileHover={
                      !isSidebarOpen
                        ? {
                            scale: 1.05,
                            transition: {
                              duration: 0.2,
                              ease: 'easeOut',
                            },
                          }
                        : undefined
                    }
                  >
                    <motion.div
                      className="absolute inset-0 rounded-lg bg-accent"
                      initial={{ opacity: 0 }}
                      whileHover={
                        !isSidebarOpen
                          ? {
                              opacity: [0, 0.1, 0],
                              scale: [1, 1.1, 1],
                              transition: {
                                duration: 2,
                                repeat: Infinity,
                                ease: 'easeInOut',
                              },
                            }
                          : undefined
                      }
                    />
                    <div className="flex items-center w-full px-3">
                      <motion.div
                        className="flex items-center min-w-0"
                        animate={{ marginRight: isSidebarOpen ? 0 : 0 }}
                        transition={{
                          type: 'spring',
                          stiffness: 300,
                          damping: 15,
                        }}
                      >
                        <motion.div
                          animate={{
                            scale: 1,
                            marginRight: isSidebarOpen ? 0 : 0,
                          }}
                          transition={{
                            duration: 0.3,
                            ease: [0.32, 0.72, 0, 1],
                          }}
                        >
                          <BanknotesIcon className="w-5 h-5 text-accent relative z-10" />
                        </motion.div>
                        <AnimatePresence mode="wait">
                          {isSidebarOpen && (
                            <motion.div
                              initial={{ opacity: 0, x: -4 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -4 }}
                              transition={{
                                duration: 0.3,
                                ease: [0.32, 0.72, 0, 1],
                              }}
                              className="ml-3 flex-1 min-w-0 overflow-hidden"
                            >
                              <p className="text-sm text-white/70 truncate">Connected Wallet</p>
                              <div className="flex items-center space-x-2">
                                <p className="text-xs text-accent truncate">0x1234...5678</p>
                                <motion.button
                                  className="p-1 rounded hover:bg-white/10 transition-colors group flex-shrink-0"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <ArrowRightOnRectangleIcon className="w-3.5 h-3.5 text-red-400 group-hover:text-red-300 transition-colors" />
                                </motion.button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </motion.aside>

        {/* Main Content */}
        <motion.main
          initial={false}
          animate={{
            marginLeft: isSidebarOpen ? 256 : 80,
          }}
          transition={{
            duration: 0.3, // Match sidebar duration
            ease: [0.32, 0.72, 0, 1],
            type: 'tween',
          }}
          className="flex-1"
        >
          <div className="p-8">{children}</div>
        </motion.main>
      </div>
    </div>
  );
}
