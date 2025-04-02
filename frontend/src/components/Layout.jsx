import React from 'react';
import Sidebar from './Sidebar';
import './Layout.css'; // Vamos criar este arquivo depois

const Layout = ({ children }) => {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="content">
        {children}
      </main>
    </div>
  );
};

export default Layout;