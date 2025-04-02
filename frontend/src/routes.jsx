import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Layout from "./components/Layout";
import Saloes from "./pages/Saloes";
import AdicionarSalao from "./pages/AdicionarSalao";
import SalaoDetalhes from "./pages/SalaoDetalhes";
import EditarSalao from "./pages/EditarSalao"; // IMPORTANTE: Importar a página correta!

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
          path="/saloes/editar/:id"  // 🚀 ESTA ROTA FOI ADICIONADA AQUI!
          element={
            <PrivateRoute>
              <Layout>
                <EditarSalao />
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
        <Route path="*" element={<Navigate to={isAuthenticated ? "/admin" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
