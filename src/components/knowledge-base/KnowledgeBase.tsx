'use client';

import { useState } from 'react';
import { Card, Title, Text } from "@tremor/react";
import {
  DocumentIcon,
  LinkIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import KnowledgeBaseDocumentsPanel from './KnowledgeBaseDocumentsPanel';
import KnowledgeBaseURLsPanel from './KnowledgeBaseURLsPanel';
import KnowledgeBaseFAQsPanel from './KnowledgeBaseFAQsPanel';
import { Document, Source, FAQ } from './types';

interface KnowledgeBaseProps {
  agentId?: string;  // Optional for standalone knowledge base page
}

export default function KnowledgeBase({ agentId }: KnowledgeBaseProps) {
  const [activeTab, setActiveTab] = useState<'documents' | 'urls' | 'faqs'>('documents');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);

  const handleFileUpload = async (files: FileList) => {
    const newDocuments: Document[] = Array.from(files).map(file => ({
      id: Date.now().toString(),
      title: file.name,
      subtitle: `${(file.size / (1024 * 1024)).toFixed(1)} MB • Uploaded now`,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'processing',
    }));

    setDocuments(prev => [...prev, ...newDocuments]);

    // Simulate processing
    await Promise.all(newDocuments.map(doc => 
      new Promise<void>(resolve => {
        setTimeout(() => {
          setDocuments(prev =>
            prev.map(d => d.id === doc.id ? { ...d, status: 'indexed' } : d)
          );
          resolve();
        }, 2000);
      })
    ));
  };

  const handleAddSource = async (title: string, url: string) => {
    const newSource: Source = {
      id: Date.now().toString(),
      title,
      subtitle: `${url} • Added now`,
      url,
      status: 'processing',
      addedAt: new Date().toISOString().split('T')[0],
    };

    setSources(prev => [...prev, newSource]);

    // Simulate processing
    await new Promise<void>(resolve => {
      setTimeout(() => {
        setSources(prev =>
          prev.map(s => s.id === newSource.id ? { ...s, status: 'indexed' } : s)
        );
        resolve();
      }, 2000);
    });
  };

  const handleAddFAQ = async (question: string, answer: string, category: string) => {
    const newFAQ: FAQ = {
      id: Date.now().toString(),
      title: question,
      subtitle: answer,
      question,
      answer,
      category,
    };

    setFaqs(prev => [...prev, newFAQ]);
  };

  const handleDeleteDocument = async (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const handleDeleteSource = async (id: string) => {
    setSources(prev => prev.filter(source => source.id !== id));
  };

  const handleDeleteFAQ = async (id: string) => {
    setFaqs(prev => prev.filter(faq => faq.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex space-x-4 border-b border-white/10">
        <button
          className={`px-4 py-2 ${
            activeTab === 'documents'
              ? 'border-b-2 border-accent text-accent'
              : 'text-white/70'
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
            activeTab === 'urls'
              ? 'border-b-2 border-accent text-accent'
              : 'text-white/70'
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
            activeTab === 'faqs'
              ? 'border-b-2 border-accent text-accent'
              : 'text-white/70'
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
          <KnowledgeBaseFAQsPanel
            faqs={faqs}
            onAdd={handleAddFAQ}
            onDelete={handleDeleteFAQ}
          />
        )}
      </div>
    </div>
  );
} 