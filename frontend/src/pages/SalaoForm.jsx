import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import "./SalaoForm.css";


const SalaoForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    cnpj: '',
    endereco: '',
    status: 'ativo'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Função para carregar os dados do salão
  const fetchSalao = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`http://127.0.0.1:8000/admin-panel/api/saloes/${id}/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        // Token inválido ou expirado
        localStorage.removeItem('access_token');
        navigate('/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Erro ao carregar dados do salão');
      }

      const data = await response.json();
      setFormData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalao();
  }, [id]);

  // Função para lidar com mudanças no formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Função para enviar o formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`http://127.0.0.1:8000/admin-panel/api/saloes/${id}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.status === 401) {
        localStorage.removeItem('access_token');
        navigate('/login');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erro ao atualizar salão');
      }

      navigate('/admin/saloes');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div className="form-container">
      <h2>Editar Salão</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nome:</label>
          <input
            type="text"
            name="nome"
            value={formData.nome || ''}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>CNPJ:</label>
          <input
            type="text"
            name="cnpj"
            value={formData.cnpj || ''}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Endereço:</label>
          <input
            type="text"
            name="endereco"
            value={formData.endereco || ''}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Status:</label>
          <select
            name="status"
            value={formData.status || 'ativo'}
            onChange={handleChange}
          >
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
          </select>
        </div>

        <button type="submit" className="btn-save">Salvar</button>
        <button 
          type="button" 
          onClick={() => navigate('/admin/saloes')} 
          className="btn-cancel"
        >
          Cancelar
        </button>
      </form>
    </div>
  );
};

export default SalaoForm;