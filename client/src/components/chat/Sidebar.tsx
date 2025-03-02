import React from "react";
import { MessageSquare, ChevronDown } from "lucide-react";

type Conversation = {
  id: string;
  title: string;
  timestamp: Date;
};

interface SidebarProps {
  conversations: Conversation[];
  user: any;
}
// zinc - 900 / 80;
const Sidebar: React.FC<SidebarProps> = ({ conversations, user }) => {
  return (
    <div className="w-[300px] bg-trasnparent backdrop-blur-md backdrop-filter flex flex-col border-r border-zinc-800/50">
      {/* New Chat Button */}
      <button className="m-3 flex items-center gap-3 rounded-lg border border-zinc-700/70 px-3 py-2 text-sm text-white hover:bg-zinc-800/70 transition-colors">
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
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-white hover:bg-zinc-800/70 transition-colors text-left"
          >
            <MessageSquare size={16} className="text-zinc-400" />
            <span className="truncate">{conv.title}</span>
          </button>
        ))}
      </div>

      {/* User Section */}
      <div className="border-t border-zinc-800/50 p-3">
        <button className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-white hover:bg-zinc-800/70 transition-colors">
          <div className="flex-1 flex items-center gap-3 truncate">
            <div className="h-7 w-7 rounded-full bg-green-500 flex items-center justify-center text-black font-medium">
              {user.fullName[0]}
            </div>
            <div className="truncate ml-4">{user.fullName}</div>
          </div>
          <ChevronDown size={16} className="text-zinc-400" />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
