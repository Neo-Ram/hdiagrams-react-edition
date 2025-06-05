import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CreateProjectModal.css';

interface CreateProjectModalProps {
  onClose: () => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Por ahora solo simulamos la creación del proyecto
      // Aquí después conectaremos con el backend
      console.log('Creando proyecto:', { name, description });
      
      // Simulamos un delay para ver el estado de loading
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Por ahora navegamos a una ruta temporal
      onClose();
      navigate('/project/1');
    } catch (error) {
      console.error('Error al crear el proyecto:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="modal-content">
        <h2>Crear Nuevo Proyecto</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre del Proyecto</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ingrese el nombre del proyecto"
              required
            />
          </div>
          <div className="form-group">
            <label>Descripción</label>
            <textarea
              className="description-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describa brevemente el proyecto"
              rows={4}
            />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" disabled={loading}>
              {loading ? 'Creando...' : 'Crear Proyecto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal; 