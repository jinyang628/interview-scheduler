import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "@/styles/globals.css";
import { ThemeProvider } from "next-themes";
import { QueryProvider } from "@/components/shared/query-provider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeProvider
    attribute="class"
    defaultTheme="system"
    enableSystem
    disableTransitionOnChange
  >
    <QueryProvider>
      <App />
    </QueryProvider>
  </ThemeProvider>,
);
