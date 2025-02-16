import { useState, useEffect } from 'react';
import { Card, Title, Text, Button } from '@tremor/react';
import { clearCommunityCache, getCacheMetrics, getCacheStatus } from '@/services/communityApi';

export default function CacheDebugPanel() {
  const [metrics, setMetrics] = useState<ReturnType<typeof getCacheMetrics>>();
  const [status, setStatus] = useState<Record<string, number>>({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isVisible) {
      const updateMetrics = () => {
        setMetrics(getCacheMetrics());
        setStatus(getCacheStatus());
      };

      updateMetrics();
      const interval = setInterval(updateMetrics, 5000);
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 px-3 py-1.5 text-xs bg-accent/20 text-accent rounded-lg hover:bg-accent/30 transition-colors"
      >
        Show Cache Debug
      </button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-96 bg-black/90 border-accent/20 backdrop-blur-sm z-50">
      <div className="flex items-center justify-between mb-4">
        <Title className="text-white text-lg">Cache Debug Panel</Title>
        <button
          onClick={() => setIsVisible(false)}
          className="text-white/50 hover:text-white"
        >
          ✕
        </button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 p-3 rounded-lg">
            <Text className="text-white/70 text-sm">Entries</Text>
            <Text className="text-white text-lg">{metrics?.entries ?? 0}</Text>
          </div>
          <div className="bg-white/5 p-3 rounded-lg">
            <Text className="text-white/70 text-sm">Size</Text>
            <Text className="text-white text-lg">
              {((metrics?.size ?? 0) / 1024).toFixed(1)} KB
            </Text>
          </div>
        </div>

        {metrics && (
          <div className="space-y-2">
            <Text className="text-white/70 text-sm">Cache Age</Text>
            <div className="bg-white/5 p-3 rounded-lg space-y-2">
              <div className="flex justify-between">
                <Text className="text-white/70 text-sm">Oldest Entry</Text>
                <Text className="text-white text-sm">
                  {((Date.now() - metrics.oldestEntry) / 1000).toFixed(0)}s ago
                </Text>
              </div>
              <div className="flex justify-between">
                <Text className="text-white/70 text-sm">Newest Entry</Text>
                <Text className="text-white text-sm">
                  {((Date.now() - metrics.newestEntry) / 1000).toFixed(0)}s ago
                </Text>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Text className="text-white/70 text-sm">Actions</Text>
          <div className="flex flex-col gap-2">
            <Button
              size="xs"
              variant="secondary"
              onClick={() => {
                clearCommunityCache();
                setMetrics(getCacheMetrics());
                setStatus(getCacheStatus());
              }}
            >
              Clear All Cache
            </Button>
            <Button
              size="xs"
              variant="secondary"
              onClick={() => {
                clearCommunityCache('metrics');
                setMetrics(getCacheMetrics());
                setStatus(getCacheStatus());
              }}
            >
              Clear Metrics Cache
            </Button>
            <Button
              size="xs"
              variant="secondary"
              onClick={() => {
                clearCommunityCache('sentiment');
                setMetrics(getCacheMetrics());
                setStatus(getCacheStatus());
              }}
            >
              Clear Sentiment Cache
            </Button>
            <Button
              size="xs"
              variant="secondary"
              onClick={() => {
                clearCommunityCache('topics');
                setMetrics(getCacheMetrics());
                setStatus(getCacheStatus());
              }}
            >
              Clear Topics Cache
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
} 