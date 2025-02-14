'use client';

import { Text, Badge } from "@tremor/react";
import { TrashIcon } from "@heroicons/react/24/outline";

interface ItemData {
  id: string;
  title: string;
  subtitle: string;
  [key: string]: any;  // Allow for additional properties
}

interface KnowledgeBaseItemProps<T extends ItemData> {
  icon: React.ReactNode;
  itemData: T;
  status?: 'processing' | 'indexed' | 'failed';
  badge?: string;
  onDelete: (id: string) => void;
  className?: string;
}

export default function KnowledgeBaseItem<T extends ItemData>({
  icon,
  itemData,
  status,
  badge,
  onDelete,
  className = '',
}: KnowledgeBaseItemProps<T>) {
  return (
    <div className={`glass-card p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {icon}
          <div>
            <Text className="text-white">{itemData.title}</Text>
            <Text className="text-white/70 text-sm">{itemData.subtitle}</Text>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {status && (
            <Badge
              className={`${
                status === 'indexed'
                  ? 'bg-green-400/10 text-green-400'
                  : status === 'processing'
                  ? 'bg-yellow-400/10 text-yellow-400'
                  : 'bg-red-400/10 text-red-400'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          )}
          {badge && (
            <Badge className="bg-white/5 text-white/70">
              {badge}
            </Badge>
          )}
          <button 
            className="text-red-400 hover:text-red-300"
            onClick={() => onDelete(itemData.id)}
            aria-label={`Delete ${itemData.title}`}
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
} 