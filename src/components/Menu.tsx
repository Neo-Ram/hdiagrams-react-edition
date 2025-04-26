import Card from "./Card";
import "./Menu.css";
import { useNavigate } from "react-router-dom";
import Carousel from "react-bootstrap/Carousel";
import * as UI from "./Inputs";

const Menu = () => {
  const navigate = useNavigate();

  const handleNavigateToDSecuencia = () => {
    console.log("Navegando a /DSecuencia");
    navigate("/DSecuencia");
  };
  const handleNavigateToDClases = () => {
    console.log("Navegando a /DClases");
    navigate("/DClases");
  };
  const handleNavigateToDCU = () => {
    console.log("Navegando a /DCU");
    navigate("/DCU");
  };
  const handleNavigateToDComponentes = () => {
    console.log("Navegando a /DComponentes");
    navigate("/DComponentes");
  };
  const handleNavigateToDPaquetes = () => {
    console.log("Navegando a /DPaquetes");
    navigate("/DPaquetes");
  };
  return (
    <>
      <div className="carrusel">
        <Carousel>
          <Carousel.Item interval={2000}>
            <img
              className="d-block w-100"
              src="/Diagramas.png"
              alt="First slide"
            />
            <Carousel.Caption>
              <h3>No me convence Nomar que opinas?</h3>
              <p>Inserte texto</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item interval={2000}>
            <img
              className="d-block w-100"
              src="/Diagramas2.jpg"
              alt="Second slide"
            />
            <Carousel.Caption>
              <h3>No me convence nomar que opinas?</h3>
              <p>Texto de la segunda diapositiva.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item interval={2000}>
            <img
              className="d-block w-100"
              src="/Diagramas3.jpg"
              alt="Third slide"
            />
            <Carousel.Caption>
              <h3>Third slide label</h3>
              <p>Texto de la tercera diapositiva.</p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </div>
      <div className="menu-mitad">
        <UI.H2>Seleccione una opcion</UI.H2>
        <div className="cartitas">
          <Card
            titulo="Diagrama de Secuencia"
            parrafo="Crear un diagrama de secuencia UML"
            children="Crear"
            imagen="/redp.jpg"
            id="opcion1-btn"
            onClick={handleNavigateToDSecuencia}
          />
          <Card
            titulo="Diagrama de clases"
            parrafo="Crea un Diagrama de clases UML"
            children="Crear"
            imagen="/grayp.jpg"
            id="opcion2-btn"
            onClick={handleNavigateToDClases}
          />
          <Card
            titulo="Diagrama de casos de uso"
            parrafo="Crea un diagrama de casos de uso"
            children="Crear"
            imagen="/bluep.jpg"
            id="opcion3-btn"
            onClick={handleNavigateToDCU}
          />
          <Card
            titulo="Diagrama de componentes???"
            parrafo="Crear un diagrama de componentes? ortega?"
            children="Crear"
            imagen="/whitep.jpg"
            id="opcion1-btn"
            onClick={handleNavigateToDComponentes}
          />
          <Card
            titulo="Diagrama de paquetes"
            parrafo="Crear un diagrama de paquetes"
            children="Crear"
            imagen="/yelloup.jpg"
            id="opcion1-btn"
            onClick={handleNavigateToDPaquetes}
          />
        </div>
        <div className="menu-mitad2">
          <UI.H2>Mis Diagramas</UI.H2>
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
    </>
  );
};

export default Menu;
