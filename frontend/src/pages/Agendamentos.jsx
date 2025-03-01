// src/pages/Agendamentos.jsx
import React, { useEffect, useState } from 'react';
import { getAgendamentos } from '../services/api';

const Agendamentos = () => {
  const [agendamentos, setAgendamentos] = useState([]);

  useEffect(() => {
    const fetchAgendamentos = async () => {
      try {
        const response = await getAgendamentos();
        setAgendamentos(response.data);
      } catch (error) {
        console.error('Erro ao buscar agendamentos:', error);
      }
    };

    fetchAgendamentos();
  }, []);

  return (
    <div>
      <h1>Agendamentos</h1>
      <ul>
        {agendamentos.map((agendamento) => (
          <li key={agendamento.id}>{agendamento.nome}</li>
        ))}
      </ul>
    </div>
  );
};

export default Agendamentos;