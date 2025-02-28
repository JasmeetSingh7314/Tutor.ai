import React, { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  Send,
  Loader2,
  ChevronDown,
  Settings,
  LogOut,
} from "lucide-react";
import { chat } from "./api/chat";

type Message = {
  id: string;
  text: string;
  sender: "ai" | "user";
  timestamp: Date;
};

type Conversation = {
  id: string;
  title: string;
  timestamp: Date;
};

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([
    { id: "1", title: "Basic Greetings in Korean", timestamp: new Date() },
    { id: "2", title: "Numbers and Counting", timestamp: new Date() },
    { id: "3", title: "Restaurant Vocabulary", timestamp: new Date() },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [toggle, setToggle] = useState<boolean>();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Initial welcome message
    const getMessageResponse = async () => {
      console.log(messages);
      const userMessages = messages.filter(
        (element) => element.sender === "user"
      );
      console.log(userMessages);
      // const reponse=await chat(userMessages[userMessages.length])
    };
    setMessages([
      {
        id: "1",
        text: "안녕하세요! I'm your Korean language tutor. How can I help you today? We can practice conversations, learn new vocabulary, or review grammar concepts.",
        sender: "ai",
        timestamp: new Date(),
      },
    ]);
    getMessageResponse();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setIsThinking(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "좋아요! That's a good attempt! Let me help you improve your pronunciation. Try emphasizing the second syllable a bit more, and remember that Korean consonants are generally less aspirated than their English counterparts.",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsThinking(false);
    }, 1500);
  };

  async function handleOnClick() {
    setToggle(true);
    console.log(toggle);
  }

  return (
    <div className="flex h-screen bg-zinc-950 text-white">
      {/* Sidebar */}
      <div className="w-[300px] bg-zinc-900 flex flex-col">
        {/* New Chat Button */}
        <button
          className="m-3 flex items-center gap-3 rounded-lg border border-zinc-700 px-3 py-2 text-sm hover:bg-zinc-800 transition-colors"
          onClick={() => handleOnClick()}
        >
          <MessageSquare size={16} />
          New conversation
        </button>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto px-3 py-2">
          <div className="text-xs font-medium text-zinc-400 mb-2">
            Recent conversations
          </div>
          {conversations.map((conv) => (
            <button
              key={conv.id}
              className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-zinc-800 transition-colors text-left"
            >
              <MessageSquare size={16} className="text-zinc-400" />
              <span className="truncate">{conv.title}</span>
            </button>
          ))}
        </div>

        {/* User Section */}
        <div className="border-t border-zinc-800 p-3">
          <button className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-zinc-800 transition-colors">
            <div className="flex-1 flex items-center gap-3 truncate">
              <div className="h-7 w-7 rounded-full bg-green-500 flex items-center justify-center text-black font-medium">
                U
              </div>
              <div className="truncate">User Account</div>
            </div>
            <ChevronDown size={16} className="text-zinc-400" />
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-zinc-950">
        {/* Header */}
        <header className="border-b border-zinc-800 p-3 flex items-center justify-between">
          <h1 className="text-lg font-medium">Korean Language Tutor</h1>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
              <Settings size={20} className="text-zinc-400" />
            </button>
            <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
              <LogOut size={20} className="text-zinc-400" />
            </button>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto py-6 px-4">
            {messages.map((message) => (
              <div
                key={message.id}
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
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    message.sender === "user"
                      ? "bg-green-500 text-black"
                      : "bg-zinc-800"
                  }`}
                >
                  {message.text}
                </div>
                {message.sender === "user" && (
                  <div className="h-8 w-8 rounded-full bg-zinc-700 flex items-center justify-center font-medium ml-4">
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
                <div className="bg-zinc-800 rounded-2xl px-4 py-3 flex items-center gap-2">
                  <Loader2 className="animate-spin" size={18} />
                  Thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-zinc-800 p-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-4 items-end">
              <div className="flex-1 bg-zinc-800 rounded-xl overflow-hidden">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Message your Korean tutor..."
                  className="w-full bg-transparent px-4 py-3 focus:outline-none resize-none"
                  rows={1}
                />
              </div>
              <button
                onClick={handleSend}
                className="px-4 py-3 rounded-xl bg-green-500 text-black font-medium hover:bg-green-400 transition-colors flex items-center gap-2"
              >
                <Send size={18} />
              </button>
            </div>
            <div className="mt-2 text-xs text-zinc-400">
              Press Enter to send, Shift + Enter for new line
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
