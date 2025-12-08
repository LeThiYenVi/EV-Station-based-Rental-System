import { Header } from "./Header";
import { Footer } from "./Footer";
import { ReactNode } from "react";
import "./layout.css";
import ChatBot from "@/components/ChatBot";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="layout-container">
      <Header />
      <main className="layout-main">{children}</main>
      <Footer />
      <ChatBot />
    </div>
  );
}
