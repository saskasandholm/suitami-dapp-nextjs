'use client';

import { useState, useEffect } from 'react';
import { DocumentIcon, LinkIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import KnowledgeBaseDocumentsPanel from './KnowledgeBaseDocumentsPanel';
import KnowledgeBaseURLsPanel from './KnowledgeBaseURLsPanel';
import KnowledgeBaseFAQsPanel from './KnowledgeBaseFAQsPanel';
import { Document, Source, FAQ, FAQCategory } from './types';
import { useNotification } from '@/contexts/NotificationContext';

// Maximum file size in MB
const MAX_FILE_SIZE = 10;
const ALLOWED_FILE_TYPES = ['.pdf', '.doc', '.docx', '.txt'];
const MAX_QUESTION_LENGTH = 200;
const MAX_ANSWER_LENGTH = 1000;

interface KnowledgeBaseProps {
  agentId?: string; // Optional for standalone knowledge base page
}

export default function KnowledgeBase({ agentId }: KnowledgeBaseProps) {
  const [activeTab, setActiveTab] = useState<'documents' | 'urls' | 'faqs'>('documents');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const [faqs, setFAQs] = useState<FAQ[]>([]);
  const { addNotification } = useNotification();

  // Cleanup function for unmounting
  useEffect(() => {
    return () => {
      // Clear any pending timeouts
      const cleanup = () => {
        documents.forEach(doc => {
          if (doc.status === 'processing') {
            setDocuments(prev => prev.map(d => (d.id === doc.id ? { ...d, status: 'failed' } : d)));
          }
        });

        sources.forEach(source => {
          if (source.status === 'processing') {
            setSources(prev =>
              prev.map(s => (s.id === source.id ? { ...s, status: 'failed' } : s))
            );
          }
        });
      };
      cleanup();
    };
  }, [documents, sources]);

  const generateUniqueId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const validateFile = (file: File): string | null => {
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ALLOWED_FILE_TYPES.includes(extension)) {
      return `Invalid file type for "${file.name}". Allowed types are: ${ALLOWED_FILE_TYPES.join(', ')}`;
    }
    if (file.size > MAX_FILE_SIZE * 1024 * 1024) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      return `File "${file.name}" (${sizeMB}MB) exceeds the ${MAX_FILE_SIZE}MB size limit`;
    }
    return null;
  };

  const validateURL = (url: string): string | null => {
    try {
      new URL(url);
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return 'URL must start with http:// or https://';
      }
      return null;
    } catch {
      return 'Please enter a valid URL (e.g., https://example.com)';
    }
  };

  const validateFAQ = (question: string, answer: string): string | null => {
    if (question.trim().length === 0) {
      return 'Question cannot be empty';
    }
    if (answer.trim().length === 0) {
      return 'Answer cannot be empty';
    }
    if (question.length > MAX_QUESTION_LENGTH) {
      return `Question exceeds maximum length of ${MAX_QUESTION_LENGTH} characters`;
    }
    if (answer.length > MAX_ANSWER_LENGTH) {
      return `Answer exceeds maximum length of ${MAX_ANSWER_LENGTH} characters`;
    }
    return null;
  };

  const showNotification = (type: 'error' | 'success' | 'info', message: string) => {
    addNotification({
      type,
      message,
      isPersistent: type === 'error',
    });
  };

  const handleFileUpload = async (files: FileList) => {
    if (files.length === 0) {
      showNotification('error', 'Please select at least one file to upload');
      return;
    }

    const newDocuments: Document[] = [];
    const errors: string[] = [];

    Array.from(files).forEach(file => {
      const error = validateFile(file);
      if (error) {
        errors.push(error);
      } else {
        newDocuments.push({
          id: generateUniqueId(),
          title: file.name,
          subtitle: `${(file.size / (1024 * 1024)).toFixed(1)} MB • Uploaded now`,
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          uploadDate: new Date().toISOString().split('T')[0],
          status: 'processing',
        });
      }
    });

    if (errors.length > 0) {
      showNotification('error', errors.join('\n\n'));
      return;
    }

    setDocuments(prev => [...prev, ...newDocuments]);
    showNotification(
      'info',
      `Processing ${newDocuments.length} document${newDocuments.length > 1 ? 's' : ''}. This may take a few moments...`
    );

    try {
      await Promise.all(
        newDocuments.map(
          doc =>
            new Promise<void>((resolve, reject) => {
              const timeout = setTimeout(() => {
                setDocuments(prev => {
                  const index = prev.findIndex(d => d.id === doc.id);
                  if (index === -1) return prev;

                  const newDocs = [...prev];
                  newDocs[index] = { ...newDocs[index], status: 'indexed' };
                  return newDocs;
                });
                resolve();
              }, 2000);

              (doc as any)._timeoutId = timeout;
            })
        )
      );
      showNotification(
        'success',
        `Successfully processed ${newDocuments.length} document${newDocuments.length > 1 ? 's' : ''}. Your knowledge base has been updated.`
      );
    } catch (error) {
      showNotification(
        'error',
        'An error occurred while processing your documents. Please try again or contact support if the issue persists.'
      );
      setDocuments(prev =>
        prev.map(d => (d.status === 'processing' ? { ...d, status: 'failed' } : d))
      );
    }
  };

  const handleAddSource = async (title: string, url: string) => {
    try {
      if (!title.trim()) {
        throw new Error('Please enter a title for the URL source');
      }

      const urlError = validateURL(url);
      if (urlError) {
        throw new Error(urlError);
      }

      const newSource: Source = {
        id: generateUniqueId(),
        title: title.trim(),
        subtitle: `${url} • Added now`,
        url,
        status: 'processing',
        addedAt: new Date().toISOString().split('T')[0],
      };

      setSources(prev => [...prev, newSource]);
      showNotification('info', 'Processing URL source. This may take a few moments...');

      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          setSources(prev => {
            const index = prev.findIndex(s => s.id === newSource.id);
            if (index === -1) return prev;

            const newSources = [...prev];
            newSources[index] = { ...newSources[index], status: 'indexed' };
            return newSources;
          });
          resolve();
        }, 2000);

        (newSource as any)._timeoutId = timeout;
      });
      showNotification(
        'success',
        'URL source has been successfully added and indexed. Your knowledge base has been updated.'
      );
    } catch (error) {
      showNotification(
        'error',
        error instanceof Error
          ? error.message
          : 'An error occurred while adding the URL source. Please check your input and try again.'
      );
    }
  };

  const handleAddFAQ = async (question: string, answer: string, category: FAQCategory) => {
    try {
      const error = validateFAQ(question, answer);
      if (error) {
        throw new Error(error);
      }

      const newFAQ: FAQ = {
        id: generateUniqueId(),
        title: question.trim(),
        subtitle: answer.trim(),
        question: question.trim(),
        answer: answer.trim(),
        category,
      };

      setFAQs(prev => [...prev, newFAQ]);
      showNotification('success', 'FAQ has been successfully added to your knowledge base.');
    } catch (error) {
      showNotification(
        'error',
        error instanceof Error
          ? error.message
          : 'An error occurred while adding the FAQ. Please check your input and try again.'
      );
    }
  };

  const handleDeleteDocument = async (id: string) => {
    try {
      const doc = documents.find(d => d.id === id);
      if (!doc) {
        throw new Error('Document not found');
      }

      if ((doc as any)._timeoutId) {
        clearTimeout((doc as any)._timeoutId);
      }
      setDocuments(prev => prev.filter(doc => doc.id !== id));
      showNotification(
        'success',
        `Document "${doc.title}" has been successfully removed from your knowledge base.`
      );
    } catch (error) {
      showNotification(
        'error',
        'Unable to delete the document. Please try again or contact support if the issue persists.'
      );
    }
  };

  const handleDeleteSource = async (id: string) => {
    try {
      const source = sources.find(s => s.id === id);
      if (source && (source as any)._timeoutId) {
        clearTimeout((source as any)._timeoutId);
      }
      setSources(prev => prev.filter(source => source.id !== id));
      showNotification('success', 'URL source successfully deleted');
    } catch (error) {
      showNotification('error', 'Failed to delete URL source');
    }
  };

  const handleDeleteFAQ = async (id: string) => {
    try {
      setFAQs(prev => prev.filter(faq => faq.id !== id));
      showNotification('success', 'FAQ successfully deleted');
    } catch (error) {
      showNotification('error', 'Failed to delete FAQ');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex space-x-4 border-b border-white/10">
        <button
          className={`px-4 py-2 ${
            activeTab === 'documents' ? 'border-b-2 border-accent text-accent' : 'text-white/70'
          }`}
          onClick={() => setActiveTab('documents')}
        >
          <div className="flex items-center">
            <DocumentIcon className="w-5 h-5 mr-2" />
            Documents
          </div>
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === 'urls' ? 'border-b-2 border-accent text-accent' : 'text-white/70'
          }`}
          onClick={() => setActiveTab('urls')}
        >
          <div className="flex items-center">
            <LinkIcon className="w-5 h-5 mr-2" />
            URLs
          </div>
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === 'faqs' ? 'border-b-2 border-accent text-accent' : 'text-white/70'
          }`}
          onClick={() => setActiveTab('faqs')}
        >
          <div className="flex items-center">
            <QuestionMarkCircleIcon className="w-5 h-5 mr-2" />
            FAQs
          </div>
        </button>
      </div>

      <div className="mt-6">
        {activeTab === 'documents' && (
          <KnowledgeBaseDocumentsPanel
            documents={documents}
            onUpload={handleFileUpload}
            onDelete={handleDeleteDocument}
          />
        )}
        {activeTab === 'urls' && (
          <KnowledgeBaseURLsPanel
            sources={sources}
            onAdd={handleAddSource}
            onDelete={handleDeleteSource}
          />
        )}
        {activeTab === 'faqs' && (
          <KnowledgeBaseFAQsPanel faqs={faqs} onAdd={handleAddFAQ} onDelete={handleDeleteFAQ} />
        )}
      </div>
    </div>
  );
}
