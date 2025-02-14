'use client';

import { ChangeEvent } from 'react';
import { Card, Title, Text } from "@tremor/react";
import { DocumentIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Document } from './types';

interface KnowledgeBaseDocumentsPanelProps {
  documents: Document[];
  onUpload: (files: FileList) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function KnowledgeBaseDocumentsPanel({
  documents,
  onUpload,
  onDelete,
}: KnowledgeBaseDocumentsPanelProps) {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUpload(e.target.files);
      e.target.value = ''; // Reset input
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Title>Documents</Title>
        <label className="cursor-pointer bg-accent hover:bg-accent/80 text-black px-4 py-2 rounded-lg">
          Upload Document
          <input
            type="file"
            className="hidden"
            onChange={handleFileChange}
            multiple
            accept=".pdf,.doc,.docx,.txt"
          />
        </label>
      </div>

      {documents.length === 0 ? (
        <Card className="mt-4">
          <div className="flex flex-col items-center justify-center py-12">
            <DocumentIcon className="w-12 h-12 text-white/50" />
            <Text className="mt-2 text-white/50">No documents uploaded yet</Text>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4">
          {documents.map((doc) => (
            <Card key={doc.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <DocumentIcon className="w-8 h-8 text-white/70" />
                  <div>
                    <Text className="font-medium">{doc.title}</Text>
                    <Text className="text-sm text-white/70">{doc.subtitle}</Text>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  {doc.status === 'processing' && (
                    <span className="text-sm text-yellow-500">Processing...</span>
                  )}
                  {doc.status === 'indexed' && (
                    <span className="text-sm text-green-500">Indexed</span>
                  )}
                  {doc.status === 'failed' && (
                    <span className="text-sm text-red-500">Failed</span>
                  )}
                  <button
                    onClick={() => onDelete(doc.id)}
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
    </div>
  );
} 