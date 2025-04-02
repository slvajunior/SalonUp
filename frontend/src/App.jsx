import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Layout from "./components/Layout";
import Saloes from "./pages/Saloes";
import AdicionarSalao from "./pages/AdicionarSalao";
import SalaoDetalhes from "./pages/SalaoDetalhes";
import SalaoForm from "./pages/SalaoForm"; // ou o caminho correto para o seu componente


const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("access_token");
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("access_token")
  );

  return (
    <Router>
      <Routes>
        {/* Redirecionamento da raiz para /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Rota de login com callback para autenticação */}
        <Route
          path="/login"
          element={<Login setIsAuthenticated={setIsAuthenticated} />}
        />

        {/* Rotas protegidas */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/saloes"
          element={
            <PrivateRoute>
              <Layout>
                <Saloes />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/saloes/:id"
          element={
            <PrivateRoute>
              <Layout>
                <SalaoDetalhes />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/saloes/editar/:id"
          element={
            <PrivateRoute>
              <Layout>
                <SalaoForm isEdit={true} />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/saloes/novo"
          element={
            <PrivateRoute>
              <Layout>
                <AdicionarSalao />
              </Layout>
            </PrivateRoute>
          }
        />

        {/* Redirecionamento para páginas não encontradas */}
        <Route
          path="*"
          element={
            <Navigate to={isAuthenticated ? "/admin" : "/login"} replace />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
