import { useNavigate, useParams } from "react-router-dom";
import Card from "./Card";
import { useEffect, useState } from "react";

const ProjectDiagrams = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [projectName, setProjectName] = useState("Cargando...");


  useEffect(() => {
    // Cambia la URL por la de tu backend real
    fetch(`http://localhost:3000/projects/${projectId}`)
      .then((res) => res.json())
      .then((data) => setProjectName(data.name))
      .catch(() => setProjectName("Proyecto no encontrado"));
  }, [projectId]);

  return (
    <div>
      <div className="project-header" style={{ textAlign: "center", margin: "20px 0" }}>
        <h2>Proyecto: {projectName}</h2>
        <button
          style={{ marginTop: 10 , width:300}}
          onClick={() => navigate("/menu")}
        >
          Volver al Menú Principal
        </button>
      </div>

    <div className="cartitas">
      <Card
        titulo="Diagrama de Secuencia"
        parrafo="Muestra cómo los objetos interactúan en el tiempo a través de mensajes ordenados."
        children="Crear"
        imagen="/redp.jpg"
        id="opcion1-btn"
        onClick={() => navigate(`/project/${projectId}/sequence`)}
      />
      <Card
        titulo="Diagrama de clases"
        parrafo="Representa las clases del sistema, sus atributos, métodos y relaciones entre ellas."
        children="Crear"
        imagen="/grayp.jpg"
        id="opcion2-btn"
        onClick={() => navigate(`/project/${projectId}/class`)}
      />
      <Card
        titulo="Diagrama de casos de uso"
        parrafo="Describe las funcionalidades del sistema desde el punto de vista del usuario."
        children="Crear"
        imagen="/bluep.jpg"
        id="opcion3-btn"
        onClick={() => navigate(`/project/${projectId}/usecase`)}
      />
      <Card
        titulo="Diagrama de componentes"
        parrafo="Muestra cómo se organizan e interconectan los componentes del software."
        children="Crear"
        imagen="/whitep.jpg"
        id="opcion4-btn"
        onClick={() => navigate(`/project/${projectId}/component`)}
      />
      <Card
        titulo="Diagrama de paquetes"
        parrafo="Organiza y agrupa clases o componentes en paquetes lógicos para simplificar la estructura."
        children="Crear"
        imagen="/yelloup.jpg"
        id="opcion5-btn"
        onClick={() => navigate(`/project/${projectId}/package`)}
      />
    </div>
    </div>
  );
};

export default ProjectDiagrams;