import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider } from "./components/ThemeProvider.tsx";
import { MetaMaskProvider } from "@metamask/sdk-react";
createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <HeroUIProvider>
      <MetaMaskProvider
        debug={false}
        sdkOptions={{
          logging: {
            developerMode: false,
          },
          communicationServerUrl: "http://localhost:5173",
          checkInstallationImmediately: false, //  This will automatically connect to MetaMask on page load
          dappMetadata: {
            name: "Demo React App",
            url: window.location.host,
          },
        }}
      >
        <App />
      </MetaMaskProvider>
    </HeroUIProvider>
  </ThemeProvider>
);
