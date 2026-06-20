import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles/global.css";
import { buildCSSVariables } from "./theme";
import { ToastProvider } from "./context/ToastContext";

// Inject CSS custom properties from theme into :root
const style = document.createElement("style");
style.textContent = `:root { ${buildCSSVariables()} }`;
document.head.appendChild(style);

createRoot(document.getElementById("root")).render(
  <ToastProvider>
    <App />   {/* or your Router */}
  </ToastProvider>
);
