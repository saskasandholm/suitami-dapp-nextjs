'use client';

import { NotificationProvider } from '@/contexts/NotificationContext';
import Notification from '@/components/ui/Notification';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <NotificationProvider>
      {children}
      <Notification />
    </NotificationProvider>
  );
}
