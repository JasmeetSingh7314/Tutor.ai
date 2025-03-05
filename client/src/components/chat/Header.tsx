import { Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header = ({ language }: any) => {
  const navigate = useNavigate();
  return (
    <header className=" border-b border-zinc-800/50 p-3   h-fit items-center justify-between bg-[#0C0F0E] backdrop-blur-md backdrop-filter">
      <div></div>
      {/* <h1 className=" flex gap-x-5 items-center text-lg font-medium text-white">
        <span className="text-3xl font-urbanist uppercase tracking-wider ">Tutor </span>
        <span className="text-slate-400">
          [{language?.userData?.targetLanguage}]
        </span>
      </h1> */}
      <div className="flex items-center gap-2">
        <button className="p-2 hover:bg-zinc-800/70 rounded-lg transition-colors">
          <Settings size={20} className="text-zinc-400" />
        </button>
        <button className="p-2 hover:bg-zinc-800/70 rounded-lg transition-colors">
          <LogOut
            size={20}
            className="text-zinc-400"
            onClick={() => navigate("/profile")}
          />
        </button>
      </div>
    </header>
  );
};

export default Header;
