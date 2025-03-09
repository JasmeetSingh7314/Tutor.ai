import type React from "react";
import { toast, ToastContainer, cssTransition, Bounce } from "react-toastify";
import {
  Trophy,
  Star,
  AlertCircle,
  Info,
  CheckCircle2,
  XCircle,
  Sparkles,
  Zap,
  Flame,
} from "lucide-react";

// Custom animation for toasts
const gamePopIn = cssTransition({
  enter: "game-toast-enter",
  exit: "game-toast-exit",
  duration: 800,
});

// Toast types
export type ToastType =
  | "achievement"
  | "levelUp"
  | "success"
  | "error"
  | "info"
  | "warning"
  | "combo"
  | "powerUp"
  | "streak";

interface ToastOptions {
  message: string;
  description?: string;
  points?: number;
}

// Custom toast component
const GameToast: React.FC<{ type: ToastType } & ToastOptions> = ({
  type,
  message,
  description,
  points,
}) => {
  // Define icon and colors based on type
  const config = {
    achievement: {
      icon: <Trophy className="w-6 h-6" />,
      bgColor: "from-zinc-800 to-zinc-900",
      accentColor: "border-l-4 border-l-yellow-500",
      iconBgColor: "bg-yellow-500",
      textColor: "text-white",
    },
    levelUp: {
      icon: <Star className="w-6 h-6" />,
      bgColor: "from-zinc-800 to-zinc-900",
      accentColor: "border-l-4 border-l-green-500",
      iconBgColor: "bg-green-500",
      textColor: "text-white",
    },
    success: {
      icon: <CheckCircle2 className="w-6 h-6" />,
      bgColor: "from-zinc-800 to-zinc-900",
      accentColor: "border-l-4 border-l-green-400",
      iconBgColor: "bg-green-400",
      textColor: "text-white",
    },
    error: {
      icon: <XCircle className="w-6 h-6" />,
      bgColor: "from-zinc-800 to-zinc-900",
      accentColor: "border-l-4 border-l-red-500",
      iconBgColor: "bg-red-500",
      textColor: "text-white",
    },
    info: {
      icon: <Info className="w-6 h-6" />,
      bgColor: "from-zinc-800 to-zinc-900",
      accentColor: "border-l-4 border-l-green-600",
      iconBgColor: "bg-green-600",
      textColor: "text-white",
    },
    warning: {
      icon: <AlertCircle className="w-6 h-6" />,
      bgColor: "from-zinc-800 to-zinc-900",
      accentColor: "border-l-4 border-l-amber-500",
      iconBgColor: "bg-amber-500",
      textColor: "text-white",
    },
    combo: {
      icon: <Sparkles className="w-6 h-6" />,
      bgColor: "from-zinc-800 to-zinc-900",
      accentColor: "border-l-4 border-l-green-300",
      iconBgColor: "bg-green-300",
      textColor: "text-white",
    },
    powerUp: {
      icon: <Zap className="w-6 h-6" />,
      bgColor: "from-zinc-800 to-zinc-900",
      accentColor: "border-l-4 border-l-green-500",
      iconBgColor: "bg-green-500",
      textColor: "text-white",
    },
    streak: {
      icon: <Flame className="w-6 h-6" />,
      bgColor: "from-zinc-800 to-zinc-900",
      accentColor: "border-l-4 border-l-green-400",
      iconBgColor: "bg-green-400",
      textColor: "text-white",
    },
  };

  const { icon, bgColor, accentColor, iconBgColor, textColor } = config[type];

  return (
    <div
      className={`
      relative w-full h-full flex items-start p-0 rounded-lg shadow-lg
      bg-gradient-to-r ${bgColor}  border-zinc-700
      game-toast-container overflow-hidden
    `}
    >
      {/* Content */}
      <div className="relative z-10 flex items-start w-full h-full">
        {/* Icon container with subtle animation */}
        <div
          className={`
          flex-1/3 h-full  rounded-md text-white ${iconBgColor} 
          flex items-center justify-center animate-pulse-subtle
        `}
        >
          <div className="text-black m-3">{icon}</div>
        </div>

        <div className="flex-1/3 p-3">
          {/* Title with clear text */}
          <div className={`font-bold text-base ${textColor} mb-1`}>
            {message}
          </div>

          {/* Description */}
          {description && (
            <div className={`${textColor} opacity-90 text-sm`}>
              {description}
            </div>
          )}
        </div>

        {/* Points display */}
        {points !== undefined && (
          <div className="flex-shrink-0 p-3">
            <div
              className={`
              px-2 py-1 rounded-full bg-green-500/90
              font-bold text-sm text-black
            `}
            >
              +{points}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Toast container component
export const GameToastContainer: React.FC = () => {
  return (
    <ToastContainer
      position="bottom-right"
      autoClose={100000}
      hideProgressBar
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
      transition={Bounce}
      className="game-toast-container"
      closeButton={false}
    />
  );
};

// Toast trigger functions
export const showGameToast = {
  achievement: (options: ToastOptions) =>
    toast(<GameToast type="achievement" {...options} />, {
      className: "game-toast-achievement",
    }),

  levelUp: (options: ToastOptions) =>
    toast(<GameToast type="levelUp" {...options} />, {
      className: "game-toast-level-up",
    }),

  success: (options: ToastOptions) =>
    toast(<GameToast type="success" {...options} />, {
      className: "game-toast-success",
    }),

  error: (options: ToastOptions) =>
    toast(<GameToast type="error" {...options} />, {
      className: "game-toast-error",
    }),

  info: (options: ToastOptions) =>
    toast(<GameToast type="info" {...options} />, {
      className: "game-toast-info",
    }),

  warning: (options: ToastOptions) =>
    toast(<GameToast type="warning" {...options} />, {
      className: "game-toast-warning",
    }),

  combo: (options: ToastOptions) =>
    toast(<GameToast type="combo" {...options} />, {
      className: "game-toast-combo",
    }),

  powerUp: (options: ToastOptions) =>
    toast(<GameToast type="powerUp" {...options} />, {
      className: "game-toast-power-up",
    }),

  streak: (options: ToastOptions) =>
    toast(<GameToast type="streak" {...options} />, {
      className: "game-toast-streak",
    }),
};

export default GameToast;
