import Card from "./Card";
import "./Menu.css";
import { useNavigate } from "react-router-dom";
import Carousel from "react-bootstrap/Carousel";
import * as UI from "./Inputs";
import { useState, useEffect } from "react";
import Spinner from "./Spinner"; // Asegúrate de tener el spinner creado
import ProfileBar from "./ProfileBar";

const Menu = () => {
  const [loading, setLoading] = useState(true); // Inicialmente está cargando
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const userName = localStorage.getItem('userName');
    if (!userName) {
      navigate('/login');
    }
  }, [navigate]);

  // Manejo de navegación
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

  // Función para manejar el evento onLoad de las imágenes del carrusel
  const handleImageLoad = () => {
    setLoading(false); // Cuando todas las imágenes se hayan cargado, oculta el spinner
  };

  return (
    <>
      {loading && <Spinner />} {/* Muestra el spinner si está cargando */}
      <div className="menu-container">
        <ProfileBar />
        <div className="menu-content">
          <div className="carrusel">
            <Carousel>
              <Carousel.Item interval={2000}>
                <img
                  className="d-block w-100"
                  src="/Diagramas-transformed.png"
                  alt="First slide"
                  onLoad={handleImageLoad} // Llama a la función cuando la imagen se cargue
                />
                <Carousel.Caption>
                  <h3>La mejor herramienta para crear diagramas</h3>
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item interval={2000}>
                <img
                  className="d-block w-100"
                  src="/Diagramas2-transformed.jpeg"
                  alt="Second slide"
                  onLoad={handleImageLoad}
                />
                <Carousel.Caption>
                  <h3>O lo mas probable es que no</h3>
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item interval={2000}>
                <img
                  className="d-block w-100"
                  src="/Diagrama3-transformed.jpeg"
                  alt="Third slide"
                  onLoad={handleImageLoad}
                />
                <Carousel.Caption>
                  <h3>Pero existe 👍🏼</h3>
                </Carousel.Caption>
              </Carousel.Item>
            </Carousel>
          </div>

          <div className="menu-mitad">
            <UI.H2>Seleccione una opcion</UI.H2>
            <div className="cartitas">
              <Card
                titulo="Diagrama de Secuencia"
                parrafo="Muestra cómo los objetos interactúan en el tiempo a través de mensajes ordenados."
                children="Crear"
                imagen="/redp.jpg"
                id="opcion1-btn"
                onClick={handleNavigateToDSecuencia}
              />
              <Card
                titulo="Diagrama de clases"
                parrafo="Representa las clases del sistema, sus atributos, métodos y relaciones entre ellas."
                children="Crear"
                imagen="/grayp.jpg"
                id="opcion2-btn"
                onClick={handleNavigateToDClases}
              />
              <Card
                titulo="Diagrama de casos de uso"
                parrafo="Describe las funcionalidades del sistema desde el punto de vista del usuario."
                children="Crear"
                imagen="/bluep.jpg"
                id="opcion3-btn"
                onClick={handleNavigateToDCU}
              />
              <Card
                titulo="Diagrama de componentes???"
                parrafo="Muestra cómo se organizan e interconectan los componentes del software."
                children="Crear"
                imagen="/whitep.jpg"
                id="opcion1-btn"
                onClick={handleNavigateToDComponentes}
              />
              <Card
                titulo="Diagrama de paquetes"
                parrafo="Organiza y agrupa clases o componentes en paquetes lógicos para simplificar la estructura."
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
        </div>
      </div>
    </>
  );
};

export default Menu;
