import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { 
  ExclamationTriangleIcon, 
  CheckCircleIcon, 
  InformationCircleIcon 
} from '@heroicons/react/24/solid';

type NotificationType = 'error' | 'success' | 'info';

interface NotificationProps {
  type: NotificationType;
  message: string;
  onClose: () => void;
  isVisible: boolean;
}

const iconMap = {
  error: ExclamationTriangleIcon,
  success: CheckCircleIcon,
  info: InformationCircleIcon
};

const colorMap = {
  error: 'bg-red-500/10 border-red-500/50 text-red-500',
  success: 'bg-green-500/10 border-green-500/50 text-green-500',
  info: 'bg-blue-500/10 border-blue-500/50 text-blue-500'
};

export default function Notification({
  type,
  message,
  onClose,
  isVisible
}: NotificationProps) {
  const Icon = iconMap[type];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 
                     border rounded-lg shadow-lg ${colorMap[type]}`}
        >
          <Icon className="w-5 h-5" />
          <span className="text-sm">{message}</span>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Close notification"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 