import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [focused, setFocused] = useState(false);
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();
  const passwordRef = useRef(null);

  // Username fixo como constante
  const fixedUsername = "johnf";

  // Atualiza o relógio a cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Mostra campo de senha ao pressionar Enter
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && !showPasswordField) {
        setShowPasswordField(true);
        setTimeout(() => passwordRef.current.focus(), 100);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showPasswordField]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: fixedUsername,
          password: senha,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);
        localStorage.setItem("user_name", fixedUsername); // Armazena o username
        navigate("/admin");
      } else {
        setError("Senha incorreta!");
        setSenha("");
        passwordRef.current.focus();
      }
    } catch (error) {
      setError("Erro de conexão com o servidor");
    } finally {
      setLoading(false);
    }
  };

  // Formatação da data e hora
  const formattedTime = currentTime.toLocaleTimeString('pt-BR', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false
  });

  const formattedDate = currentTime.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Saudação baseada no horário
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  return (
    <div className="login-container">
      {/* Relógio centralizado no topo */}
      <div className="login-clock">
        <div className="time">{formattedTime}</div>
        <div className="date">{formattedDate}</div>
      </div>

      <div className="login-box">
        {/* Avatar e saudação */}
        <div className="user-greeting">
          <div className="user-avatar">
            <img 
              src="/avatar-admin.jpg"
              alt="Admin"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJ3aGl0ZSI+PHBhdGggZD0iTTEyIDJDNi40NzkgMiAyIDYuNDc5IDIgMTJzNC40NzkgMTAgMTAgMTAgMTAtNC40NzkgMTAtMTBTMTcuNTIxIDIgMTIgMnptMCAyYzIuMjEgMCA0LjIxLjg5IDUuNjUgMi4zNUwxMiAxMmw1LjY1LTUuNjVDMTYuMjEgNC44OSAxNC4yMSA0IDEyIDR6TTQgMTJjMC0yLjIxLjg5LTQuMjEgMi4zNS01LjY1TDEyIDEwbDUuNjUgNS42NUMxNi4yMSAxOS4xMSAxNC4yMSAyMCAxMiAyMHMtMi4yMS0uODktNS42NS0yLjM1TDEyIDEybC01LjY1IDUuNjVDNC44OSAxNi4yMSA0IDE0LjIxIDQgMTJ6bTguNjUgNS42NUMxNC4yMSAxOS4xMSAxMi4yMSAyMCAxMiAyMHMtMi4yMS0uODktNS42NS0yLjM1TDEyIDEybDUuNjUgNS42NXpNMTIgMTRjLTEuMTA0IDAtMi0uODk2LTItMnMuODk2LTIgMi0yIDIgLjg5NiAyIDItLjg5NiAyLTIgMnoiLz48L3N2Zz4=";
              }}
            />
          </div>
          <div className="greeting-text">
            <h2>{getGreeting()}, <strong className="usuarioAdmin">{fixedUsername}!</strong></h2> 
          </div>
        </div>

        {/* Instrução inicial */}
        {!showPasswordField && (
          <div className="login-instruction">
            <div className="enter-key-container">
              <div className="enter-key">⎆</div>
            </div>
            <div className="instruction-text">Pressione Enter para continuar</div>
          </div>
        )}

        {/* Campo de senha (aparece após pressionar Enter) */}
        {showPasswordField && (
          <form onSubmit={handleLogin} className="login-form">
            <div className={`password-field ${focused ? "focused" : ""} ${error ? "error" : ""}`}>
              <input
                type="password"
                ref={passwordRef}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="Digite sua senha"
                autoComplete="new-password"
              />
              {loading && <div className="loading-indicator"></div>}
            </div>
            {error && <div className="error-message">{error}</div>}
          </form>
        )}

        {/* Dica (quando o campo de senha estiver visível) */}
        {showPasswordField && (
          <div className="login-hint">
            Pressione Enter para acessar
          </div>
        )}
      </div>

      {/* Rodapé */}
      <div className="login-footer">
        <span>salonUp PRO</span>
        <span>v2.0</span>
        <span>{currentTime.toLocaleDateString()}</span>
      </div>
    </div>
  );
};

export default Login;