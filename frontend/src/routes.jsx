// src/routes.jsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Agendamentos from './pages/Agendamentos';
import Clientes from './pages/Clientes';

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/agendamentos" element={<Agendamentos />} />
      <Route path="/clientes" element={<Clientes />} />
    </Routes>
  </Router>
);

export default AppRoutes;