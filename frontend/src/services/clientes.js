// src/services/clientes.js
import api from './api';

export const getClientes = async () => {
  try {
    const response = await api.get('clientes/');
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar clientes", error);
    throw error;
  }
};

export const createCliente = async (clienteData) => {
  try {
    const response = await api.post('clientes/', clienteData);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar cliente", error);
    throw error;
  }
};

export const updateCliente = async (id, clienteData) => {
  try {
    const response = await api.put(`clientes/${id}/`, clienteData);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar cliente", error);
    throw error;
  }
};

export const deleteCliente = async (id) => {
  try {
    await api.delete(`clientes/${id}/`);
  } catch (error) {
    console.error("Erro ao excluir cliente", error);
    throw error;
  }
};
