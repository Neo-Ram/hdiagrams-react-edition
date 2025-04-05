import { ReactNode } from "react";
import Button1 from "./Inputs";

type CardProps = {
  children: ReactNode;
  titulo: string;
  parrafo: string;
  imagen: string;
};

const Card = ({ children, titulo, parrafo, imagen }: CardProps) => {
  return (
    <div>
      <img src={imagen} alt="" />
      <h1>{titulo}</h1>
      <p>{parrafo}</p>
      <Button1>{children}</Button1>
    </div>
  );
};

export default Card;
