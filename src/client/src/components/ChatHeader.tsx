import React from 'react';
import { Tenant } from '../types';

interface ChatHeaderProps {
  tenant: Tenant | null;
  isConnected: boolean;
  onClose: () => void;
  theme?: 'light' | 'dark';
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ tenant, isConnected, onClose, theme = 'light' }) => {
  return (
    <div className={`
      px-4 py-3 border-b flex items-center justify-between
      ${theme === 'dark' 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
      }
      ${tenant?.branding?.primaryColor 
        ? `bg-[${tenant.branding.primaryColor}]` 
        : 'bg-blue-600'
      }
      text-white
    `}>
      <div className="flex items-center space-x-3">
        {/* Law Firm Logo or Avatar */}
        <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
          {tenant?.branding?.logo ? (
            <img
              src={tenant.branding.logo}
              alt={tenant.name}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
            </svg>
          )}
        </div>

        {/* Firm Info */}
        <div>
          <h3 className="font-semibold text-sm">
            {tenant?.branding?.companyName || tenant?.name || 'Legal Assistant'}
          </h3>
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
            <span className="text-xs opacity-90">
              {isConnected ? 'Online' : 'Connecting...'}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-2">
        {/* Minimize Button */}
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
          aria-label="Minimize chat"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
          aria-label="Close chat"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;