import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000', // URL do seu backend Django
});

export const getAgendamentos = () => api.get('/api/agendamentos/');
export const createAgendamento = (data) => api.post('/api/agendamentos/', data);
// Adicione outras chamadas conforme necessário