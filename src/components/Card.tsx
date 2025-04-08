import { ReactNode } from "react";
import Button1 from "./Inputs";
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
      <img src={imagen} alt="" />
      <h1>{titulo}</h1>
      <p>{parrafo}</p>
      <Button1 id={id} onClick={onClick}>
        {children}
      </Button1>
    </div>
  );
};

export default Card;
