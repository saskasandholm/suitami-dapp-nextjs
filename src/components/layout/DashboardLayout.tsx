'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
  rightContent?: ReactNode;
}

export default function DashboardLayout({
  children,
  title,
  description,
  rightContent
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="page-header mb-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <motion.h1 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-semibold text-white"
              >
                {title}
              </motion.h1>
              {description && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-white/70"
                >
                  {description}
                </motion.p>
              )}
            </div>
            {rightContent && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                {rightContent}
              </motion.div>
            )}
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
} 