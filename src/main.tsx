
  import { createRoot } from "react-dom/client";
  import App from "./App.tsx";
  import "./index.css";
  import { StatusBar, Style } from '@capacitor/status-bar';
  import { Capacitor } from '@capacitor/core';

  // Configure status bar for mobile
  if (Capacitor.isNativePlatform()) {
    StatusBar.setOverlaysWebView({ overlay: true });
    StatusBar.setStyle({ style: Style.Light });
    StatusBar.setBackgroundColor({ color: '#00000000' }); // Transparent
  }

  createRoot(document.getElementById("root")!).render(<App />);
