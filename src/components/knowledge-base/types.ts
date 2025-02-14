export interface ItemData {
  id: string;
  title: string;
  subtitle: string;
  status?: 'processing' | 'indexed' | 'failed';
}

export interface Document extends ItemData {
  size: string;
  uploadDate: string;
  status: 'processing' | 'indexed' | 'failed';
}

export interface Source extends ItemData {
  url: string;
  status: 'processing' | 'indexed' | 'failed';
  addedAt: string;
}

export interface FAQ extends ItemData {
  question: string;
  answer: string;
  category: string;
}

export type FormState = Record<string, string>;

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'url' | 'textarea' | 'select';
  placeholder?: string;
  options?: string[];
  required?: boolean;
  validate?: (value: string) => string | undefined;
}

export interface FormErrors {
  [key: string]: string | undefined;
} 