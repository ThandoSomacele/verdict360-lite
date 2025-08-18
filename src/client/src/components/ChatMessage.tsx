import React from 'react';
import { Message, Tenant } from '../types';

interface ChatMessageProps {
  message: Message;
  tenant: Tenant | null;
  theme?: 'light' | 'dark';
  onConsultationRequest?: () => void;
  onContinueChat?: () => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, tenant, theme = 'light', onConsultationRequest, onContinueChat }) => {
  const isBot = message.senderType === 'bot';
  const isVisitor = message.senderType === 'visitor';
  const isAttorney = message.senderType === 'attorney';

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getBotAvatar = () => (
    <div className={`
      w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium
      ${tenant?.branding?.primaryColor 
        ? `bg-[${tenant.branding.primaryColor}]` 
        : 'bg-blue-600'
      }
    `}>
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
      </svg>
    </div>
  );

  const getAttorneyAvatar = () => (
    <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white text-sm font-medium">
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
      </svg>
    </div>
  );

  const getVisitorAvatar = () => (
    <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white text-sm font-medium">
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
      </svg>
    </div>
  );

  if (isVisitor) {
    return (
      <div className="flex justify-end">
        <div className="max-w-xs lg:max-w-md">
          <div className={`
            px-4 py-2 rounded-lg
            ${tenant?.branding?.primaryColor 
              ? `bg-[${tenant.branding.primaryColor}]` 
              : 'bg-blue-600'
            }
            text-white
          `}>
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          </div>
          <div className="flex justify-end items-center mt-1 space-x-2">
            <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              {formatTime(message.sentAt)}
            </span>
            {getVisitorAvatar()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <div className="flex-shrink-0 mr-3">
        {isBot ? getBotAvatar() : getAttorneyAvatar()}
      </div>
      <div className="max-w-xs lg:max-w-md">
        {(isBot || isAttorney) && (
          <div className="flex items-center mb-1">
            <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              {isBot ? (tenant?.branding?.companyName || 'Legal Assistant') : message.senderName}
            </span>
            {isAttorney && (
              <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                Attorney
              </span>
            )}
          </div>
        )}
        <div className={`
          px-4 py-2 rounded-lg
          ${theme === 'dark' 
            ? 'bg-gray-700 text-gray-100' 
            : 'bg-gray-100 text-gray-900'
          }
        `}>
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          
          {/* Show consultation offer buttons if applicable */}
          {message.metadata?.shouldOfferConsultation && (
            <div className="mt-3 space-y-2">
              <button 
                onClick={onConsultationRequest}
                className={`
                  w-full px-3 py-2 text-sm rounded-md border transition-colors
                  ${tenant?.branding?.primaryColor 
                    ? `border-[${tenant.branding.primaryColor}] text-[${tenant.branding.primaryColor}] hover:bg-[${tenant.branding.primaryColor}] hover:text-white` 
                    : 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
                  }
                `}>
                Yes, connect me with an attorney
              </button>
              <button 
                onClick={onContinueChat}
                className={`
                  w-full px-3 py-2 text-sm rounded-md border transition-colors
                  ${theme === 'dark' 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-600' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }
                `}>
                No, continue chatting
              </button>
            </div>
          )}

          {/* Show contact form if data collection */}
          {message.metadata?.isDataCollection && (
            <div className="mt-3 p-3 bg-white rounded-md border">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Contact Information</h4>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className={`
                  w-full px-3 py-2 text-sm text-white rounded-md transition-colors
                  ${tenant?.branding?.primaryColor 
                    ? `bg-[${tenant.branding.primaryColor}] hover:opacity-90` 
                    : 'bg-blue-600 hover:bg-blue-700'
                  }
                `}>
                  Submit Information
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center mt-1">
          <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            {formatTime(message.sentAt)}
          </span>
          {message.metadata?.confidenceScore && (
            <span className={`ml-2 text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
              Confidence: {Math.round(message.metadata.confidenceScore * 100)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;