// src/routes/index.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Saloes from "../pages/Saloes";
import Financeiro from "../pages/Financeiro";
import Layout from "../components/Layout";

const AppRoutes = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/saloes" element={<Saloes />} />
          <Route path="/financeiro" element={<Financeiro />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default AppRoutes;
