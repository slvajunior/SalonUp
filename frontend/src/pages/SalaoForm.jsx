import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';  // Corrigido aqui
// Outras importações...

const SalaoForm = ({ isEdit }) => {
  const { id } = useParams();  // Agora 'useParams' está definido
  const [salao, setSalao] = useState({
    nome: "",
    cnpj: "",
    endereco: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isEdit && id) {
      const token = localStorage.getItem("token");
      fetch(`http://127.0.0.1:8000/admin-panel/api/saloes/${id}/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => setSalao(data))
        .catch((err) => setError("Erro ao carregar os dados do salão"));
    }
  }, [isEdit, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const url = isEdit
      ? `http://127.0.0.1:8000/admin-panel/api/saloes/${id}/`
      : "http://127.0.0.1:8000/admin-panel/api/saloes/";

    const method = isEdit ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(salao),
      });

      if (response.ok) {
        navigate("/saloes");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Erro ao salvar salão");
      }
    } catch (err) {
      setError("Erro ao conectar com o servidor");
    }
  };

  return (
    <div>
      <h1>{isEdit ? "Editar Salão" : "Adicionar Novo Salão"}</h1>
      {error && <div>{error}</div>}
      <form onSubmit={handleSubmit}>
        <label>
          Nome do Salão:
          <input
            type="text"
            value={salao.nome}
            onChange={(e) => setSalao({ ...salao, nome: e.target.value })}
          />
        </label>
        <label>
          CNPJ:
          <input
            type="text"
            value={salao.cnpj}
            onChange={(e) => setSalao({ ...salao, cnpj: e.target.value })}
          />
        </label>
        <label>
          Endereço:
          <input
            type="text"
            value={salao.endereco}
            onChange={(e) => setSalao({ ...salao, endereco: e.target.value })}
          />
        </label>
        <button type="submit">{isEdit ? "Salvar" : "Adicionar"}</button>
      </form>
    </div>
  );
};

export default SalaoForm;
