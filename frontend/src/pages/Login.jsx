import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    senha: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showVirtualKeyboard, setShowVirtualKeyboard] = useState(false);
  const navigate = useNavigate();
  const formRef = useRef(null);
  const headerRef = useRef(null);
  const passwordRef = useRef(null);

  // Estado para o drag-and-drop
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ 
    x: window.innerWidth * 0.3,
    y: window.innerHeight * 0.3
  });
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Limpar tokens quando a aba perde visibilidade
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);
    return () => window.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Funções para o drag-and-drop (mantidas iguais)
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

  // Adicionar event listeners para o drag-and-drop
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, offset]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleVirtualKeyPress = (key) => {
    setCredentials(prev => ({
      ...prev,
      senha: prev.senha + key
    }));
    // Mantém o foco no campo de senha
    passwordRef.current.focus();
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.senha
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);
        console.log("%c[LOGIN] Authentication successful", "color: #69f0ae");
        setCredentials({ username: "", senha: "" }); // Limpa os campos
        navigate("/admin");
      } else {
        console.error("%c[LOGIN] Authentication failed", "color: #ff5252", data);
        setError("Usuário ou senha inválidos!");
        setCredentials(prev => ({ ...prev, senha: "" })); // Limpa só a senha
      }
    } catch (error) {
      console.error("%c[LOGIN] Connection error:", "color: #ff5252", error);
      setError("Erro ao conectar-se ao servidor.");
    } finally {
      setLoading(false);
    }
  };

  // Controles da janela (mantidos iguais)
  const handleClose = () => {
    console.log("%c[WINDOW] Login closed", "color: #ff5252");
  };

  const handleMinimize = () => {
    console.log("%c[WINDOW] Login minimized", "color: #ffa000");
  };

  const handleExpand = () => {
    console.log("%c[WINDOW] Login maximized", "color: #ffa000");
  };

  // Componente do teclado virtual (opcional)
  const VirtualKeyboard = ({ onKeyPress, onClose }) => (
    <div className="virtual-keyboard">
      <div className="keyboard-keys">
        {['1','2','3','4','5','6','7','8','9','0','!','@','#','$','q','w','e','r','t','y',
           'u','i','o','p','a','s','d','f','g','h','j','k','l','z','x','c','v','b','n','m'].map(key => (
          <button 
            key={key} 
            className="keyboard-key"
            onClick={() => onKeyPress(key)}
          >
            {key}
          </button>
        ))}
      </div>
      <button 
        className="keyboard-close"
        onClick={onClose}
      >
        Fechar Teclado
      </button>
    </div>
  );

  return (
    <div 
      className={`code-editor login-window ${isDragging ? 'dragging' : ''}`}
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
          salonUp PRO - Authentication Required
        </div>
      </div>

      <div className="editor-body">
        <form onSubmit={handleLogin} className="code-form" autoComplete="off">
          <div className="form-field">
            <label className="input-label">
              <span className="label-comment">// Username</span>
              <input
                type="text"
                name="username"
                value={credentials.username}
                onChange={handleInputChange}
                className="code-input"
                required
                autoComplete="off"
              />
            </label>
          </div>

          <div className="form-field">
            <label className="input-label">
              <span className="label-comment">// Password</span>
              <input
                type="password"
                name="senha"
                value={credentials.senha}
                onChange={handleInputChange}
                className="code-input"
                required
                autoComplete="new-password"
                ref={passwordRef}
              />
              <button 
                type="button" 
                className="keyboard-toggle"
                onClick={() => setShowVirtualKeyboard(!showVirtualKeyboard)}
              >
                {showVirtualKeyboard ? "▲" : "▼"} Teclado Virtual
              </button>
            </label>
          </div>

          {showVirtualKeyboard && (
            <VirtualKeyboard 
              onKeyPress={handleVirtualKeyPress}
              onClose={() => setShowVirtualKeyboard(false)}
            />
          )}

          {error && (
            <div className="form-field">
              <div className="error-message">
                <span className="error-icon">⚠️</span> {error}
              </div>
            </div>
          )}

          <div className="form-actions">
            <button
              type="submit"
              className="save-button"
              disabled={loading}
            >
              <span className="button-icon">
                {loading ? "⌛" : "=>"}
              </span>
              {loading ? "Authenticating..." : "Login"}
            </button>
          </div>
        </form>
      </div>

      <div className="editor-footer">
        <span className="status-message">
          {loading ? "Verifying credentials..." : "Enter admin credentials"}
        </span>
        <span className="cursor-indicator">_</span>
      </div>
    </div>
  );
};

export default Login;