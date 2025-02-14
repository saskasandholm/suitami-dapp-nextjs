'use client';

import { motion } from "framer-motion";
import TrainingCenter from "@/components/training-center/TrainingCenter";

export default function TrainingPage() {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-gradient">Training Center</h1>
        <p className="text-white/70 mt-1">Monitor and manage AI agent training progress</p>
      </motion.div>

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