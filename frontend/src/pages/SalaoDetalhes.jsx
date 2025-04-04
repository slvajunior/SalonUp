import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "./SalaoDetalhes.css";

const SalaoDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [salao, setSalao] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    if (windowRef.current) {
      const maxX = window.innerWidth - windowRef.current.offsetWidth;
      const maxY = window.innerHeight - windowRef.current.offsetHeight;
      setPosition({
        x: Math.max(0, Math.min(position.x, maxX)),
        y: Math.max(0, Math.min(position.y, maxY))
      });
    }
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
    
    const maxX = window.innerWidth - windowRef.current.offsetWidth;
    const maxY = window.innerHeight - windowRef.current.offsetHeight;
    
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

  useEffect(() => {
    const fetchSalao = async () => {
      try {
        console.log(`%c[API] Fetching salão details for ID: ${id}`, 'color: #4fc3f7');
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
            },
          }
        );

        if (response.status === 401) {
          console.warn("%c[AUTH] Token inválido ou expirado", "color: #ffa000");
          localStorage.removeItem("access_token");
          navigate("/login");
          return;
        }

        if (!response.ok) {
          throw new Error("Salão não encontrado");
        }

        const data = await response.json();
        console.log("%c[DATA] Salão details received:", "color: #69f0ae", data);
        setSalao(data);
      } catch (err) {
        console.error("%c[ERROR] Failed to fetch salão details:", "color: #ff5252", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSalao();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="terminal-loading">
        <div className="loading-animation">
          <span className="loading-char">$</span>
          <span className="loading-char">'<></>'</span>
          <span className="loading-char">_</span>
        </div>
        <div className="loading-text">Carregando detalhes do salão...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="terminal-error">
        <div className="error-header">Erro no sistema</div>
        <div className="error-message">{error}</div>
        <button onClick={() => navigate("/admin/saloes")} className="error-retry">
          Voltar para lista
        </button>
      </div>
    );
  }

  return (
    <div 
      className={`code-editor ${isDragging ? 'dragging' : ''}`}
      ref={windowRef}
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
          <span className="control close" onClick={() => navigate("/admin/saloes")}></span>
          <span className="control minimize"></span>
          <span className="control expand"></span>
        </div>
        <div className="editor-title">
          salonUp PRO - Detalhes do Salão [ID: {id}]
        </div>
      </div>

      <div className="editor-body">
        <div className="code-viewer">
          <div className="detail-section">
            <div className="code-line">
              <span className="code-comment">// Informações básicas</span>
            </div>
            <div className="code-line">
              <span className="code-property">nome:</span>
              <span className="code-value">"{salao.nome}"</span>
              <span className="code-status" data-status={salao.status}>
                {salao.status}
              </span>
            </div>
            <div className="code-line">
              <span className="code-property">cnpj:</span>
              <span className="code-value">"{salao.cnpj}"</span>
            </div>
            <div className="code-line">
              <span className="code-property">endereco:</span>
              <span className="code-value">"{salao.endereco}"</span>
            </div>
            <div className="code-line">
              <span className="code-property">cidade:</span>
              <span className="code-value">"{salao.cidade || 'null'}"</span>
            </div>
            <div className="code-line">
              <span className="code-property">estado:</span>
              <span className="code-value">"{salao.estado || 'null'}"</span>
            </div>
          </div>

          <div className="detail-section">
            <div className="code-line">
              <span className="code-comment">// Informações de contato</span>
            </div>
            <div className="code-line">
              <span className="code-property">telefone:</span>
              <span className="code-value">"{salao.telefone || 'null'}"</span>
            </div>
            <div className="code-line">
              <span className="code-property">email:</span>
              <span className="code-value">"{salao.email || 'null'}"</span>
            </div>
            <div className="code-line">
              <span className="code-property">data_cadastro:</span>
              <span className="code-value">"{new Date(salao.data_cadastro).toLocaleDateString()}"</span>
            </div>
          </div>

          <div className="form-actions">
            <button
              onClick={() => navigate("/admin/saloes")}
              className="cancel-button"
            >
              <span className="button-icon">{"//"}</span>
              Voltar
            </button>
            <button
              onClick={() => navigate(`/admin/saloes/editar/${id}`)}
              className="save-button"
            >
              <span className="button-icon">{"=>"}</span>
              Editar Salão
            </button>
          </div>
        </div>
      </div>

      <div className="editor-footer">
        <span className="status-message">
          Visualizando salão ID: {id}
        </span>
        <span className="cursor-indicator">_</span>
      </div>
    </div>
  );
};

export default SalaoDetalhes;