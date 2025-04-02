import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./SalaoDetalhes.css"; // CSS específico para esta página

const SalaoDetalhes = () => {
  const { id } = useParams();
  const [salao, setSalao] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSalao = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          window.location.href = "/login";
          return;
        }

        const response = await fetch(
          `http://127.0.0.1:8000/admin-panel/api/saloes/${id}/`,
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

        if (!response.ok) {
          throw new Error("Salão não encontrado");
        }

        const data = await response.json();
        setSalao(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSalao();
  }, [id]);

  if (loading) {
    return (
      <div className="salao-detalhes-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="salao-detalhes-error">
        <p>{error}</p>
        <Link to="/saloes" className="back-button">
          Voltar para a lista
        </Link>
      </div>
    );
  }

  return (
    <div className="salao-detalhes-container">
      <div className="salao-detalhes-card">
        <div className="salao-detalhes-header">
          <h1>{salao.nome}</h1>
          <span className={`status-badge ${salao.status === 'ativo' ? 'ativo' : 'inativo'}`}>
            {salao.status}
          </span>
        </div>

        <div className="salao-detalhes-content">
          <div className="detail-section">
            <h2>Informações Básicas</h2>
            <div className="detail-row">
              <span className="detail-label">CNPJ:</span>
              <span className="detail-value">{salao.cnpj}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Endereço:</span>
              <span className="detail-value">{salao.endereco}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Data de Cadastro:</span>
              <span className="detail-value">
                {new Date(salao.data_cadastro).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="detail-section">
            <h2>Contato</h2>
            <div className="detail-row">
              <span className="detail-label">Telefone:</span>
              <span className="detail-value">{salao.telefone || 'Não informado'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{salao.email || 'Não informado'}</span>
            </div>
          </div>

          <div className="salao-detalhes-actions">
            <Link to="/saloes" className="back-button">
              Voltar
            </Link>
            <Link to={`/saloes/editar/${id}`} className="edit-button">
              Editar Salão
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalaoDetalhes;