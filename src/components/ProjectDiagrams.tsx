import { useNavigate, useParams } from "react-router-dom";
import Card from "./Card";
import { useEffect, useState } from "react";

const ProjectDiagrams = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [projectName, setProjectName] = useState("Cargando...");

  useEffect(() => {
    fetch(`http://localhost:3000/projects/${projectId}`)
      .then((res) => res.json())
      .then((data) => setProjectName(data.name))
      .catch(() => setProjectName("Proyecto no encontrado"));
  }, [projectId]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px 32px",
          background: "#fff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          borderRadius: "0 0 12px 12px",
          marginBottom: 30,
        }}
      >
        <h2 style={{ margin: 0, color: "#333" }}>Proyecto: {projectName}</h2>
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            style={{
              padding: "8px 32px",
              fontSize: "16px",
              borderRadius: "4px",
              background: "#111",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              letterSpacing: "0.5px",
              fontWeight: 500,
              minWidth: "180px",
            }}
            onClick={() => navigate("/menu")}
          >
            Volver al Menú Principal
          </button>
          <button
            style={{
              padding: "6px 18px",
              fontSize: "15px",
              borderRadius: "4px",
              background: "#4f46e5",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
            onClick={() => alert("Funcionalidad de generar proyecto")}
          >
            Generar Proyecto
          </button>
        </div>
      </div>

      {/* CARTAS */}
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
