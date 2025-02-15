import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import {
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/solid';
import { useNotification, Notification as NotificationType } from '@/contexts/NotificationContext';

const iconMap = {
  error: ExclamationTriangleIcon,
  success: CheckCircleIcon,
  info: InformationCircleIcon,
};

const colorMap = {
  error: 'bg-red-500/10 border-red-500/50 text-red-500',
  success: 'bg-green-500/10 border-green-500/50 text-green-500',
  info: 'bg-blue-500/10 border-blue-500/50 text-blue-500',
};

export default function Notification() {
  const { state, removeNotification } = useNotification();
  const { notifications } = state;

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed right-4 top-4 z-50 flex flex-col gap-2"
    >
      <AnimatePresence>
        {notifications.map((notification: NotificationType, index: number) => {
          const Icon = iconMap[notification.type];
          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: -20, x: 20 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`flex items-center gap-2 px-4 py-3 border rounded-lg shadow-lg ${colorMap[notification.type]}`}
              style={{
                position: 'relative',
                top: `${index * 4}px`,
              }}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm">{notification.message}</span>
              <button
                onClick={() => removeNotification(notification.id)}
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
                aria-label="Close notification"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
