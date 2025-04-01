// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";

const Dashboard = () => {
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDados = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          throw new Error("Token de autenticação não encontrado");
        }
    
        const response = await fetch("http://127.0.0.1:8000/admin-panel/dashboard/", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
    
        if (response.status === 401) {
          throw new Error("Não autorizado - token inválido ou expirado");
        }
    
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Erro HTTP: ${response.status}`);
        }
    
        const data = await response.json();
        setDados(data);
      } catch (error) {
        console.error("Erro detalhado:", error);
        setDados(null); // Garante que o estado seja resetado em caso de erro
      } finally {
        setLoading(false);
      }
    };

    fetchDados();
  }, []);

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (!dados) {
    return <p>Erro ao carregar dados.</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-500 text-white p-4 rounded-xl">
          <h2 className="text-xl font-semibold">Total de Salões</h2>
          <p className="text-3xl">{dados.total_saloes}</p>
        </div>
        <div className="bg-green-500 text-white p-4 rounded-xl">
          <h2 className="text-xl font-semibold">Clientes Cadastrados</h2>
          <p className="text-3xl">{dados.total_clientes}</p>
        </div>
        <div className="bg-yellow-500 text-white p-4 rounded-xl">
          <h2 className="text-xl font-semibold">Faturamento Mensal</h2>
          <p className="text-3xl">R$ {dados.faturamento_mensal.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
