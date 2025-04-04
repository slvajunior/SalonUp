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

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchData = async () => {
      try {
        console.log(`%c[DEBUG] Fetching salão data for ID: ${id}`, 'color: #4fc3f7');
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
          console.log("%c[DATA RECEIVED]", "color: #69f0ae", data);
          setFormData(data);
        } else {
          console.error("%c[ERROR] Failed to fetch salão data", "color: #ff5252");
        }
      } catch (error) {
        console.error("%c[EXCEPTION] Error fetching data:", "color: #ff5252", error);
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
    console.log(`%c[FORM UPDATE] ${name}: ${value}`, 'color: #ffa000');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.group("%c[SUBMIT] Saving salão data", "color: #4fc3f7");
    console.log("%cPayload:", "color: #ffa000", formData);

    if (!/^\d{14}$/.test(formData.cnpj)) {
      alert("CNPJ inválido! Ele deve ter 14 números.");
      return;
    }
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://127.0.0.1:8000/admin-panel/api/saloes/${id}/`,
        {
          method: "GET", // ou "PUT" no outro fetch
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // aqui você passa o token corretamente
          },
        }
      );

      if (response.ok) {
        console.log("%c[SUCCESS] Salão updated successfully", "color: #69f0ae");
        navigate("/admin/saloes");
      } else {
        const errorData = await response.json();
        console.error("%c[API ERROR]", "color: #ff5252", errorData);
      }
    } catch (error) {
      console.error("%c[NETWORK ERROR]", "color: #ff5252", error);
    } finally {
      console.groupEnd();
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

          <div className="form-section">
            <label className="input-label">
              <span className="label-comment">// CNPJ (somente números)</span>
              <input
                type="text"
                name="cnpj"
                value={formData.cnpj}
                onChange={handleInputChange}
                className="code-input"
                required
                pattern="\d{14}"
                title="14 dígitos numéricos"
              />
            </label>
          </div>

          <div className="form-section">
            <label className="input-label">
              <span className="label-comment">// Endereço completo</span>
              <input
                type="text"
                name="endereco"
                value={formData.endereco}
                onChange={handleInputChange}
                className="code-input"
                required
              />
            </label>
          </div>

          <div className="form-grid">
            <div className="form-section">
              <label className="input-label">
                <span className="label-comment">// Cidade</span>
                <input
                  type="text"
                  name="cidade"
                  value={formData.cidade}
                  onChange={handleInputChange}
                  className="code-input"
                  required
                />
              </label>
            </div>

            <div className="form-section">
              <label className="input-label">
                <span className="label-comment">// Estado (UF)</span>
                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleInputChange}
                  className="code-input"
                  required
                >
                  <option value="">Selecione...</option>
                  {['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS',
                     'MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC',
                     'SP','SE','TO'].map(uf => (
                    <option key={uf} value={uf}>{uf}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-section">
              <label className="input-label">
                <span className="label-comment">// Telefone</span>
                <input
                  type="tel"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleInputChange}
                  className="code-input"
                  required
                />
              </label>
            </div>

            <div className="form-section">
              <label className="input-label">
                <span className="label-comment">// E-mail</span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="code-input"
                  required
                />
              </label>
            </div>
          </div>

          <div className="form-section">
            <label className="input-label">
              <span className="label-comment">// Status do salão</span>
              <div className="radio-group">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="status"
                    value="ativo"
                    checked={formData.status === 'ativo'}
                    onChange={handleInputChange}
                  />
                  <span className="radio-indicator"></span>
                  <span className="radio-label">Ativo</span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="status"
                    value="inativo"
                    checked={formData.status === 'inativo'}
                    onChange={handleInputChange}
                  />
                  <span className="radio-indicator"></span>
                  <span className="radio-label">Inativo</span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="status"
                    value="suspenso"
                    checked={formData.status === 'suspenso'}
                    onChange={handleInputChange}
                  />
                  <span className="radio-indicator"></span>
                  <span className="radio-label">Suspenso</span>
                </label>
              </div>
            </label>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate("/admin/saloes")}
              className="cancel-button"
            >
              <span className="button-icon">{"//"}</span>
              Cancelar (Esc)
            </button>
            <button
              type="submit"
              className="save-button"
            >
              <span className="button-icon">{"=>"}</span>
              Salvar Alterações (Ctrl+S)
            </button>
          </div>
        </form>
      </div>

      <div className="terminal-footer">
        <span className="status-message">Status: Ready</span>
        <span className="cursor-indicator">|</span>
      </div>
    </div>
  );
};

export default EditarSalao;