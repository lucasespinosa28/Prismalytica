import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Message } from './types';

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, isLoading }) => {
  return (
    <div className="flex-1 p-4 overflow-y-auto space-y-4">
      {messages.map(message => (
        <div 
          key={message.id} 
          className={`flex flex-col max-w-[80%] rounded-lg p-3 mb-2 ${
            message.sender === 'user' 
              ? 'bg-blue-500 text-white self-end' 
              : 'bg-gray-100 text-gray-800 self-start'
          }`}
        >
          <div className="message-content break-words">
            {message.sender === 'user' ? (
              message.text
            ) : (
              <ReactMarkdown 
                components={{
                  a: ({ href, children, ...props }) => (
                    <a 
                      href={href} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-600 hover:underline"
                      {...props}
                    >
                      {children}
                    </a>
                  ),
                  p: ({ children }) => <p className="mb-2">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc pl-5 mb-2">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal pl-5 mb-2">{children}</ol>,
                  code: ({ children }) => <code className="bg-gray-200 px-1 rounded text-sm">{children}</code>,
                  pre: ({ children }) => <pre className="bg-gray-800 text-gray-100 p-2 rounded my-2 overflow-x-auto">{children}</pre>,
                }}
              >
                {message.text}
              </ReactMarkdown>
            )}
          </div>
          <div className="text-xs opacity-70 mt-1 self-end">
            {message.timestamp.toLocaleTimeString()}
          </div>
        </div>
      ))}
      {isLoading && (
        <div className="flex flex-col max-w-[80%] rounded-lg p-3 mb-2 bg-gray-100 text-gray-800 self-start">
          <div className="message-content">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-gray-500 rounded-full animate-pulse"></div>
              <div className="h-2 w-2 bg-gray-500 rounded-full animate-pulse delay-75"></div>
              <div className="h-2 w-2 bg-gray-500 rounded-full animate-pulse delay-150"></div>
              <span className="ml-1">Thinking...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessages;