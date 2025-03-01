import React, { useState } from "react";
import { Send } from "lucide-react";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  data: any;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, data }) => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    onSendMessage(input);
    setInput("");
  };

  return (
    <div className="border-t border-zinc-800/50 p-4 bg-zinc-900/70 backdrop-blur-md backdrop-filter">
      <div className="max-w-3xl mx-auto">
        <div className="flex gap-4 items-end">
          <div className="flex-1 bg-zinc-800/60 rounded-xl overflow-hidden backdrop-blur-sm">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={`Message your ${data.targetLanguage} tutor...`}
              className="w-full bg-transparent px-4 py-3 focus:outline-none resize-none text-white"
              rows={1}
            />
          </div>
          <button
            onClick={handleSend}
            className="px-4 py-3 rounded-xl bg-green-500/90 text-black font-medium hover:bg-green-400/90 transition-colors flex items-center gap-2 backdrop-blur-sm"
          >
            <Send size={18} />
          </button>
        </div>
        <div className="mt-2 text-xs text-zinc-400">
          Press Enter to send, Shift + Enter for new line
        </div>
      </div>
    </div>
  );
};

export default MessageInput;
