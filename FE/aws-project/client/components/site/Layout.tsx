import { Header } from "./Header";
import { Footer } from "./Footer";
import { ReactNode } from "react";
import "./layout.css";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="layout-container">
      <Header />
      <main className="layout-main">{children}</main>
      <Footer />
    </div>
  );
}
