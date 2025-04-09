import Card from "./Card";
import "./Menu.css";
import { useNavigate } from "react-router-dom";

const Menu = () => {
  const navigate = useNavigate();

  const handleNavigateToDSecuencia = () => {
    console.log("Navegando a /DSecuencia");
    navigate("/DSecuencia");
  };

  return (
    <div className="menu-mitad">
      <h2>Seleccione una opción</h2>
      <div className="cartitas">
        <Card
          titulo="Diagrama de Secuencia"
          parrafo="Crear un diagrama de secuencia UML"
          children="Crear"
          imagen=""
          id="opcion1-btn"
          onClick={handleNavigateToDSecuencia}
        />
        <Card
          titulo="Opción 2"
          parrafo="Descripción 2"
          children="Crear"
          imagen=""
          id="opcion2-btn"
        />
        <Card
          titulo="Opción 3"
          parrafo="Descripción 3"
          children="Crear"
          imagen=""
          id="opcion3-btn"
        />
      </div>
      <div className="menu-mitad">
        <h2>Mis diagramas</h2>
        <div className="cartitas">
          <Card
            titulo="Opción 1"
            parrafo="Descripción 1"
            children="Crear"
            imagen=""
            id="mis-diagramas-btn"
          />
        </div>
      </div>
    </div>
  );
};

export default Menu;
