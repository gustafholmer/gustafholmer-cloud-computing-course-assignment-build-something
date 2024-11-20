import { saveMessage, getUserIdByUsername } from './memoryService';

export const generateBotResponse = async (username: string, userMessage: string) => {
  const userId = await getUserIdByUsername(username);

  let botMessage;
  if (userMessage.toLowerCase().includes('hello')) {
    botMessage = "Hello! How can I assist you today?";
  } else if (userMessage.toLowerCase().includes('bye')) {
    botMessage = "Goodbye! Have a great day!";
  } else {
    botMessage = "I am here to help you. Ask me anything!";
  }

  await saveMessage(userId, userMessage, 'user');
  await saveMessage(userId, botMessage, 'bot');

  return botMessage;
};
