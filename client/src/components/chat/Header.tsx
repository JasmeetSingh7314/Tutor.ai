import { Settings, LogOut } from "lucide-react";

const Header = ({ language }: any) => {
  console.log(language);
  return (
    <header className="border-b border-zinc-800/50 p-3 flex items-center justify-between bg-zinc-900/70 backdrop-blur-md backdrop-filter">
      <h1 className="text-lg font-medium text-white">
        {language?.userData?.targetLanguage} Language Tutor
      </h1>
      <div className="flex items-center gap-2">
        <button className="p-2 hover:bg-zinc-800/70 rounded-lg transition-colors">
          <Settings size={20} className="text-zinc-400" />
        </button>
        <button className="p-2 hover:bg-zinc-800/70 rounded-lg transition-colors">
          <LogOut size={20} className="text-zinc-400" />
        </button>
      </div>
    </header>
  );
};

export default Header;
