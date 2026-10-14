// src/components/EditableText.tsx
import React from 'react';
import { useSiteConfig } from '../context/SiteConfigContext';

interface EditableTextProps {
  value: string;
  onChange: (newValue: string) => void;
  className?: string;
  tagName?: 'h1' | 'h2' | 'p' | 'span';
}

export const EditableText: React.FC<EditableTextProps> = ({ value, onChange, className = '', tagName = 'span' }) => {
  const { isEditMode } = useSiteConfig();

  if (!isEditMode) {
    const Tag = tagName;
    return <Tag className={className}>{value}</Tag>;
  }

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`${className} border-2 border-dashed border-red-500 bg-red-500/10 px-1 rounded focus:outline-none focus:border-red-600`}
    />
  );
};