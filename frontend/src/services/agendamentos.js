import api from './api';

export const getAgendamentos = async () => {
  try {
    const response = await api.get('agendamentos/');
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar agendamentos", error);
    throw error;
  }
};

export const createAgendamento = async (agendamentoData) => {
  try {
    const response = await api.post('agendamentos/', agendamentoData);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar agendamento", error);
    throw error;
  }
};

export const updateAgendamento = async (id, agendamentoData) => {
  try {
    const response = await api.put(`agendamentos/${id}/`, agendamentoData);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar agendamento", error);
    throw error;
  }
};

export const deleteAgendamento = async (id) => {
  try {
    await api.delete(`agendamentos/${id}/`);
  } catch (error) {
    console.error("Erro ao excluir agendamento", error);
    throw error;
  }
};
