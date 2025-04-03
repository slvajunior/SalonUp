import { Link, useNavigate } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  };

  return (
    <div className="sidebar-horizontal">
      {/* Logo com vibe tech */}
      <div className="sidebar-brand">
        <div className="code-brackets">
          <h2 className="sidebar-title">SalonUp<span className="dev-highlight"> PRO</span></h2>
        </div>
      </div>

      {/* Menu estilo IDE/terminal */}
      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          <li className="menu-item">
            <Link to="/admin" className="sidebar-link">
              <span className="icon-code">{'//'}</span>
              <span className="menu-text">Dashboard</span>
              <span className="shortcut">Ctrl+D</span>
            </Link>
          </li>
          <li className="menu-item">
            <Link to="/saloes" className="sidebar-link">
              <span className="icon-code">{'<>'}</span>
              <span className="menu-text">Salões</span>
              <span className="shortcut">Ctrl+S</span>
            </Link>
          </li>
          <li className="menu-item">
            <Link to="/financeiro" className="sidebar-link">
              <span className="icon-code">{'$'}</span>
              <span className="menu-text">Financeiro</span>
              <span className="shortcut">Ctrl+F</span>
            </Link>
          </li>
          <li className="menu-item">
            <Link to="/config" className="sidebar-link">
              <span className="icon-code">{'{}'}</span>
              <span className="menu-text">Config</span>
              <span className="shortcut">Ctrl+,</span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* Área de status/logout */}
      <div className="status-bar">
        <div className="connection-status">
          <span className="status-indicator"></span>
          <span>master@salonup</span>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          <span className="logout-icon">Exit ()</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;