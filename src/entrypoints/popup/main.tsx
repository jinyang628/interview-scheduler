import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "@/styles/globals.css";
import { ThemeProvider } from "next-themes";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeProvider
    attribute="class"
    defaultTheme="system"
    enableSystem
    disableTransitionOnChange
  >
    <App />
  </ThemeProvider>,
);
