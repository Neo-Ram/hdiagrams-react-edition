import React from 'react';
import './DiagramCard.css';

interface DiagramCardProps {
  titulo: string;
  parrafo: string;
  children: string;
  imagen: string;
  id: string;
  onClick: () => void;
}

const DiagramCard: React.FC<DiagramCardProps> = ({
  titulo,
  parrafo,
  children,
  imagen,
  id,
  onClick,
}) => {
  return (
    <div
      id={id}
      onClick={onClick}
      className="card"
      style={{
        background: `url(${imagen})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="card-content">
        <h3>{titulo}</h3>
        <p>{parrafo}</p>
        <button className="card-button">{children}</button>
      </div>
    </div>
  );
};

export default DiagramCard; 