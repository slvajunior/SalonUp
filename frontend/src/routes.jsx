//frontend/src/routes.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Dashboard";
import Agendamentos from "./pages/Agendamentos";
import Clientes from "./pages/Clientes";
import Login from "./pages/Login";
import Layout from "./components/Layout";

// Função para verificar se o usuário está autenticado
const isAuthenticated = () => {
  return localStorage.getItem("access_token") !== null;
};

const AppRoutes = () => (
  <Router>
    <Routes>
      {/* Se o usuário estiver logado, vai para o dashboard. Se não, mostra a tela de login */}
      <Route path="/" element={isAuthenticated() ? <Navigate to="/admin" /> : <Login />} />

      {/* Página de Login */}
      <Route path="/login" element={<Login />} />

      {/* Rotas protegidas */}
      <Route path="/admin" element={isAuthenticated() ? <Layout /> : <Navigate to="/login" replace />}>
        <Route index element={<Home />} />
        <Route path="agendamentos" element={<Agendamentos />} />
        <Route path="clientes" element={<Clientes />} />
      </Route>

      {/* Se tentar acessar qualquer outra rota, redireciona para login */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Router>
);

export default AppRoutes;
