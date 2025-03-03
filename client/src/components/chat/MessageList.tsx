import React, { useRef, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import LangCard from "./LangCard";

type Message = {
  id: string;
  text: string;
  sender: "ai" | "user";
  timestamp: Date;
  wordDetails: any;
};

interface MessageListProps {
  messages: Message[];
  isThinking: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isThinking }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [shouldScroll, setShouldScroll] = useState(true);

  console.log("Messages are:", messages);
  const scrollToBottom = () => {
    if (shouldScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    // Only auto-scroll when new messages arrive
    const lastMessage = messages[messages.length - 1];
    setShouldScroll(
      lastMessage?.sender === "user" ||
        lastMessage?.sender === "ai" ||
        isThinking
    );
  }, [messages, isThinking]);

  // Handle scroll events to determine if user has scrolled up
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    // If user scrolls up more than 100px from bottom, disable auto-scroll
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShouldScroll(isNearBottom);
  };
 

   // Scroll to the bottom when messages change
   useEffect(() => {
     if (messagesEndRef.current) {
       messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
     }
   }, [messages]);
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto py-6 px-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-6 flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {message.sender === "ai" && (
              <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-black font-medium mr-4">
                T
              </div>
            )}
            <div
              className={`max-w-[50%] rounded-2xl px-4 py-3 ${
                message.sender === "user"
                  ? "bg-green-500/90 text-black backdrop-blur-sm"
                  : "bg-zinc-800/80 w-96 text-white backdrop-blur-sm"
              }`}
            >
              <ReactMarkdown>{message.text}</ReactMarkdown>
              {message.sender === "ai" && message.wordDetails && (
                <LangCard
                  wordDetails={message?.wordDetails?.vocab[0]?.word_details}
                  words={message?.wordDetails}
                />
              )}
            </div>
            {message.sender === "user" && (
              <div className="h-8 w-8 rounded-full bg-zinc-700 flex items-center justify-center font-medium text-white ml-4">
                U
              </div>
            )}
          </div>
        ))}
        {isThinking && (
          <div className="flex items-center mb-6">
            <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-black font-medium mr-4">
              T
            </div>
            <div className="bg-zinc-800/80 rounded-2xl px-4 py-3 flex items-center gap-2 text-white backdrop-blur-sm">
              <Loader2 className="animate-spin" size={18} />
              Thinking...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageList;
