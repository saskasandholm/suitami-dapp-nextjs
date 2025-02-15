'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuestionMarkCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
import { FAQ, FAQ_CATEGORIES, FAQCategory } from './types';
import LoadingIndicator from '../ui/LoadingIndicator';
import { useNotification } from '@/contexts/NotificationContext';
import { Card, Title, Text } from '@tremor/react';

interface KnowledgeBaseFAQsPanelProps {
  faqs: FAQ[];
  onAdd: (question: string, answer: string, category: FAQCategory) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function KnowledgeBaseFAQsPanel({
  faqs,
  onAdd,
  onDelete,
}: KnowledgeBaseFAQsPanelProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { addNotification } = useNotification();
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState<FAQCategory | ''>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (question && answer && category) {
      setIsAdding(true);
      try {
        await onAdd(question, answer, category as FAQCategory);
        setQuestion('');
        setAnswer('');
        setCategory('');
      } catch (error) {
        // Error notification is handled by parent
      } finally {
        setIsAdding(false);
      }
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await onDelete(id);
    } catch (error) {
      // Error notification is handled by parent
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <Title>FAQs</Title>

      <Card className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="question" className="block text-sm font-medium text-white/70">
              Question
            </label>
            <input
              type="text"
              id="question"
              value={question}
              onChange={e => setQuestion(e.target.value)}
              className="mt-1 block w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 text-white shadow-sm focus:border-accent focus:ring-accent sm:text-sm"
              placeholder="Enter your question"
              required
              disabled={isAdding}
            />
          </div>
          <div>
            <label htmlFor="answer" className="block text-sm font-medium text-white/70">
              Answer
            </label>
            <textarea
              id="answer"
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              className="mt-1 block w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 text-white shadow-sm focus:border-accent focus:ring-accent sm:text-sm"
              placeholder="Enter the answer"
              rows={4}
              required
              disabled={isAdding}
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-white/70">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={e => setCategory(e.target.value as FAQCategory | '')}
              className="mt-1 block w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 text-white shadow-sm focus:border-accent focus:ring-accent sm:text-sm"
              required
              disabled={isAdding}
            >
              <option value="">Select a category</option>
              {FAQ_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className={`button-primary w-full ${isAdding ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isAdding}
          >
            {isAdding ? (
              <div className="flex items-center justify-center space-x-2">
                <LoadingIndicator size="sm" />
                <span>Adding FAQ...</span>
              </div>
            ) : (
              'Add FAQ'
            )}
          </button>
        </form>
      </Card>

      {faqs.length === 0 ? (
        <Card className="mt-4">
          <div className="flex flex-col items-center justify-center py-12">
            <QuestionMarkCircleIcon className="w-12 h-12 text-white/50" />
            <Text className="mt-2 text-white/50">No FAQs added yet</Text>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4">
          {faqs.map(faq => (
            <Card key={faq.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <QuestionMarkCircleIcon className="w-8 h-8 text-white/70" />
                  <div>
                    <Text className="font-medium">{faq.title}</Text>
                    <Text className="text-sm text-white/70">{faq.subtitle}</Text>
                    <Text className="text-xs text-white/50 mt-1">Category: {faq.category}</Text>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(faq.id)}
                  className={`p-2 hover:bg-white/10 rounded-lg transition-opacity ${
                    deletingId === faq.id ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={deletingId === faq.id}
                >
                  {deletingId === faq.id ? (
                    <LoadingIndicator size="sm" />
                  ) : (
                    <TrashIcon className="w-5 h-5 text-white/70" />
                  )}
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
