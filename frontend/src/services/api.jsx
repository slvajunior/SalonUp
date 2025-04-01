import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/", // URL base do seu backend
  headers: {
    "Content-Type": "application/json",
  },
});

// Função para buscar agendamentos
export const getAgendamentos = async () => {
  try {
    const response = await api.get("agendamentos/");
    return response.data; // Retorna os dados da API
  } catch (error) {
    console.error("Erro ao buscar agendamentos:", error);
    return []; // Retorna um array vazio em caso de erro
  }
};

export default api;
