import { updateMessage } from "@/apis/chat/updateMessages";
import { Send } from "lucide-react";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Typewriter from "typewriter-effect";
const ChatArea = (data: any) => {
  const navigate = useNavigate();
  const [input, setInput] = useState("");

  const messages = [
    {
      id: "1",
      text: `Welcome to your ${data?.data?.targetLanguage} lesson! Tutors ready! Ready to continue where we left off? 🚀`,
      sender: "ai",
      timestamp: new Date(),
    },
  ];

  const handleOnSend = async () => {
    const newMessage = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };
    try {
      const saveMessage = await updateMessage(data?.data._id, newMessage);
      console.log(saveMessage);
    } catch (err) {
      console.log(err);
    }

    setInput("");
    navigate("/chat", {
      state: {
        userData: data?.data,
        userMessage: newMessage,
      },
    });
  };
  const handleClick = () => {
    navigate("/chat");
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
              className={`max-w-[80%] rounded-2xl px-4 py-3 font-semibold tracking-wide ${
                message.sender === "user"
                  ? "bg-green-500 text-black"
                  : "bg-zinc-800"
              }`}
            >
              <Typewriter
                options={{
                  strings: [message.text],
                  autoStart: true,
                  delay: 4,
                  deleteSpeed: 555555555555555555555555555555555555555555555555,
                }}
              ></Typewriter>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Press enter to chat...or click on the button to the right"
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
        <button
          className="px-4 py-2 rounded-xl bg-green-500 text-black font-medium hover:bg-green-400 transition-colors flex items-center gap-2"
          onClick={() => {
            handleClick();
          }}
        >
          <Send size={18} />
          Chat
        </button>
      </div>
    </div>
  );
};

export default ChatArea;
