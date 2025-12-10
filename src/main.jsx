import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HeroUIProvider } from "@heroui/react";
import "./index.css";
import App from "./App.jsx";

// Vercel Speed Insights - runs on client side only
if (typeof window !== "undefined") {
  import("@vercel/speed-insights/react").then((module) => {
    module.default();
  });
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HeroUIProvider>
      <App />
    </HeroUIProvider>
  </StrictMode>
);
