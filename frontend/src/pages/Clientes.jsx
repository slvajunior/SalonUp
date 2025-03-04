// src/pages/Clientes.jsx
import React, { useEffect, useState } from 'react';
import { getClientes, createCliente } from '../services/clientes';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [novoCliente, setNovoCliente] = useState({
    nome: '',
    email: '',
    telefone: '',
  });

  useEffect(() => {
    const fetchClientes = async () => {
      const data = await getClientes();
      setClientes(data);
    };
    fetchClientes();
  }, []);

  const handleCreateCliente = async () => {
    try {
      const clienteData = await createCliente(novoCliente);
      setClientes([...clientes, clienteData]);
    } catch (error) {
      alert('Erro ao criar cliente');
    }
  };

  return (
    <div>
      <h1>Clientes</h1>
      <input
        type="text"
        value={novoCliente.nome}
        onChange={(e) => setNovoCliente({ ...novoCliente, nome: e.target.value })}
        placeholder="Nome"
      />
      <input
        type="email"
        value={novoCliente.email}
        onChange={(e) => setNovoCliente({ ...novoCliente, email: e.target.value })}
        placeholder="Email"
      />
      <input
        type="text"
        value={novoCliente.telefone}
        onChange={(e) => setNovoCliente({ ...novoCliente, telefone: e.target.value })}
        placeholder="Telefone"
      />
      <button onClick={handleCreateCliente}>Criar Cliente</button>

      <ul>
        {clientes.map((cliente) => (
          <li key={cliente.id}>
            {cliente.nome} - {cliente.email} - {cliente.telefone}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Clientes;
