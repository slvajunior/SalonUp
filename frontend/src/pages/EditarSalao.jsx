import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditarSalao = () => {
  const { id } = useParams(); // Pegando o ID da URL
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: "",
    cnpj: "",
    endereco: "",
  });

  useEffect(() => {
    // Aqui você faz a requisição para pegar os dados do salão com o ID
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
          setFormData(data); // Atualiza o estado com os dados do salão
        } else {
          console.error("Erro ao buscar os dados do salão");
        }
      } catch (error) {
        console.error("Erro ao buscar os dados do salão:", error);
      }
    };

    fetchData();
  }, [id]);

  // Alteração do estado do formulário (igual ao handleInputChange do AdicionarSalao)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/admin-panel/api/saloes/${id}/`,
        {
          method: "PUT", // Mudança de método para PUT para edição
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        navigate("/admin/saloes"); // Redireciona para a lista de salões após salvar
      } else {
        console.error("Erro ao editar salão:", await response.json());
      }
    } catch (error) {
      console.error("Erro ao editar salão:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Editar Salão
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Salão
            </label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleInputChange} // Usando o mesmo handleInputChange
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CNPJ
            </label>
            <input
              type="text"
              name="cnpj"
              value={formData.cnpj}
              onChange={handleInputChange} // Usando o mesmo handleInputChange
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Endereço
            </label>
            <input
              type="text"
              name="endereco"
              value={formData.endereco}
              onChange={handleInputChange} // Usando o mesmo handleInputChange
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={() => navigate("/admin/saloes")}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarSalao;
