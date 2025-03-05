"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import {
  Send,
  BookOpen,
  GraduationCap,
  HelpCircle,
  MessageSquare,
  Lightbulb,
  Clock,
  Pencil,
} from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

const commonPrompts = [
  {
    text: "What's my lesson for today?",
    icon: <BookOpen className="w-4 h-4" />,
  },
  { text: "Test me!", icon: <GraduationCap className="w-4 h-4" /> },
  { text: "How do I say...?", icon: <HelpCircle className="w-4 h-4" /> },
  {
    text: "Practice conversation",
    icon: <MessageSquare className="w-4 h-4" />,
  },
  {
    text: "Explain this grammar point",
    icon: <Lightbulb className="w-4 h-4" />,
  },
  { text: "Review previous lessons", icon: <Clock className="w-4 h-4" /> },
  { text: "Writing practice", icon: <Pencil className="w-4 h-4" /> },
];

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSend = async () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handlePromptClick = (prompt: string) => {
    onSendMessage(prompt);
    setMessage("");
    setIsFocused(false);
    inputRef.current?.blur();
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto mb-4 px-4">
      {/* Suggestions dropdown (appears above the input) */}
      {isFocused && (
        <div
          ref={dropdownRef}
          className="absolute bottom-full mb-2 w-full rounded-xl backdrop-blur-md bg-zinc-800/60 border border-white/10 shadow-lg overflow-hidden transition-all duration-300 ease-in-out"
        >
          <div className="p-2 max-h-64 overflow-y-auto">
            {commonPrompts.map((prompt, index) => (
              <div
                key={index}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 cursor-pointer transition-colors duration-200"
                onClick={() => handlePromptClick(prompt.text)}
              >
                <div className="text-green-400">{prompt.icon}</div>
                <span className="text-white/90">{prompt.text}</span>
              </div>
            ))}
          </div>
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-4 h-4 rotate-45 bg-zinc-800/60 border-r border-b border-white/10"></div>
        </div>
      )}

      {/* Input field */}
      <div className="relative flex items-center w-full">
        <input
          ref={inputRef}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          placeholder="Message your language tutor..."
          className="w-full py-3 px-4 pr-12 bg-zinc-800/80 backdrop-blur-md text-white rounded-full border border-white/10 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
        />
        <button
          onClick={handleSend}
          className="absolute right-3 p-2 text-green-400 hover:text-green-300 transition-colors"
          disabled={!message.trim()}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>

    </div>
  );
};

// const CustomScrollbarStyles = () => (
//   <style jsx global>{`
//     .custom-scrollbar::-webkit-scrollbar {
//       width: 6px;
//     }
//     .custom-scrollbar::-webkit-scrollbar-track {
//       background: rgba(255, 255, 255, 0.1);
//       border-radius: 10px;
//     }
//     .custom-scrollbar::-webkit-scrollbar-thumb {
//       background: rgba(255, 255, 255, 0.2);
//       border-radius: 10px;
//       transition: background 0.2s ease;
//     }
//     .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//       background: rgba(255, 255, 255, 0.3);
//     }
//   `}</style>
// );
export default ChatInput;
