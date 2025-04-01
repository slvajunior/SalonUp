import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Saloes.css";

const Saloes = () => {
  const [saloes, setSaloes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaloes = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          window.location.href = "/login";
          return;
        }

        const response = await fetch(
          "http://127.0.0.1:8000/admin-panel/api/saloes/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 401) {
          localStorage.removeItem("access_token");
          window.location.href = "/login";
          return;
        }

        const data = await response.json();
        setSaloes(data);
      } catch (error) {
        console.error("Erro ao buscar salões:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSaloes();
  }, []);

  return (
    <div className="saloes-container">
      <div className="saloes-content">
        <div className="saloes-header">
          <h1 className="saloes-title">Salões Cadastrados</h1>
          <Link to="/saloes/novo" className="add-salao-btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Adicionar Salão
          </Link>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
          </div>
        ) : (
          <div className="saloes-table-container">
            <table className="saloes-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>CNPJ</th>
                  <th>Endereço</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {saloes.map((salao) => (
                  <tr key={salao.id}>
                    <td>{salao.nome}</td>
                    <td>{salao.cnpj}</td>
                    <td>{salao.endereco}</td>
                    <td>
                      <span className={`status ${
                        salao.status === "ativo" 
                          ? "status-ativo" 
                          : "status-inativo"
                      }`}>
                        {salao.status}
                      </span>
                    </td>
                    <td className="actions">
                      <Link
                        to={`/saloes/${salao.id}`}
                        className="action-link"
                      >
                        Detalhes
                      </Link>
                      <Link
                        to={`/saloes/editar/${salao.id}`}
                        className="action-link"
                      >
                        Editar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Saloes;