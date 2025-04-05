import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./SalaoForm.css";

const SalaoForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const formRef = useRef(null);
  const headerRef = useRef(null);

  // Estado para o drag-and-drop
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ 
    x: window.innerWidth * 0.03,
    y: window.innerHeight * 0.06
  });
  const [offset, setOffset] = useState({ x: 0, y: 0 });

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

  // Estado do formulário
  const [formData, setFormData] = useState({
    nome: "",
    cnpj: "",
    endereco: "",
    cidade: "",
    estado: "",
    telefone: "",
    email: "",
    status: "ativo",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Efeitos e funções de drag-and-drop (mantidos iguais)
  useEffect(() => {
    const updatePosition = () => {
      if (formRef.current) {
        const maxX = window.innerWidth - formRef.current.offsetWidth;
        const maxY = window.innerHeight - formRef.current.offsetHeight;
        
        setPosition(prev => ({
          x: Math.max(0, Math.min(prev.x, maxX)),
          y: Math.max(0, Math.min(prev.y, maxY))
        }));
      }
    };

    const timer = setTimeout(updatePosition, 50);
    window.addEventListener('resize', updatePosition);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updatePosition);
    };
  }, []);

  const handleMouseDown = (e) => {
    if (e.target === headerRef.current || headerRef.current.contains(e.target)) {
      setIsDragging(true);
      setOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
      e.preventDefault();
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const maxX = window.innerWidth - formRef.current.offsetWidth;
    const maxY = window.innerHeight - formRef.current.offsetHeight;
    
    setPosition({
      x: Math.max(0, Math.min(e.clientX - offset.x, maxX)),
      y: Math.max(0, Math.min(e.clientY - offset.y, maxY))
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, offset]);

  // Buscar dados do salão
  const fetchSalao = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        `http://127.0.0.1:8000/admin-panel/api/saloes/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("access_token");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Erro ao carregar dados do salão");
      }

      const data = await response.json();
      setFormData({
        ...data,
        cnpj: formatCNPJ(data.cnpj) // Formata o CNPJ ao carregar
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchSalao();
    else setLoading(false);
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCnpjChange = (e) => {
    const { name, value } = e.target;
    const cleaned = value.replace(/\D/g, '');
    setFormData(prev => ({
      ...prev,
      [name]: formatCNPJ(cleaned) // Armazena já formatado
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
      const token = localStorage.getItem("access_token");
      if (!token) {
        navigate("/login");
        return;
      }

      const method = id ? "PUT" : "POST";
      const url = id 
        ? `http://127.0.0.1:8000/admin-panel/api/saloes/${id}/`
        : "http://127.0.0.1:8000/admin-panel/api/saloes/";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          cnpj: formData.cnpj // Mantém a formatação
        }),
      });

      if (response.status === 401) {
        localStorage.removeItem("access_token");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Erro ao salvar salão");
      }

      navigate("/saloes");
    } catch (err) {
      setError(err.message);
    }
  };

  // Controles da janela
  const handleClose = () => navigate("/admin/saloes");
  const handleMinimize = () => console.log("%c[WINDOW] Minimized", "color: #ffa000");
  const handleExpand = () => console.log("%c[WINDOW] Maximized", "color: #ffa000");

  if (loading) return (
    <div className="terminal-loading">
      <div className="loading-animation">
        <span className="loading-char">$</span>
        <span className="loading-char">'<></>'</span>
        <span className="loading-char">_</span>
      </div>
      <div className="loading-text">Carregando dados do salão...</div>
    </div>
  );

  if (error) return (
    <div className="terminal-error">
      <div className="error-header">Erro no sistema</div>
      <div className="error-message">{error}</div>
      <button className="error-retry" onClick={fetchSalao}>
        Tentar novamente
      </button>
    </div>
  );

  return (
    <div 
      className={`code-editor ${isDragging ? 'dragging' : ''}`}
      ref={formRef}
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'default',
        userSelect: 'none'
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="editor-header" ref={headerRef}>
        <div className="window-controls">
          <span className="control close" onClick={handleClose}></span>
          <span className="control minimize" onClick={handleMinimize}></span>
          <span className="control expand" onClick={handleExpand}></span>
        </div>
        <div className="editor-title">
          salonUp PRO - {id ? `Editar Salão [ID: ${id}]` : "Novo Salão"}
        </div>
      </div>

      <div className="editor-body">
        <form onSubmit={handleSubmit} className="code-form">
          <div className="form-grid">
            <div className="form-field">
              <label className="input-label">
                <span className="label-comment">// Nome do estabelecimento</span>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome || ""}
                  onChange={handleChange}
                  className="code-input"
                  required
                />
              </label>
            </div>

            <div className="form-field">
              <label className="input-label">
                <span className="label-comment">// CNPJ</span>
                <input
                  type="text"
                  name="cnpj"
                  value={formData.cnpj || ""}
                  onChange={handleCnpjChange}
                  className="code-input"
                  required
                  maxLength={18}
                  title="Digite o CNPJ com ou sem formatação (14 dígitos)"
                />
              </label>
            </div>
          </div>

          {/* Restante dos campos do formulário (mantidos iguais) */}
          <div className="form-field">
            <label className="input-label">
              <span className="label-comment">// Endereço completo</span>
              <input
                type="text"
                name="endereco"
                value={formData.endereco || ""}
                onChange={handleChange}
                className="code-input"
                required
              />
            </label>
          </div>

          <div className="form-grid">
            <div className="form-field">
              <label className="input-label">
                <span className="label-comment">// Cidade</span>
                <input
                  type="text"
                  name="cidade"
                  value={formData.cidade || ""}
                  onChange={handleChange}
                  className="code-input"
                />
              </label>
            </div>

            <div className="form-field">
              <label className="input-label">
                <span className="label-comment">// Estado (UF)</span>
                <select
                  name="estado"
                  value={formData.estado || ""}
                  onChange={handleChange}
                  className="code-input"
                >
                  <option value="">-- Selecione --</option>
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
            <div className="form-field">
              <label className="input-label">
                <span className="label-comment">// Telefone</span>
                <input
                  type="text"
                  name="telefone"
                  value={formData.telefone || ""}
                  onChange={handleChange}
                  className="code-input"
                />
              </label>
            </div>

            <div className="form-field">
              <label className="input-label">
                <span className="label-comment">// E-mail</span>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                  className="code-input"
                />
              </label>
            </div>
          </div>

          <div className="form-field">
            <label className="input-label">
              <span className="label-comment">// Status do salão</span>
              <div className="radio-group">
                {['ativo', 'inativo', 'suspenso'].map(status => (
                  <label key={status} className="radio-option">
                    <input
                      type="radio"
                      name="status"
                      value={status}
                      checked={formData.status === status}
                      onChange={handleChange}
                    />
                    <span className="radio-indicator"></span>
                    <span className="radio-label">{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                  </label>
                ))}
              </div>
            </label>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate("/saloes")}
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
              {id ? "Salvar Alterações" : "Criar Salão"}
            </button>
          </div>
        </form>
      </div>

      <div className="editor-footer">
        <span className="status-message">
          {id ? `Editando salão ID: ${id}` : "Criando novo salão"}
        </span>
        <span className="cursor-indicator">_</span>
      </div>
    </div>
  );
};

export default SalaoForm;