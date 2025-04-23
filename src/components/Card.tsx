import { ReactNode } from "react";
import * as UI from "./Inputs";
import "./Card.css";

type CardProps = {
  children: ReactNode;
  titulo: string;
  parrafo: string;
  imagen: string;
  id?: string;
  onClick?: () => void;
};

const Card = ({
  children,
  titulo,
  parrafo,
  imagen,
  id,
  onClick,
}: CardProps) => {
  return (
    <div className="card">
      {imagen && <img src={imagen} alt={titulo} />}
      <h1>{titulo}</h1>
      <p>{parrafo}</p>
      <UI.Button1 id={id} onClick={onClick}>
        {children}
      </UI.Button1>
    </div>
  );
};

export default Card;
