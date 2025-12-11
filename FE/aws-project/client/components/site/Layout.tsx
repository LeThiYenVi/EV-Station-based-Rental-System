import { Header } from "./Header";
import { Footer } from "./Footer";
import { ReactNode } from "react";
import "./layout.css";
import ChatBot from "@/components/ChatBot";
import XmasTree from "react-xmas-tree/react";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="layout-container">
      {/* Christmas Tree with react-xmas-tree */}
      <XmasTree
        position={{
          left: "30px",
          bottom: "10px",
          position: "fixed",
        }}
        starColor="#ffea00ff"
        lightColors={[
          "#0EA5E9", // Sky blue
          "#06B6D4", // Cyan
          "#3B82F6", // Blue
          "#6366F1", // Indigo
          "#8B5CF6", // Purple
          "#10b981", // Emerald green
        ]}
        customLightStyles={{
          width: "1.5vmin",
          height: "1.5vmin",
          borderRadius: "50%",
        }}
      />

      <Header />
      <main className="layout-main">{children}</main>
      <Footer />
      <ChatBot />
    </div>
  );
}
