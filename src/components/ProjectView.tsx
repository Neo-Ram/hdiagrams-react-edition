import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Card from './Card';
import './ProjectView.css';
import * as UI from "./Inputs";
import Spinner from './Spinner';

interface Project {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

const ProjectView: React.FC = () => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/projects/${projectId}`);
        setProject(response.data);
      } catch (error) {
        console.error('Error al cargar el proyecto:', error);
        setError('Error al cargar el proyecto');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  const diagrams = [
    {
      id: 'sequence',
      title: 'Diagrama de Secuencia',
      description: 'Muestra cómo los objetos interactúan en el tiempo a través de mensajes ordenados.',
      image: '/redp.jpg',
      route: `/project/${projectId}/sequence`
    },
    {
      id: 'class',
      title: 'Diagrama de Clases',
      description: 'Representa las clases del sistema, sus atributos, métodos y relaciones entre ellas.',
      image: '/grayp.jpg',
      route: `/project/${projectId}/class`
    },
    {
      id: 'usecase',
      title: 'Diagrama de Casos de Uso',
      description: 'Describe las funcionalidades del sistema desde el punto de vista del usuario.',
      image: '/bluep.jpg',
      route: `/project/${projectId}/usecase`
    },
    {
      id: 'component',
      title: 'Diagrama de Componentes',
      description: 'Muestra cómo se organizan e interconectan los componentes del software.',
      image: '/whitep.jpg',
      route: `/project/${projectId}/component`
    },
    {
      id: 'package',
      title: 'Diagrama de Paquetes',
      description: 'Organiza y agrupa clases o componentes en paquetes lógicos para simplificar la estructura.',
      image: '/yelloup.jpg',
      route: `/project/${projectId}/package`
    }
  ];

  if (loading) return <Spinner />;
  if (error) return <div className="error-message">{error}</div>;
  if (!project) return <div className="error-message">Proyecto no encontrado</div>;

  return (
    <div className="project-view">
      <div className="project-header">
        <h1>{project.name}</h1>
        <p>{project.description}</p>
      </div>

      <div className="diagrams-grid">
        {diagrams.map(diagram => (
          <Card
            key={diagram.id}
            titulo={diagram.title}
            parrafo={diagram.description}
            children="Crear"
            imagen={diagram.image}
            id={`diagram-${diagram.id}`}
            onClick={() => navigate(diagram.route)}
          />
        ))}
      </div>
    </div>
  );
};

export default ProjectView; 