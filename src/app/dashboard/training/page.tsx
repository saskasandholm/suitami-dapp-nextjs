'use client';

import { motion } from 'framer-motion';
import TrainingCenter from '@/components/training-center/TrainingCenter';
import PageHeader from '@/components/layout/PageHeader';

export default function TrainingPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Training Center"
        description="Monitor and manage AI agent training progress"
        rightContent={
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 bg-accent/10 hover:bg-accent/20 text-accent rounded-lg transition-colors"
          >
            Start New Training
          </motion.button>
        }
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <TrainingCenter />
      </motion.div>
    </div>
  );
}
