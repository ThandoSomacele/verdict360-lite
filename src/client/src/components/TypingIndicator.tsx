import React from 'react';
import './TypingIndicator.css';

interface TypingIndicatorProps {
  user: string;
  theme?: 'light' | 'dark';
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ user, theme = 'light' }) => {
  return (
    <div className="flex items-center space-x-3">
      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
        </svg>
      </div>
      
      <div className="max-w-xs lg:max-w-md">
        <div className={`
          px-4 py-3 rounded-lg
          ${theme === 'dark' 
            ? 'bg-gray-700 text-gray-100' 
            : 'bg-gray-100 text-gray-900'
          }
        `}>
          <div className="flex items-center space-x-2">
            <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {user} is typing
            </span>
            <div className="typing-dots flex space-x-1 items-center h-4">
              <div className="typing-dot typing-dot-1 w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="typing-dot typing-dot-2 w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="typing-dot typing-dot-3 w-2 h-2 bg-blue-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;