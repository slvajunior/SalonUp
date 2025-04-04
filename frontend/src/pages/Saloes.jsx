// src/pages/Saloes.jsx

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Saloes.css";

const Saloes = () => {
  const [saloes, setSaloes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Função para carregar os salões
  const fetchSaloes = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        navigate("/login");
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
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Erro ao carregar salões");
      }

      const data = await response.json();
      setSaloes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaloes();
  }, []);

  // Função para deletar salão
  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este salão?")) {
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        `http://127.0.0.1:8000/admin-panel/api/saloes/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setSaloes(saloes.filter((salao) => salao.id !== id));
      } else {
        throw new Error("Falha ao excluir salão");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        `http://127.0.0.1:8000/admin-panel/api/saloes/${id}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(salao),
        }
      );

      if (response.ok) {
        navigate("/admin/saloes"); // Corrigido para rota administrativa
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Erro ao atualizar salão");
      }
    } catch (err) {
      setError("Erro ao conectar com o servidor");
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="retry-button"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="saloes-container">
      <div className="saloes-content">
        <div className="saloes-header">
          <h1 className="saloes-title">Salões Cadastrados</h1>
          <Link to="/admin/saloes/novo" className="add-salao-btn">
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
                    <span
                      className={`status ${
                        salao.status === "ativo"
                          ? "status-ativo"
                          : salao.status === "inativo"
                          ? "status-inativo"
                          : salao.status === "suspenso"
                          ? "status-suspenso"
                          : ""
                      }`}
                    >
                      {salao.status}
                    </span>
                  </td>
                  {/* Dentro do mapeamento dos salões */}
                  <td className="actions">
                    <Link to={`/saloes/${salao.id}`} className="action-link">
                      Detalhes
                    </Link>
                    <Link
                      to={`/admin/saloes/editar/${salao.id}`}
                      className="action-link"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(salao.id)}
                      className="delete-button"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Saloes;
