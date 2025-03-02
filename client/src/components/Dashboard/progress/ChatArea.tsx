import { Send } from "lucide-react";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ChatArea = (data: any) => {
  const navigate = useNavigate();
  const [input, setInput] = useState("");

  const messages = [
    {
      id: "1",
      text: `Welcome to your ${data?.data?.targetLanguage} lesson! Tutors ready! Ready to continue where we left off?`,
      sender: "ai",
      timestamp: new Date(),
    },
  ];

  const handleOnSend = () => {
    const newMessage = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setInput("");
    navigate("/chat", {
      state: {
        userData: data?.data,
        userMessage: newMessage,
      },
    });
  };
  return (
    <div className="  backdrop-blur-sm rounded-2xl p-6 mb-6 font-nunito">
      <div className="space-y-6 mb-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex  ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.sender === "user"
                  ? "bg-green-500 text-black"
                  : "bg-zinc-800"
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 bg-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleOnSend();
            }
          }}
        />
        <button className="px-4 py-2 rounded-xl bg-green-500 text-black font-medium hover:bg-green-400 transition-colors flex items-center gap-2">
          <Send size={18} />
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatArea;
