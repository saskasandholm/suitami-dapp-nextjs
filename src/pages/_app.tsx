import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { NotificationProvider } from '@/contexts/NotificationContext';
import Notification from '@/components/ui/Notification';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NotificationProvider>
      <Component {...pageProps} />
      <Notification />
    </NotificationProvider>
  );
}
