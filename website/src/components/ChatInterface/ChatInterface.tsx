import React, { useState, useEffect } from 'react';
import { Chat } from './types';
import ChatMenu from './ChatMenu';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import TechnicalAnalyst from '../TechnicalAnalyst/TechnicalAnalyst';
import DailyCredit from '../DailyCredit/DailyCredit';
import { useSignMessage } from 'wagmi';
import {
  addUserMessageToChat,
  addBotMessageToChat,
  processUserMessage,
  saveChatsToLocalStorage,
  loadChatsFromLocalStorage,
  saveActiveChatToLocalStorage,
  loadActiveChatFromLocalStorage
} from '../../services/chatService';

const ChatInterface: React.FC<{ address: `0x${string}` }> = ({ address }) => {
  const { signMessage, data: signature, isSuccess, isError, reset } = useSignMessage();
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<string>('');
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(true);
  const [showPriceChart, setShowPriceChart] = useState(false);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);
  const [creditRefreshTrigger, setCreditRefreshTrigger] = useState(0);

  // Initialize chats from localStorage or create default chat
  useEffect(() => {
    const savedChats = loadChatsFromLocalStorage();
    const savedActiveChat = loadActiveChatFromLocalStorage();

    if (savedChats && savedChats.length > 0) {
      setChats(savedChats);

      // Set active chat from localStorage or use the first chat
      if (savedActiveChat && savedChats.some(chat => chat.id === savedActiveChat)) {
        setActiveChat(savedActiveChat);
      } else {
        setActiveChat(savedChats[0].id);
      }
    } else {
      // Create default chat if no saved chats
      const defaultChat: Chat = {
        id: '1',
        title: 'First Chat',
        messages: [
          { id: '1', text: 'Hello! How can I help you today?', sender: 'bot', timestamp: new Date() }
        ],
        lastUpdated: new Date()
      };
      setChats([defaultChat]);
      setActiveChat(defaultChat.id);
    }
  }, []);

  // Save chats to localStorage whenever they change
  useEffect(() => {
    if (chats.length > 0) {
      saveChatsToLocalStorage(chats);
    }
  }, [chats]);

  // Save active chat to localStorage whenever it changes
  useEffect(() => {
    if (activeChat) {
      saveActiveChatToLocalStorage(activeChat);
    }
  }, [activeChat]);

  const currentChat = chats.find(chat => chat.id === activeChat) || (chats.length > 0 ? chats[0] : null);
  // Effect to handle signature success
  useEffect(() => {
    const processPendingMessage = async () => {
      if (isSuccess && pendingMessage && signature && address) {
        try {
          // Get the AI response
          const response = await processUserMessage(pendingMessage, address, signature, showPriceChart);

          // Add bot response to chat
          setChats(prevChats => {
            const updatedChats = addBotMessageToChat(prevChats, activeChat, response);
            return updatedChats;
          });

          // Refresh credit info after getting a response
          setCreditRefreshTrigger(prev => prev + 1);
        } catch (error) {
          console.error('Error getting response from AI:', error);

          // Add error message to chat
          setChats(prevChats =>
            addBotMessageToChat(
              prevChats,
              activeChat,
              "Sorry, there was an error processing your request. Please try again."
            )
          );
        } finally {
          setIsLoading(false);
          setPendingMessage(null);
          reset(); // Reset the signature state for future requests
        }
      }
    };

    processPendingMessage();
  }, [isSuccess, pendingMessage, signature, activeChat, address, reset, showPriceChart]);

  // Handle errors in signature process
  useEffect(() => {
    if (isError) {
      setIsLoading(false);
      setPendingMessage(null);
      reset();

      // Add error message to chat
      setChats(prevChats =>
        addBotMessageToChat(
          prevChats,
          activeChat,
          "Authentication failed. Please try again."
        )
      );
    }
  }, [isError, activeChat, reset]);

  const handleSendMessage = () => {
    if (!inputMessage.trim() || isLoading) return;

    setIsLoading(true);
    setPendingMessage(inputMessage);

    // Add user message to chat
    const { updatedChats } = addUserMessageToChat(chats, activeChat, inputMessage);
    setChats(updatedChats);
    setInputMessage('');
    const message = `I confirm that I own the wallet address ${address}.`;

    // Request signature
    signMessage({ message });

    // Increment the refresh trigger to update credit info
    setCreditRefreshTrigger(prev => prev + 1);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: `New Chat ${chats.length + 1}`,
      messages: [
        { id: '1', text: 'Hello! How can I help you today?', sender: 'bot', timestamp: new Date() }
      ],
      lastUpdated: new Date()
    };

    setChats(prev => [...prev, newChat]);
    setActiveChat(newChat.id);
  };

  const deleteChat = (chatId: string, event: React.MouseEvent) => {
    // Stop the click event from bubbling up to parent elements
    event.stopPropagation();

    // Filter out the chat to be deleted
    const updatedChats = chats.filter(chat => chat.id !== chatId);

    // If there are no chats left, create a new one
    if (updatedChats.length === 0) {
      const newChat: Chat = {
        id: Date.now().toString(),
        title: 'New Chat',
        messages: [
          { id: '1', text: 'Hello! How can I help you today?', sender: 'bot', timestamp: new Date() }
        ],
        lastUpdated: new Date()
      };
      setChats([newChat]);
      setActiveChat(newChat.id);
    } else {
      // If the active chat is being deleted, set the first chat as active
      if (chatId === activeChat) {
        setActiveChat(updatedChats[0].id);
      }
      setChats(updatedChats);
    }
  };

  return (
    <div className="flex w-full h-[calc(100vh-180px)] relative rounded-lg overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      {/* Menu toggle button for mobile */}
      <button
        className="absolute top-3 left-3 z-20 md:hidden p-2 bg-white dark:bg-gray-700 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
        onClick={toggleMenu}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
      >
        {menuOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Left menu */}
      <ChatMenu
        chats={chats}
        activeChat={activeChat}
        setActiveChat={setActiveChat}
        createNewChat={createNewChat}
        deleteChat={deleteChat}
        menuOpen={menuOpen}
      />

      {/* Chat area */}
      <div className="flex flex-col flex-1 bg-gray-50 dark:bg-gray-900">
        {/* Daily Credit component with refresh trigger */}
     

        {currentChat && (
          <ChatMessages
            messages={currentChat.messages}
            isLoading={isLoading}
          />
        )}

        {/* Technical analysis chart toggle */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <label className="flex items-center justify-between cursor-pointer p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 w-full">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Show Price Chart of CRO/USD</span>
            <div className="relative">
              <input
                type="checkbox"
                checked={showPriceChart}
                onChange={() => setShowPriceChart(!showPriceChart)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
            </div>
          </label>

          {showPriceChart && <TechnicalAnalyst />}
        </div>

        {/* Input area */}
        <ChatInput
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          handleSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
           <DailyCredit address={address} refreshTrigger={creditRefreshTrigger} />
      </div>
    </div>
  );
};

export default ChatInterface;