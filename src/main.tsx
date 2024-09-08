import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { StateProvider } from "@/providers/StateProvider";
import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "next-themes";
import { ConvexReactClient } from "convex/react";
import App from "./App.tsx";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <StateProvider>
      <ThemeProvider attribute="class">
        <ConvexAuthProvider client={convex}>
          <App />
          <Toaster />
        </ConvexAuthProvider>
      </ThemeProvider>
    </StateProvider>
  </React.StrictMode>,
);
