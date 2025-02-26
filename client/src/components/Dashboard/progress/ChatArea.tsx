import { Send } from "lucide-react";
import React from "react";

const ChatArea = () => {
  const messages = [
    {
      id: "1",
      text: "Welcome to your Korean lesson! Tutors ready! Ready to continue where we left off?",
      sender: "ai",
      timestamp: new Date(),
    },
  ];
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
        {/* {isThinking && (
                <div className="flex justify-start">
                  <div className="bg-zinc-800 rounded-2xl px-4 py-3 flex items-center gap-2">
                    <Loader2 className="animate-spin" size={18} />
                    Thinking...
                  </div>
                </div>
              )} */}
      </div>
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 bg-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
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
