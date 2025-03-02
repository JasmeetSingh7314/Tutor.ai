import { useState, useEffect, useRef } from "react";
import { Message, Conversation } from "../types";
import Sidebar from "../components/chat/Sidebar";
import Header from "../components/chat/Header";
import MessageList from "../components/chat/MessageList";
import { chat } from "../apis/chat/chat";
import { useLocation } from "react-router-dom";
import ChatInput from "@/components/chat/chatSuggestions";
import { updateMessage } from "@/apis/chat/updateMessages";

function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([
    { id: "1", title: "Basic Greetings in Korean", timestamp: new Date() },
    { id: "2", title: "Numbers and Counting", timestamp: new Date() },
    { id: "3", title: "Restaurant Vocabulary", timestamp: new Date() },
  ]);
  const [result, setResult] = useState();

  const [toggle, setToggle] = useState<boolean>();
  const userState = useLocation().state;

  const toggleRef = useRef(true);

  useEffect(() => {
    const saveConversation = async () => {
      const userId = userState.userData._id;
      const conversationData = {
        name: "chat",
        messages: messages.map((msg) => ({
          sender: msg.sender,
          text: msg.text,
          timestamp: msg.timestamp,
        })),
      };

      try {
        const result = await updateMessage(
          userId,
          conversationData.name,
          conversationData.messages
        );
        console.log("Real-time save:", result);
      } catch (error) {
        console.error("Failed to save conversation:", error);
      }
    };

    if (messages.length > 0) {
      saveConversation();
    }
  }, [messages]);

  // Initial welcome message
  useEffect(() => {
    setMessages([
      {
        id: "1",
        text: `I'm your ${userState.userData.targetLanguage} language tutor. How can I help you today? We can practice conversations, learn new vocabulary, or review grammar concepts.`,
        sender: "ai",
        timestamp: new Date(),
      },
    ]);
    if (userState.userMessage) {
      setMessages((prev) => [...prev, userState.userMessage]);
    }
    setToggle(!toggle);
  }, [userState]);

  // Handle AI responses
  useEffect(() => {
    const getMessageResponse = async () => {
      const userMessages = messages.filter((msg) => msg.sender === "user");
      const userId = userState.userData._id;

      if (userMessages.length) {
        const userText = userMessages[userMessages.length - 1].text;
        setIsThinking(true);
        const response = await chat(usertext, userId);
        console.log("Chat data", response);
        setMessages((prev) => [
          ...prev,
          {
            id: messages.length.toString(),
            text: response.message,
            sender: "ai",
            timestamp: new Date(),
            wordDetails: response?.data,
          },
        ]);

        setResult(response.data);
        setIsThinking(false);

        try {
          const response = await chat(userText, userId);
          setMessages((prev) => [
            ...prev,
            {
              id: messages.length.toString(),
              text: response.message,
              sender: "ai",
              timestamp: new Date(),
              wordDetails: response?.data?.vocab,
            },
          ]);
          setResult(response.data);
        } catch (error) {
          console.error("Error fetching AI response:", error);
        } finally {
          setIsThinking(false);
        }
      }
    };

    if (toggleRef.current) {
      toggleRef.current = false;
    } else {
      getMessageResponse();
    }
  }, [toggle]);

  // Handle user sending a message
  const handleSendMessage = (text: string) => {
    setToggle(!toggle);
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
    setIsThinking(true);
  };

  return (
    <div className="flex h-screen bg-zinc-950 text-white overflow-hidden font-nunito">
      {/* Sidebar */}
      <Sidebar conversations={conversations} user={userState.userData} />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-zinc-950 relative">
        {/* Glassmorphism background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-zinc-900/20 pointer-events-none" />
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Content */}
        <div className="relative flex flex-col h-full z-10">
          <Header language={userState?.userData} />
          <div className="flex-1 flex flex-col overflow-hidden">
            <MessageList messages={messages} isThinking={isThinking} />
            <ChatInput onSendMessage={handleSendMessage} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
