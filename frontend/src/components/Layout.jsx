// src/components/Layout.jsx
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="content">{children}</main>
    </div>
  );
}
