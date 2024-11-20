import React, { useState } from "react";
import axios from "axios";

interface Message {
  sender: "user" | "bot";
  text: string;
  timestamp?: string;
}

interface BackendMessage {
  text: string;
  sender: "user" | "bot";
  timestamp: string;
}

const Chat: React.FC = () => {
  const [username, setUsername] = useState("");
  const [isUsernameSet, setIsUsernameSet] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const apiBaseURL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:30081";

  const fetchLatestConversation = async () => {
    try {
      const response = await axios.post(`${apiBaseURL}/api/startChat`, {
        username,
      });
      const formattedMessages = response.data.history.map(
        (msg: BackendMessage) => ({
          text: msg.text,
          sender: msg.sender,
          timestamp: msg.timestamp,
        })
      );
      setMessages(formattedMessages);
    } catch (error) {
      console.error("Error fetching conversation history:", error);
    }
  };

  const handleSetUsername = () => {
    if (username.trim()) {
      setIsUsernameSet(true);
      fetchLatestConversation();
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      sender: "user",
      text: input,
      timestamp: new Date().toISOString(),
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");

    try {
      const response = await axios.post(`${apiBaseURL}/api/sendMessage`, {
        username,
        message: input,
      });
      const botMessage: Message = {
        sender: "bot",
        text: response.data.reply,
        timestamp: new Date().toISOString(),
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: "Sorry, I'm having trouble right now." },
      ]);
    }
  };

  const formatTimestamp = (timestamp?: string) => {
    if (!timestamp) {
      return "----------, --:--:--";
    }
    return new Date(timestamp).toLocaleString();
  };

  if (!isUsernameSet) {
    return (
      <div className="flex flex-col items-center justify-center h-32 p-5 text-center">
        <h2 className="text-xl font-semibold mb-4">
          Enter your username to start chatting
        </h2>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="border rounded-full px-3 py-2 mb-3 w-full max-w-xs"
        />
        <button
          onClick={handleSetUsername}
          className="bg-blue-500 text-white rounded-full px-4 py-2"
        >
          Start Chat
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-96 min-h-96 border rounded-lg p-4 bg-gray-100">
      <div className="flex-1  mb-2 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex flex-col ${
              message.sender === "user" ? "items-end" : "items-start"
            }`}
          >
            <span
              className={`inline-block px-3 py-2 rounded-lg max-w-xs ${
                message.sender === "user" ? "bg-green-200" : "bg-white"
              }`}
            >
              {message.text}
            </span>
            <span
              className={`text-xs text-gray-500 mt-1 ${
                message.sender === "user" ? "self-end" : "self-start"
              }`}
            >
              {formatTimestamp(message.timestamp)}
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 rounded-full border"
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white rounded-full px-4 py-2"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
