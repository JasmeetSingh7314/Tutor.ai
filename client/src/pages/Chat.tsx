import { useState, useEffect, useRef } from "react";
import { Message, Conversation } from "../types";
import Sidebar from "../components/chat/Sidebar";
import Header from "../components/chat/Header";
import MessageList from "../components/chat/MessageList";
import MessageInput from "../components/chat/MessageInput";
import { chat } from "../apis/chat/chat";
import { useLocation } from "react-router-dom";
import ChatInput from "@/components/chat/chatSuggestions";

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
    // Initial welcome message
    setMessages([
      {
        id: "1",
        text: ` I'm your ${userState.userData.targetLanguage} language tutor. How can I help you today? We can practice conversations, learn new vocabulary, or review grammar concepts.`,
        sender: "ai",
        timestamp: new Date(),
      },
    ]);
    setMessages((prev) => [...prev, userState.userMessage]);
    setToggle(!toggle);
  }, []);

  useEffect(() => {
    const getMessageResponse = async () => {
      console.log(messages);
      const userMessages = messages.filter(
        (element) => element.sender === "user"
      );
      const aiMessages = messages.filter((element) => element.sender === "ai");
      if (userMessages.length) {
        const usertext = userMessages[userMessages.length - 1].text;
        const agenttext = aiMessages[aiMessages.length - 1].text;
        setIsThinking(true);
        const response = await chat(usertext, agenttext);
        console.log(response);
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
        setIsThinking(false);
      }
    };
    if (toggleRef.current) {
      toggleRef.current = false;
      return;
    } else {
      getMessageResponse();
    }
  }, [toggle]);

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
    <div className="flex h-screen bg-zinc-950 text-white overflow-hidden">
      {/* Sidebar */}
      <Sidebar conversations={conversations} />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-zinc-950 relative">
        {/* Glassmorphism background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-zinc-900/20 pointer-events-none" />
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Content */}
        <div className="relative flex flex-col h-full z-10">
          <Header language={userState} />
          <div className="flex-1 flex flex-col overflow-hidden">
            <MessageList messages={messages} isThinking={isThinking} />
            <ChatInput onSendMessage={handleSendMessage} />
            {/* <MessageInput
              onSendMessage={handleSendMessage}
              data={userState.userData}
            /> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
