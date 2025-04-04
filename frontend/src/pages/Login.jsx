import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [focused, setFocused] = useState(false);
  const navigate = useNavigate();
  const passwordRef = useRef(null);

  // Auto-foco no campo de senha
  useEffect(() => {
    passwordRef.current.focus();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "johnf", // Usuário fixo
          password: senha,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);
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

  return (
    <div className="login-container">
      <div className="login-box">
        {/* Avatar do usuário */}
        <div className="user-avatar">
          <img 
            src="/avatar-admin.png"
            alt="Admin"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJ3aGl0ZSI+PHBhdGggZD0iTTEyIDJDNi40NzkgMiAyIDYuNDc5IDIgMTJzNC40NzkgMTAgMTAgMTAgMTAtNC40NzkgMTAtMTBTMTcuNTIxIDIgMTIgMnptMCAyYzIuMjEgMCA0LjIxLjg5IDUuNjUgMi4zNUwxMiAxMmw1LjY1LTUuNjVDMTYuMjEgNC44OSAxNC4yMSA0IDEyIDR6TTQgMTJjMC0yLjIxLjg5LTQuMjEgMi4zNS01LjY1TDEyIDEwbDUuNjUgNS42NUMxNi4yMSAxOS4xMSAxNC4yMSAyMCAxMiAyMHMtMi4yMS0uODktNS42NS0yLjM1TDEyIDEybC01LjY1IDUuNjVDNC44OSAxNi4yMSA0IDE0LjIxIDQgMTJ6bTguNjUgNS42NUMxNC4yMSAxOS4xMSAxMi4yMSAyMCAxMiAyMHMtMi4yMS0uODktNS42NS0yLjM1TDEyIDEybDUuNjUgNS42NXpNMTIgMTRjLTEuMTA0IDAtMi0uODk2LTItMnMuODk2LTIgMi0yIDIgLjg5NiAyIDItLjg5NiAyLTIgMnoiLz48L3N2Zz4=";
            }}
          />
          <div className="username">admin</div>
        </div>

        {/* Campo de senha */}
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

        {/* Dica */}
        <div className="login-hint">
          Pressione Enter para acessar o sistema
        </div>
      </div>

      {/* Rodapé */}
      <div className="login-footer">
        <span>salonUp PRO</span>
        <span>v2.0</span>
        <span>{new Date().toLocaleDateString()}</span>
      </div>
    </div>
  );
};

export default Login;