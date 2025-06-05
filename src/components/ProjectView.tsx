import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from './Card';
import './ProjectView.css';
import * as UI from "./Inputs";

interface ProjectViewProps {
  project: {
    id: string;
    name: string;
    description: string;
  };
}

const ProjectView: React.FC<ProjectViewProps> = ({ project }) => {
  const navigate = useNavigate();

  const diagrams = [
    {
      id: 'sequence',
      title: 'Diagrama de Secuencia',
      description: 'Muestra cómo los objetos interactúan en el tiempo a través de mensajes ordenados.',
      image: '/redp.jpg',
      route: `/project/${project.id}/sequence`
    },
    {
      id: 'class',
      title: 'Diagrama de Clases',
      description: 'Representa las clases del sistema, sus atributos, métodos y relaciones entre ellas.',
      image: '/grayp.jpg',
      route: `/project/${project.id}/class`
    },
    {
      id: 'usecase',
      title: 'Diagrama de Casos de Uso',
      description: 'Describe las funcionalidades del sistema desde el punto de vista del usuario.',
      image: '/bluep.jpg',
      route: `/project/${project.id}/usecase`
    },
    {
      id: 'component',
      title: 'Diagrama de Componentes',
      description: 'Muestra cómo se organizan e interconectan los componentes del software.',
      image: '/whitep.jpg',
      route: `/project/${project.id}/component`
    },
    {
      id: 'package',
      title: 'Diagrama de Paquetes',
      description: 'Organiza y agrupa clases o componentes en paquetes lógicos para simplificar la estructura.',
      image: '/yelloup.jpg',
      route: `/project/${project.id}/package`
    }
  ];

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