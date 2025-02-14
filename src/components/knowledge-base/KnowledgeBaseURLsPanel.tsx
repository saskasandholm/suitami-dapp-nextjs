'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { LinkIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Source } from './types';
import KnowledgeBaseItem from './KnowledgeBaseItem';
import KnowledgeBaseForm from './KnowledgeBaseForm';
import LoadingIndicator from '../ui/LoadingIndicator';
import Notification from '../ui/Notification';
import { Card, Title, Text } from "@tremor/react";

interface KnowledgeBaseURLsPanelProps {
  sources: Source[];
  onAdd: (title: string, url: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function KnowledgeBaseURLsPanel({
  sources,
  onAdd,
  onDelete,
}: KnowledgeBaseURLsPanelProps) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    type: 'error' | 'success' | 'info';
    message: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title && url) {
      setIsAdding(true);
      try {
        await onAdd(title, url);
        setTitle('');
        setUrl('');
        setNotification({
          type: 'success',
          message: 'Source added successfully'
        });
      } catch (error) {
        setNotification({
          type: 'error',
          message: error instanceof Error ? error.message : 'Failed to add source'
        });
      } finally {
        setIsAdding(false);
      }
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    try {
      await onDelete(id);
      setNotification({
        type: 'success',
        message: 'Source deleted successfully'
      });
    } catch (error) {
      setNotification({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to delete source'
      });
    } finally {
      setIsDeleting(null);
    }
  };

  const processedSources = sources.map(source => ({
    ...source,
    subtitle: `${source.url} • Added on ${source.addedAt}`
  }));

  return (
    <div className="space-y-4">
      <Title>URLs</Title>

      <Card className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-white/70">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 text-white shadow-sm focus:border-accent focus:ring-accent sm:text-sm"
              placeholder="Enter a title for the URL"
              required
            />
          </div>
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-white/70">
              URL
            </label>
            <input
              type="url"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="mt-1 block w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 text-white shadow-sm focus:border-accent focus:ring-accent sm:text-sm"
              placeholder="https://example.com"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-accent hover:bg-accent/80 text-black px-4 py-2 rounded-lg"
          >
            Add URL
          </button>
        </form>
      </Card>

      {sources.length === 0 ? (
        <Card className="mt-4">
          <div className="flex flex-col items-center justify-center py-12">
            <LinkIcon className="w-12 h-12 text-white/50" />
            <Text className="mt-2 text-white/50">No URLs added yet</Text>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4">
          {sources.map((source) => (
            <Card key={source.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <LinkIcon className="w-8 h-8 text-white/70" />
                  <div>
                    <Text className="font-medium">{source.title}</Text>
                    <Text className="text-sm text-white/70">{source.subtitle}</Text>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  {source.status === 'processing' && (
                    <span className="text-sm text-yellow-500">Processing...</span>
                  )}
                  {source.status === 'indexed' && (
                    <span className="text-sm text-green-500">Indexed</span>
                  )}
                  {source.status === 'failed' && (
                    <span className="text-sm text-red-500">Failed</span>
                  )}
                  <button
                    onClick={() => handleDelete(source.id)}
                    className="p-2 hover:bg-white/10 rounded-lg"
                  >
                    <TrashIcon className="w-5 h-5 text-white/70" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Notification
        type={notification?.type || 'info'}
        message={notification?.message || ''}
        isVisible={!!notification}
        onClose={() => setNotification(null)}
      />
    </div>
  );
} 