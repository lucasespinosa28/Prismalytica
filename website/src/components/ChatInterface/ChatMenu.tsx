import React from 'react';
import { Chat } from './types';

interface ChatMenuProps {
  chats: Chat[];
  activeChat: string;
  setActiveChat: (id: string) => void;
  createNewChat: () => void;
  deleteChat: (chatId: string, event: React.MouseEvent) => void;
  menuOpen: boolean;
}

const ChatMenu: React.FC<ChatMenuProps> = ({
  chats,
  activeChat,
  setActiveChat,
  createNewChat,
  deleteChat,
  menuOpen
}) => {
  const getChatPreview = (chat: Chat) => {
    const lastMessage = chat.messages[chat.messages.length - 1];
    return lastMessage 
      ? lastMessage.text.substring(0, 30) + (lastMessage.text.length > 30 ? '...' : '') 
      : '';
  };

  return (
    <div className={`w-[280px] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-transform duration-300 ease-in-out
      ${menuOpen ? 'translate-x-0' : '-translate-x-full'} 
      md:translate-x-0 md:static absolute top-0 left-0 bottom-0 z-10 shadow-md`}>

      <button 
        className="flex items-center justify-center py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors m-3 rounded-lg shadow-sm"
        onClick={createNewChat}
      >
        <span className="mr-2 text-lg">+</span> New Chat
      </button>

      <div className="flex-1 overflow-y-auto">
        {chats.map(chat => (
          <div 
            key={chat.id} 
            className={`p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer relative hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors
              ${activeChat === chat.id ? 'bg-blue-50 dark:bg-gray-700 border-l-4 border-l-blue-500' : ''}`}
            onClick={() => setActiveChat(chat.id)}
          >
            <div className="font-medium text-gray-800 dark:text-gray-200">{chat.title}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1 pr-8 line-clamp-2">{getChatPreview(chat)}</div>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              {chat.lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <button 
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 dark:hover:text-red-400 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              onClick={(e) => deleteChat(chat.id, e)}
              title="Delete chat"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatMenu;