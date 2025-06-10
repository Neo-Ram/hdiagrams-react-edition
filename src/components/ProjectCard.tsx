import React from "react";
import "./ProjectCard.css";
//import * as UI from "./Inputs";

interface ProjectCardProps {
  isNew?: boolean;
  project?: {
    id: string;
    name: string;
    description: string;
    createdAt: string;
  };
  onClick: () => void;
  onDelete?: (id: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  isNew,
  project,
  onClick,
  onDelete,
}) => {
  if (isNew) {
    return (
      <div className="project-card new-project" onClick={onClick}>
        <div className="project-card-content">
          <span className="add-icon">+</span>
          <h2>Crear Nuevo Proyecto</h2>
          <p>Comienza un nuevo conjunto de diagramas</p>
        </div>
      </div>
    );
  }

  return (
    <div className="project-card" onClick={onClick}>
      {/* Botón de borrar */}
      <button
        className="delete-project-btn"
        title="Borrar proyecto"
        onClick={(e) => {
          e.stopPropagation(); // Evita que se dispare el onClick de la tarjeta
          if (window.confirm("¿Seguro que deseas borrar este proyecto?")) {
            if (onDelete && project) {
              onDelete(project.id);
            }
          }
        }}
      >
        🗑️
      </button>

      <div className="project-card-content">
        <h2>{project?.name}</h2>
        <p>{project?.description}</p>
        <div className="project-meta">
          <span>
            Creado: {new Date(project?.createdAt || "").toLocaleDateString()}
          </span>
          <div className="diagram-indicators">
            <span className="indicator" title="Diagrama de Secuencia">
              DS
            </span>
            <span className="indicator" title="Diagrama de Clases">
              DC
            </span>
            <span className="indicator" title="Diagrama de Casos de Uso">
              DCU
            </span>
            <span className="indicator" title="Diagrama de Componentes">
              DCO
            </span>
            <span className="indicator" title="Diagrama de Paquetes">
              DP
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
