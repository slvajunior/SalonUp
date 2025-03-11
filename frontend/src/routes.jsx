import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Agendamentos from "./pages/Agendamentos";
import Clientes from "./pages/Clientes";
import Layout from "./components/Layout"; // Layout com a Sidebar

const AppRoutes = () => (
  <Router>
    <Routes>
      {/* Envolvendo todas as páginas dentro do Layout */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="agendamentos" element={<Agendamentos />} />
        <Route path="clientes" element={<Clientes />} />
      </Route>
    </Routes>
  </Router>
);

export default AppRoutes;
