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
    <div className={`w-[280px] bg-gray-100 border-r border-gray-300 flex flex-col transition-transform duration-300 ease-in-out
      ${menuOpen ? 'translate-x-0' : '-translate-x-full'} 
      md:translate-x-0 md:static absolute top-0 left-0 bottom-0 z-10`}>

      <button 
        className="flex items-center justify-center py-3 px-4 bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors"
        onClick={createNewChat}
      >
        <span className="mr-2 text-lg">+</span> New Chat
      </button>

      <div className="flex-1 overflow-y-auto">
        {chats.map(chat => (
          <div 
            key={chat.id} 
            className={`p-3 border-b border-gray-200 cursor-pointer relative hover:bg-gray-200 transition-colors
              ${activeChat === chat.id ? 'bg-gray-200' : ''}`}
            onClick={() => setActiveChat(chat.id)}
          >
            <div className="font-medium text-gray-800">{chat.title}</div>
            <div className="text-sm text-gray-600 mt-1 pr-8">{getChatPreview(chat)}</div>
            <div className="text-xs text-gray-500 mt-1">
              {chat.lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <button 
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500 p-1 rounded transition-colors"
              onClick={(e) => deleteChat(chat.id, e)}
              title="Delete chat"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatMenu;