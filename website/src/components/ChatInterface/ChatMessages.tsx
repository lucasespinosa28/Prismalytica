import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Message } from './types';

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, isLoading }) => {
  return (
    <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50 dark:bg-gray-900">
      {messages.map(message => (
        <div 
          key={message.id} 
          className={`flex flex-col max-w-[85%] rounded-2xl p-4 mb-3 shadow-sm ${
            message.sender === 'user' 
              ? 'bg-blue-600 text-white self-end rounded-br-none' 
              : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 self-start rounded-bl-none border border-gray-100 dark:border-gray-700'
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
                      className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                      {...props}
                    >
                      {children}
                    </a>
                  ),
                  p: ({ children }) => <p className="mb-3 leading-relaxed">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc pl-5 mb-3 space-y-1">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal pl-5 mb-3 space-y-1">{children}</ol>,
                  li: ({ children }) => <li className="mb-1">{children}</li>,
                  h1: ({ children }) => <h1 className="text-xl font-bold mb-3 mt-4">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-lg font-bold mb-2 mt-3">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-md font-bold mb-2 mt-3">{children}</h3>,
                  code: ({ children }) => <code className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>,
                  pre: ({ children }) => <pre className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-3 rounded-lg my-3 overflow-x-auto font-mono text-sm">{children}</pre>,
                  blockquote: ({ children }) => <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-3 italic my-3 text-gray-600 dark:text-gray-400">{children}</blockquote>,
                  table: ({ children }) => <div className="overflow-x-auto my-3"><table className="min-w-full border border-gray-300 dark:border-gray-700">{children}</table></div>,
                  th: ({ children }) => <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 bg-gray-100 dark:bg-gray-700">{children}</th>,
                  td: ({ children }) => <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">{children}</td>,
                }}
              >
                {message.text}
              </ReactMarkdown>
            )}
          </div>
          <div className="text-xs opacity-70 mt-1.5 self-end">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      ))}
      {isLoading && (
        <div className="flex flex-col max-w-[85%] rounded-2xl p-4 mb-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 self-start rounded-bl-none border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="message-content">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1.5">
                <div className="h-2.5 w-2.5 bg-blue-500 rounded-full animate-pulse"></div>
                <div className="h-2.5 w-2.5 bg-blue-500 rounded-full animate-pulse delay-150"></div>
                <div className="h-2.5 w-2.5 bg-blue-500 rounded-full animate-pulse delay-300"></div>
              </div>
              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">Thinking...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessages;