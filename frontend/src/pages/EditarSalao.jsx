//pages/EditarSalao.jsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EditarSalao.css";

const EditarSalao = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: "",
    cnpj: "",
    endereco: "",
    cidade: "",
    estado: "",
    telefone: "",
    email: "",
    status: "ativo"
  });

  // Função para formatar CNPJ
  const formatCNPJ = (value) => {
    if (!value) return "";
    const cleaned = value.replace(/\D/g, '');
    
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 5) return `${cleaned.slice(0, 2)}.${cleaned.slice(2)}`;
    if (cleaned.length <= 8) return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5)}`;
    if (cleaned.length <= 12) return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}/${cleaned.slice(8)}`;
    return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}/${cleaned.slice(8, 12)}-${cleaned.slice(12, 14)}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/admin-panel/api/saloes/${id}/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setFormData({
            ...data,
            cnpj: formatCNPJ(data.cnpj) // Formata o CNPJ ao carregar
          });
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ 
      ...prevState, 
      [name]: value 
    }));
  };

  const handleCnpjChange = (e) => {
    const { name, value } = e.target;
    const cleaned = value.replace(/\D/g, '');
    setFormData(prev => ({
      ...prev,
      [name]: formatCNPJ(cleaned)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validação do CNPJ
    const cnpjDigits = formData.cnpj.replace(/\D/g, '');
    if (cnpjDigits.length !== 14) {
      alert("CNPJ deve conter 14 dígitos!");
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/admin-panel/api/saloes/${id}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify({
            ...formData,
            cnpj: formData.cnpj // Mantém a formatação
          })
        }
      );

      if (response.ok) {
        navigate("/admin/saloes");
      } else {
        const errorData = await response.json();
        alert(`Erro: ${errorData.detail || "Falha ao atualizar"}`);
      }
    } catch (error) {
      alert("Erro de rede ao atualizar salão");
    }
  };

  return (
    <div className="editor-container">
      <div className="terminal-header">
        <div className="terminal-controls">
          <span className="control close"></span>
          <span className="control minimize"></span>
          <span className="control expand"></span>
        </div>
        <div className="terminal-title">salonUp PRO - Edit Salão [ID: {id}]</div>
      </div>

      <div className="editor-content">
        <form onSubmit={handleSubmit} className="code-form">
          {/* Campos do formulário */}
          <div className="form-section">
            <label className="input-label">
              <span className="label-comment">// CNPJ</span>
              <input
                type="text"
                name="cnpj"
                value={formData.cnpj}
                onChange={handleCnpjChange}
                className="code-input"
                required
                maxLength={18}
                title="Digite o CNPJ com ou sem formatação"
              />
            </label>
          </div>

          {/* Restante dos campos permanece igual */}
          <div className="form-section">
            <label className="input-label">
              <span className="label-comment">// Nome do estabelecimento</span>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                className="code-input"
                required
              />
            </label>
          </div>

          {/* ... outros campos ... */}

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate("/admin/saloes")}
              className="cancel-button"
            >
              <span className="button-icon">{"//"}</span>
              Cancelar
            </button>
            <button
              type="submit"
              className="save-button"
            >
              <span className="button-icon">{"=>"}</span>
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>

      <div className="terminal-footer">
        <span className="status-message">Status: Editando salão ID {id}</span>
        <span className="cursor-indicator">|</span>
      </div>
    </div>
  );
};

export default EditarSalao;