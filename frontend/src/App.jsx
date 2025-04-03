import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Layout from "./components/Layout";
import Saloes from "./pages/Saloes";
import AdicionarSalao from "./pages/AdicionarSalao";
import SalaoDetalhes from "./pages/SalaoDetalhes";
import SalaoForm from "./pages/SalaoForm";
import ErrorBoundary from "./components/ErrorBoundary";

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
      <ErrorBoundary>
        <Routes>
          {/* Redirecionamento da raiz para /login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Rota de login com callback para autenticação */}
          <Route
            path="/login"
            element={<Login setIsAuthenticated={setIsAuthenticated} />}
          />

          {/* Rotas protegidas - cada uma envolta com ErrorBoundary */}
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <Layout>
                  <ErrorBoundary>
                    <Dashboard />
                  </ErrorBoundary>
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/saloes"
            element={
              <PrivateRoute>
                <Layout>
                  <ErrorBoundary>
                    <Saloes />
                  </ErrorBoundary>
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/saloes/:id"
            element={
              <PrivateRoute>
                <Layout>
                  <ErrorBoundary>
                    <SalaoDetalhes />
                  </ErrorBoundary>
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/saloes/editar/:id"
            element={
              <PrivateRoute>
                <Layout>
                  <ErrorBoundary>
                    <SalaoForm isEdit={true} />
                  </ErrorBoundary>
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/saloes/novo"
            element={
              <PrivateRoute>
                <Layout>
                  <ErrorBoundary>
                    <AdicionarSalao />
                  </ErrorBoundary>
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
      </ErrorBoundary>
    </Router>
  );
}

export default App;