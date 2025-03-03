import { useState, useEffect, useRef } from "react";
import { Message, Conversation } from "../types";
import Sidebar from "../components/chat/Sidebar";
import Header from "../components/chat/Header";
import MessageList from "../components/chat/MessageList";
import { chat } from "../apis/chat/chat";
import { useLocation } from "react-router-dom";
import ChatInput from "@/components/chat/chatSuggestions";
import { updateMessage } from "@/apis/chat/updateMessages";
import { getMessages } from "@/apis/chat/getMessages";

function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [result, setResult] = useState();

  const [toggle, setToggle] = useState<boolean>();
  const userState = useLocation().state;

  const toggleRef = useRef(true);

  // useEffect(() => {
  //   const saveConversation = async () => {
  //     console.log("Save convo triggered");
  //     const userId = userState.userData._id;
  //     const conversationData = {
  //       messages: messages.map((msg) => ({
  //         sender: msg.sender,
  //         text: msg.text,
  //         timestamp: msg.timestamp,
  //       })),
  //     };
  //     console.log(conversationData);

  //     try {
  //       const result1 = await updateMessage(userId, conversationData.messages);
  //       console.log(result1);
  //     } catch (error) {
  //       // console.error("Failed to save conversation:", error);
  //     }
  //   };

  //   if (messages.length > 0) {
  //     saveConversation();
  //   }
  // }, [toggle]);

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

    const conversation = async () => {
      try {
        const userId = userState.userData._id;
        const getConvo = await getMessages(userId);
        console.log(getConvo);

        setConversations(getConvo.data);
      } catch (err) {
        console.log(err);
      }
    };
    conversation();
    setToggle(!toggle);
  }, [userState]);

  // Handle AI responses
  useEffect(() => {
    const getMessageResponse = async () => {
      console.log("message requested!");
      const userMessages = messages.filter((msg) => msg.sender === "user");
      const userId = userState.userData._id;

      if (userMessages.length) {
        const userText = userMessages[userMessages.length - 1].text;
        console.log("User messages:", userMessages);
        //Thinking action set to true
        setIsThinking(true);
        
        //fetching response from the agent
        const response = await chat(userText, userId);
        console.log("Chat data", response);
        const aiMessage = {
          id: messages.length.toString(),
          text: response.message,
          sender: "ai",
          timestamp: new Date(),
          wordDetails: response?.data,
        };
        //saving the message
        const saveMessage = await updateMessage(userId, aiMessage);
        console.log("Message from agent:", saveMessage);
        //refreshing the conservation state
        try {
          const userId = userState.userData._id;
          const getConvo = await getMessages(userId);
          console.log(getConvo);

          setConversations(getConvo.data);
        } catch (err) {
          console.log(err);
        }
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
        //setting thinking to false
        setIsThinking(false);
      }
    };

    if (toggleRef.current) {
      toggleRef.current = false;
    } else {
      getMessageResponse();
    }
  }, [toggle]);

  // Handle user sending a message
  const handleSendMessage = async (text: string) => {
    setToggle(!toggle);
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: "user",
      timestamp: new Date(),
    };
    try {
      const userId = userState.userData._id;
      const saveMessage = await updateMessage(userId, newMessage);

      console.log("user message saved:", saveMessage);
    } catch (error) {
      console.error(error);
    }
    try {
      const userId = userState.userData._id;
      const getConvo = await getMessages(userId);
      console.log(getConvo);

      setConversations(getConvo.data);
    } catch (err) {
      console.log(err);
    }
    setMessages((prev) => [...prev, newMessage]);
    setIsThinking(true);
  };

  return (
    <div className="flex h-screen bg-zinc-950 text-white overflow-hidden font-nunito">
      {/* Sidebar */}
      {/* <Sidebar conversations={conversations} user={userState.userData} /> */}

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
            <MessageList messages={conversations} isThinking={isThinking} />
            <ChatInput onSendMessage={handleSendMessage} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
