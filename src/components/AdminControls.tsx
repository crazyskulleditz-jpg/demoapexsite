// src/components/AdminControls.tsx
import React from 'react';
import { useSiteConfig } from '../context/SiteConfigContext';

interface AdminControlsProps {
  userRole?: string;
}

export const AdminControls: React.FC<AdminControlsProps> = ({ userRole }) => {
  const { config, updateNestedConfig, isEditMode, setIsEditMode } = useSiteConfig();

  // Only render for admin user accounts
  if (userRole !== 'admin') return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-gray-900 text-white p-4 rounded-xl shadow-2xl border border-gray-700 flex flex-col gap-3 min-w-[280px]">
      <div className="flex items-center justify-between border-b border-gray-700 pb-2">
        <span className="font-bold text-sm tracking-wide text-red-500">ADMIN SITE BUILDER</span>
        <button
          onClick={() => setIsEditMode(!isEditMode)}
          className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
            isEditMode ? 'bg-red-600 text-white animate-pulse' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
          }`}
        >
          {isEditMode ? 'Editing Active (Click to Exit)' : 'Enable Live Builder'}
        </button>
      </div>

      {isEditMode && (
        <div className="flex flex-col gap-2 text-xs">
          <label className="flex flex-col gap-1">
            <span className="text-gray-400">Primary Theme Color</span>
            <input
              type="color"
              value={config.theme.primaryColor}
              onChange={(e) => updateNestedConfig('theme', 'primaryColor', e.target.value)}
              className="w-full h-8 cursor-pointer rounded border-none bg-transparent"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-gray-400">Font Style</span>
            <select
              value={config.theme.fontFamily}
              onChange={(e) => updateNestedConfig('theme', 'fontFamily', e.target.value)}
              className="bg-gray-800 text-white p-1.5 rounded border border-gray-700 focus:outline-none"
            >
              <option value="sans-serif">Modern Sans-Serif</option>
              <option value="serif">Classic Serif</option>
              <option value="monospace">Tech Monospace</option>
              <option value="cursive">Display Style</option>
            </select>
          </label>
        </div>
      )}
    </div>
  );
};