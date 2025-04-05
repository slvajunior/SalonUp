import { useEffect, useState } from "react";
import { Line, Bar, Pie } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import "./Dashboard.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";

Chart.register(...registerables);

const Dashboard = () => {
  // Estado para controlar o intervalo de tempo
  const [timeRange, setTimeRange] = useState("month"); // "week", "month" ou "year"

  const [dashboardData, setDashboardData] = useState({
    revenue_chart: { labels: [], data: [] },
    salons_by_region: { labels: [], data: [] },
    recent_saloes: [],
    recent_activities: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [salons, setSalons] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) throw new Error("Token de autenticação não encontrado");

        const response = await fetch(
          `http://127.0.0.1:8000/admin-panel/dashboard/?range=${timeRange}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) throw new Error("Erro ao carregar dados");

        const data = await response.json();
        setDashboardData(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [timeRange]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Carregando dados...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h3>Erro ao carregar dados</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>
          Tentar novamente
        </button>
      </div>
    );
  }

  if (!dashboardData) {
    return <div>Nenhum dado disponível</div>;
  }

  const statusLabels = {
    ativo: "Ativo",
    inativo: "Inativo",
    suspenso: "Suspenso",
  };

  {
    salons.map((salon, index) => (
      <div key={index}>
        <span className={`status-badge ${salon.status}`}>
          {statusLabels[salon.status] || "Desconhecido"}
        </span>
      </div>
    ));
  }

  // Dados para gráficos
  const revenueChartData = {
    labels: dashboardData?.revenue_chart?.labels || [],
    datasets: [
      {
        label: "Faturamento",
        data: dashboardData?.revenue_chart?.data || [],
        backgroundColor: "rgba(99, 102, 241, 0.2)",
        borderColor: "rgba(99, 102, 241, 1)",
        borderWidth: 2,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const salonsByRegionData = {
    labels: dashboardData?.salons_by_region?.labels || [],
    datasets: [
      {
        label: "Salões por Região",
        data: dashboardData?.salons_by_region?.data || [],
        backgroundColor: [
          "rgba(99, 102, 241, 0.7)", // Azul
          "rgba(16, 185, 129, 0.7)", // Verde
          "rgba(245, 158, 11, 0.7)", // Laranja
          "rgba(239, 68, 68, 0.7)", // Vermelho
          "rgba(236, 72, 153, 0.7)", // Rosa
          "rgba(59, 130, 246, 0.7)", // Azul Claro
          "rgba(132, 204, 22, 0.7)", // Verde Limão
          "rgba(168, 85, 247, 0.7)", // Roxo
        ],
        borderColor: "#fff",
        borderWidth: 1,
      },
    ],
  };

  const recentSalons = dashboardData.recent_saloes.slice(0, 5);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>Painel Administrativo</h1>
          <p className="welcome-message">Bem-vindo de volta, CEO</p>
        </div>
        <div className="header-right">
          <div className="time-range-selector">
            <button
              className={timeRange === "week" ? "active" : ""}
              onClick={() => setTimeRange("week")}
            >
              Semana
            </button>
            <button
              className={timeRange === "month" ? "active" : ""}
              onClick={() => setTimeRange("month")}
            >
              Mês
            </button>
            <button
              className={timeRange === "year" ? "active" : ""}
              onClick={() => setTimeRange("year")}
            >
              Ano
            </button>
          </div>
        </div>
      </header>

      <div className="metrics-grid">
        <div className="metric-card primary">
          <div className="metric-content">
            <h3>Total de Salões</h3>
            <p className="metric-value">{dashboardData.total_saloes}</p>
            <p className="metric-change positive">
              +{dashboardData.saloes_growth}% em relação ao último período
            </p>
          </div>
          <div className="metric-icon">
            <i className="fas fa-store"></i>
          </div>
        </div>

        <div className="metric-card success">
          <div className="metric-content">
            <h3>Clientes Ativos</h3>
            <p className="metric-value">{dashboardData.total_clientes}</p>
            <p className="metric-change positive">
              +{dashboardData.clientes_growth}% em relação ao último período
            </p>
          </div>
          <div className="metric-icon">
            <i className="fas fa-users"></i>
          </div>
        </div>

        <div className="metric-card warning">
          <div className="metric-content">
            <h3>Faturamento Mensal</h3>
            <p className="metric-value">
              R$ {dashboardData.faturamento_mensal.toFixed(2)}
            </p>
            <p className="metric-change positive">
              +{dashboardData.revenue_growth}% em relação ao último período
            </p>
          </div>
          <div className="metric-icon">
            <i className="fas fa-dollar-sign"></i>
          </div>
        </div>

        <div className="metric-card info">
          <div className="metric-content">
            <h3>Agendamentos</h3>
            <p className="metric-value">{dashboardData.total_agendamentos}</p>
            <p className="metric-change neutral">
              {dashboardData.agendamentos_change >= 0 ? "+" : ""}
              {dashboardData.agendamentos_change}% em relação ao último período
            </p>
          </div>
          <div className="metric-icon">
            <i className="fas fa-calendar-check"></i>
          </div>
        </div>
      </div>

      <div className="charts-row">
        <div className="chart-card">
          <h3>Faturamento</h3>
          <div className="chart-container">
            <Line
              data={revenueChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      color: "rgba(0, 0, 0, 0.05)",
                    },
                  },
                  x: {
                    grid: {
                      display: false,
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="chart-card">
          <h3>Salões por Região</h3>
          <div className="chart-container">
            <Pie
              data={salonsByRegionData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "right",
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      <div className="tables-row">
        <div className="table-card">
          <h3>Últimos Salões Cadastrados</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Localização</th>
                  <th>Status</th>
                  <th>Cadastro</th>
                </tr>
              </thead>
              <tbody>
                {recentSalons.map((salon) => (
                  <tr key={salon.id}>
                    <td>{salon.nome}</td>
                    <td>{salon.cidade}</td>
                    <td>
                      <span className={`status-badge ${salon.status}`}>
                        {salon.status === "ativo"
                          ? "Active"
                          : salon.status === "inativo"
                          ? "Inactive"
                          : salon.status === "suspenso"
                          ? "Suspended"
                          : "Desconhecido"}
                      </span>
                    </td>
                    <td>
                      {new Date(salon.data_cadastro).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="table-card">
          <h3>Atividades Recentes</h3>
          <div className="activities-list">
            {dashboardData.recent_activities.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-icon">
                  <i className={`fas fa-${activity.icon}`}></i>
                </div>
                <div className="activity-content">
                  <p className="activity-message">{activity.message}</p>
                  <p className="activity-time">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
