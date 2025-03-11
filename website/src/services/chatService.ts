/* eslint-disable @typescript-eslint/no-explicit-any */
import { handleUserQuery } from './apiService';
import { Chat, Message } from '../components/ChatInterface/types';

/**
 * Saves chats to localStorage
 */
export const saveChatsToLocalStorage = (chats: Chat[]): void => {
  try {
    localStorage.setItem('chats', JSON.stringify(chats));
  } catch (error) {
    console.error('Error saving chats to localStorage:', error);
  }
};

/**
 * Loads chats from localStorage
 */
/**
 * Loads chats from localStorage
 */
export const loadChatsFromLocalStorage = (): Chat[] | null => {
  try {
    const savedChats = localStorage.getItem('chats');
    if (savedChats) {
      const parsedChats = JSON.parse(savedChats);

      // Check if parsedChats is an array before mapping
      if (Array.isArray(parsedChats)) {
        // Convert string dates back to Date objects
        return parsedChats.map((chat: any) => ({
          ...chat,
          lastUpdated: new Date(chat.lastUpdated),
          messages: Array.isArray(chat.messages) ? chat.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          })) : []
        }));
      }
    }
    return null;
  } catch (error) {
    console.error('Error loading chats from localStorage:', error);
    return null;
  }
};

/**
 * Saves active chat ID to localStorage
 */
export const saveActiveChatToLocalStorage = (chatId: string): void => {
  try {
    localStorage.setItem('activeChat', chatId);
  } catch (error) {
    console.error('Error saving active chat to localStorage:', error);
  }
};

/**
 * Loads active chat ID from localStorage
 */
export const loadActiveChatFromLocalStorage = (): string | null => {
  try {
    return localStorage.getItem('activeChat');
  } catch (error) {
    console.error('Error loading active chat from localStorage:', error);
    return null;
  }
};

/**
 * Adds a user message to the chat and updates the chat title if needed
 */
export const addUserMessageToChat = (
  chats: Chat[],
  activeChat: string,
  message: string
): {
  updatedChats: Chat[];
  userMessage: Message;
} => {
  const trimmedMessage = message.trim();

  // Create user message
  const userMessage: Message = {
    id: Date.now().toString(),
    text: trimmedMessage,
    sender: 'user',
    timestamp: new Date()
  };

  // Update the current chat with the new message
  const updatedChats = chats.map(chat => {
    if (chat.id === activeChat) {
      // If this is the first user message, update the chat title
      let title = chat.title;
      if (chat.messages.length === 1 && chat.messages[0].sender === 'bot') {
        // Use the first few words of the message as the title
        title = trimmedMessage.split(' ').slice(0, 3).join(' ') + '...';
      }

      return {
        ...chat,
        messages: [...chat.messages, userMessage],
        title,
        lastUpdated: new Date()
      };
    }
    return chat;
  });

  return { updatedChats, userMessage };
};

/**
 * Adds a bot message to the chat
 */
export const addBotMessageToChat = (
  chats: Chat[],
  activeChat: string,
  message: string
): Chat[] => {
  const botMessage: Message = {
    id: Date.now().toString(),
    text: message,
    sender: 'bot',
    timestamp: new Date()
  };

  return chats.map(chat => {
    if (chat.id === activeChat) {
      return {
        ...chat,
        messages: [...chat.messages, botMessage],
        lastUpdated: new Date()
      };
    }
    return chat;
  });
};

/**
 * Processes a user message and gets AI response
 * @param message The user's message
 * @param address The user's wallet address
 * @param signature The signature verifying wallet ownership
 * @param showPriceChart Whether to include price chart analysis
 * @returns The AI response message
 */
export const processUserMessage = async (
  message: string,
  address: `0x${string}`,
  signature: string,
  showPriceChart: boolean
): Promise<string> => {
  try {
    const data = await handleUserQuery(message, address, signature, showPriceChart);
    return data.message || "Sorry, I couldn't process your request.";
  } catch (error) {
    console.error('Error getting response from AI:', error);
    throw error;
  }
};