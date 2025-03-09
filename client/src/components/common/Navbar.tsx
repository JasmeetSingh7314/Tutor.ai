import { useEffect, useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X } from "lucide-react";
import { ConnectWallet } from "../connectWallet";
import logo from "../../assets/text.png";
export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [user, setUser] = useState<boolean>();
  const { scrollY } = useScroll();

  useEffect(() => {
    const wallet = localStorage.getItem("walletAddress");
    wallet === null ? setUser(false) : setUser(true);
  });

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  const navItems = [
    { name: "profile", href: "/profile" },
    { name: "chat", href: "/chat" },
  ];

  return (
    <motion.nav
      variants={{
        visible: { y: 0 },
        hidden: { y: -100 },
      }}
      className="  fixed p-8 top-0 left-0 right-0 z-50 bg-gray-200/5 border-[#959595] border-opacity-20 backdrop-blur-lg border-b border-white/10 py-3"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a
              href="/"
              className="text-[#22B357] text-4xl font-semibold  font-urbanist"
            >
              <img src={logo} className="h-24" alt="logo" />
            </a>
          </div>

          <div className="hidden md:block">
            {user ? (
              <div className="ml-10 flex items-center space-x-8 font-nunito font-semibold">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-gray-300 font-semibold font-nunito hover:text-[#22B357] active:text-[#22B357]  transition-colors"
                  >
                    {item.name}
                  </a>
                ))}
                <ConnectWallet />
              </div>
            ) : (
              <ConnectWallet />
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white"
              >
                {item.name}
              </a>
            ))}
            <ConnectWallet />
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};
