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
    <div className="flex h-80vh relative rounded-lg overflow-hidden shadow-md">
      {/* Menu toggle button for mobile */}
      <button
        className="absolute top-2 left-2 z-10 md:hidden p-2 bg-white rounded-md shadow-sm"
        onClick={toggleMenu}
      >
        {menuOpen ? '✕' : '☰'}
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
      <div className="flex flex-col flex-1">
        {/* Daily Credit component with refresh trigger */}
        <DailyCredit address={address} refreshTrigger={creditRefreshTrigger} />
        {currentChat && (
          <ChatMessages
            messages={currentChat.messages}
            isLoading={isLoading}
          />
        )}
        {/* Technical analysis chart */}
        <div className="p-3 border-t border-gray-200 bg-gray-50">
          <label className="flex items-center justify-between cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 w-full">
            <span className="text-sm font-medium text-gray-700">Show Price Chart of CRO/USD</span>
            <div className="relative">
              <input
                type="checkbox"
                checked={showPriceChart}
                onChange={() => setShowPriceChart(!showPriceChart)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
            </div>
          </label>
          {showPriceChart && (
            <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
              <p className="text-sm text-amber-700 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Note: Some Cronos functions may be limited due to the quantity of data required for the price chart.
              </p>
            </div>
          )}
        </div>
        {showPriceChart && (
            <div className="p-3">
              <TechnicalAnalyst />
            </div>
        )}
        <ChatInput
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          handleSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default ChatInterface;