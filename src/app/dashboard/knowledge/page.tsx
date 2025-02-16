'use client';

import { motion } from 'framer-motion';
import KnowledgeBase from '@/components/knowledge-base/KnowledgeBase';
import PageHeader from '@/components/layout/PageHeader';
import { DocumentPlusIcon } from '@heroicons/react/24/outline';

export default function KnowledgePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Knowledge Base"
        description="Manage and organize training data for your AI agents"
        rightContent={
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center px-4 py-2 bg-accent/10 hover:bg-accent/20 text-accent rounded-lg transition-colors"
            >
              <DocumentPlusIcon className="w-5 h-5 mr-2" />
              Add Document
            </motion.button>
          </div>
        }
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <KnowledgeBase />
      </motion.div>
    </div>
  );
}
