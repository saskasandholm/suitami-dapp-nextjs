/**
 * PageHeader is a reusable component that provides a consistent header pattern across dashboard pages.
 * It includes animations powered by Framer Motion for smooth transitions when the page loads.
 *
 * @component
 * @example
 * ```tsx
 * <PageHeader
 *   title="Dashboard"
 *   description="Overview of your analytics"
 *   rightContent={<Button>Action</Button>}
 * />
 * ```
 */

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

/**
 * Props for the PageHeader component
 * @interface
 */
interface PageHeaderProps {
  /** The main title of the page */
  title: string;
  /** Optional description text that appears below the title */
  description?: string;
  /** Optional content to be rendered on the right side of the header */
  rightContent?: ReactNode;
  /** Optional additional CSS classes */
  className?: string;
}

export default function PageHeader({
  title,
  description,
  rightContent,
  className = '',
}: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
      }}
      className={`flex justify-between items-center pl-8 pt-8 mb-8 ${className}`}
    >
      <div>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 20,
          }}
          className="page-title"
        >
          {title}
        </motion.h1>
        {description && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 20,
              delay: 0.1,
            }}
            className="page-description"
          >
            {description}
          </motion.p>
        )}
      </div>
      {rightContent && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 20,
            delay: 0.2,
          }}
        >
          {rightContent}
        </motion.div>
      )}
    </motion.div>
  );
}
