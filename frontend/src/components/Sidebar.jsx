// src/components/Sidebar.jsx
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="h-screen w-60 bg-gray-900 text-white p-4">
      <h2 className="text-xl font-bold">Painel do CEO</h2>
      <ul className="mt-4 space-y-2">
        <li>
          <Link to="/" className="block p-2 hover:bg-gray-700 rounded">
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/saloes" className="block p-2 hover:bg-gray-700 rounded">
            Salões
          </Link>
        </li>
        <li>
          <Link to="/financeiro" className="block p-2 hover:bg-gray-700 rounded">
            Financeiro
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
