import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider } from "./components/ThemeProvider.tsx";
createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <HeroUIProvider>
      <App />
    </HeroUIProvider>
  </ThemeProvider>
);
