import { useNavigate, useParams } from "react-router-dom";
import Card from "./Card";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import "./ProjectDiagrams.css";

interface GeneratedFile {
  path: string;
  content: string;
}

interface GeneratedCode {
  files: GeneratedFile[];
}

const ProjectDiagrams = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [projectName, setProjectName] = useState("Cargando...");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<GeneratedCode | null>(null);

  useEffect(() => {
    fetch(`http://localhost:3000/projects/${projectId}`)
      .then((res) => res.json())
      .then((data) => setProjectName(data.name))
      .catch(() => setProjectName("Proyecto no encontrado"));
  }, [projectId]);

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      console.log('Iniciando generación de proyecto...');
      
      // Obtener los diagramas del proyecto
      const diagramsResponse = await fetch(`http://localhost:3000/projects/${projectId}/diagrams`);
      if (!diagramsResponse.ok) {
        const errorData = await diagramsResponse.json();
        throw new Error(errorData.message || 'Error al obtener los diagramas');
      }
      const diagrams = await diagramsResponse.json();
      console.log('Diagramas disponibles:', diagrams);
      
      if (!diagrams || Object.keys(diagrams).length === 0) {
        console.error('No hay diagramas disponibles');
        toast.error('No hay diagramas disponibles para generar el proyecto');
        return;
      }

      const response = await fetch('http://localhost:3000/gemini/generate-project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ diagrams }),
      });

      console.log('Respuesta del servidor:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Error del servidor:', errorData);
        throw new Error(errorData?.message || 'Error al generar el proyecto');
      }

      const data = await response.json();
      console.log('Datos recibidos del servidor:', data);

      if (typeof data === 'string') {
        try {
          const parsedData = JSON.parse(data);
          setGeneratedCode(parsedData);
        } catch (error: unknown) {
          console.error('Error al parsear la respuesta:', error);
          throw new Error('La respuesta del servidor no es un JSON válido');
        }
      } else {
        setGeneratedCode(data);
      }

      setShowModal(true);
      toast.success('Proyecto generado exitosamente');
    } catch (error: unknown) {
      console.error('Error al generar el proyecto:', error);
      toast.error(error instanceof Error ? error.message : 'Error al generar el proyecto');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadZip = async () => {
    try {
      if (!generatedCode) {
        throw new Error('No hay código generado para descargar');
      }

      const response = await fetch('http://localhost:3000/gemini/generate-zip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ files: generatedCode.files }),
      });

      if (!response.ok) {
        throw new Error('Error al generar el archivo ZIP');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${projectName}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Archivo ZIP descargado exitosamente');
    } catch (error: unknown) {
      console.error('Error downloading ZIP:', error);
      toast.error(error instanceof Error ? error.message : 'Error al descargar el archivo ZIP');
    }
  };

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
              opacity: isGenerating ? 0.7 : 1,
              position: "relative",
              paddingLeft: isGenerating ? "2.5rem" : "18px",
            }}
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating && (
              <span
                style={{
                  position: "absolute",
                  left: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "1rem",
                  height: "1rem",
                  border: "2px solid #fff",
                  borderTopColor: "transparent",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                }}
              />
            )}
            {isGenerating ? "Generando..." : "Generar Proyecto"}
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

      {showModal && generatedCode && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Código Generado</h3>
              <button className="close-button" onClick={() => setShowModal(false)}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="code-preview">
                <div className="files-list">
                  {generatedCode.files.map((file, index) => (
                    <div key={index} className="file-item">
                      <h4>{file.path}</h4>
                      <pre>{file.content}</pre>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="download-button" onClick={handleDownloadZip}>
                <span>Descargar ZIP</span>
                <span>📦</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDiagrams;
