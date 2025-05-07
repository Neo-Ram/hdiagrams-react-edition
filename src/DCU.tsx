import { useState, useCallback, useRef, DragEvent } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  NodeTypes,
  BackgroundVariant,
  ReactFlowInstance,
} from "reactflow";
import { useNavigate } from "react-router-dom";
import "reactflow/dist/style.css";
import ActorNode from "./components/ActorNode";
import UseCaseNode from "./components/UseCaseNode";
import SystemNode from "./components/SystemNode";
import WorkAreaNode from "./components/WorkAreaNode";
import Sidebar from "./components/Sidebar";

const nodeTypes: NodeTypes = {
  actor: ActorNode,
  usecase: UseCaseNode,
  system: SystemNode,
  workarea: WorkAreaNode,
};

let id = 0;
const getId = () => `${++id}`;

const initialNodes: Node[] = [];

const DCU = () => {
  const navigate = useNavigate();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);
  const [title, setTitle] = useState("Diagrama de Casos de Uso");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const handleBack = () => {
    navigate("/menu");
  };

  const onConnect = useCallback(
    (params: Connection | Edge) => {
      const edge = {
        ...params,
        style: { stroke: "#333", strokeWidth: 2 },
        animated: false,
      };
      setEdges((eds: Edge[]) => addEdge(edge, eds));
    },
    [setEdges]
  );

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();

      if (!reactFlowWrapper.current || !reactFlowInstance) {
        return;
      }

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");
      const name = event.dataTransfer.getData("nodeName");

      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: name },
        style: {
          ...(type === "workarea" && {
            width: 200,
            height: 100,
            zIndex: 0,
          }),
          ...(type === "actor" && {
            zIndex: 2,
          }),
          ...(type === "usecase" && {
            zIndex: 2,
          }),
        },
      };

      setNodes((nds: Node[]) => [...nds, newNode]);
    },
    [reactFlowInstance, setNodes]
  );

  const handleImportJSON = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const jsonData = JSON.parse(event.target?.result as string);
            if (jsonData.nodes && jsonData.edges) {
              setNodes(jsonData.nodes);
              setEdges(jsonData.edges);
              if (jsonData.title) {
                setTitle(jsonData.title);
              }
            } else {
              alert('El archivo JSON debe contener "nodes" y "edges"');
            }
          } catch (error: unknown) {
            alert(
              `Error al procesar el archivo JSON: ${
                error instanceof Error ? error.message : "Error desconocido"
              }`
            );
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }, [setNodes, setEdges, setTitle]);

  const handleExportJSON = useCallback(() => {
    if (nodes.length === 0) {
      alert("No hay elementos para exportar");
      return;
    }

    const jsonData = {
      nodes,
      edges,
      title,
    };

    const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${title.replace(/\s+/g, "_")}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [nodes, edges, title]);

  const HelpModal = () => {
    if (!showHelp) return null;

    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            maxWidth: "600px",
            width: "90%",
            maxHeight: "80vh",
            overflowY: "auto",
            position: "relative",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <button
            onClick={() => setShowHelp(false)}
            style={{
              position: "absolute",
              right: "10px",
              top: "10px",
              border: "none",
              background: "none",
              fontSize: "20px",
              cursor: "pointer",
              padding: "5px",
              color: "#666",
            }}
          >
            ×
          </button>
          <h2 style={{ marginBottom: "20px", color: "#333" }}>Guía de Uso</h2>

          <div style={{ marginBottom: "20px" }}>
            <h3 style={{ color: "#4a90e2", marginBottom: "10px" }}>
              Elementos Básicos
            </h3>
            <ul style={{ paddingLeft: "20px", lineHeight: "1.6" }}>
              <li>
                Arrastra y suelta elementos desde la barra lateral al área de
                trabajo
              </li>
              <li>Haz doble clic en cualquier título para editarlo</li>
              <li>Selecciona y arrastra elementos para moverlos</li>
            </ul>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <h3 style={{ color: "#4a90e2", marginBottom: "10px" }}>
              Áreas de Trabajo
            </h3>
            <ul style={{ paddingLeft: "20px", lineHeight: "1.6" }}>
              <li>
                Puedes redimensionar las áreas de trabajo arrastrando sus bordes
              </li>
              <li>El título se puede editar con doble clic</li>
            </ul>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <h3 style={{ color: "#4a90e2", marginBottom: "10px" }}>
              Importar/Exportar
            </h3>
            <ul style={{ paddingLeft: "20px", lineHeight: "1.6" }}>
              <li>
                Usa el botón "Importar JSON" para cargar un diagrama guardado
              </li>
              <li>
                Usa el botón "Exportar JSON" para guardar tu diagrama actual
              </li>
            </ul>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <h3 style={{ color: "#4a90e2", marginBottom: "10px" }}>
              Controles Adicionales
            </h3>
            <ul style={{ paddingLeft: "20px", lineHeight: "1.6" }}>
              <li>Usa la rueda del ratón para hacer zoom</li>
              <li>
                Mantén presionado el botón derecho del ratón para mover el
                lienzo
              </li>
              <li>Utiliza el minimapa para navegar por diagramas grandes</li>
            </ul>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <HelpModal />
      <div
        style={{
          padding: "10px",
          backgroundColor: "#f0f0f0",
          borderBottom: "1px solid #ccc",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <button
          onClick={handleBack}
          style={{
            padding: "8px 16px",
            backgroundColor: "var(--morado)",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "var(--moradoSec)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "var(--morado)")
          }
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
              fill="currentColor"
            />
          </svg>
          Volver
        </button>
        <div style={{ flex: 1 }}>
          {isEditingTitle ? (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => setIsEditingTitle(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setIsEditingTitle(false);
                }
              }}
              autoFocus
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                textAlign: "center",
                border: "none",
                outline: "none",
                background: "transparent",
                width: "50%",
                padding: "5px",
              }}
            />
          ) : (
            <h1
              style={{
                margin: 0,
                fontSize: "20px",
                fontWeight: "bold",
                cursor: "pointer",
                textAlign: "center",
              }}
              onDoubleClick={() => setIsEditingTitle(true)}
            >
              {title}
            </h1>
          )}
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => setShowHelp(true)}
            style={{
              padding: "8px 16px",
              backgroundColor: "var(--morado)",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--moradoSec)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--morado)")
            }
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"
                fill="currentColor"
              />
            </svg>
            Ayuda
          </button>
          <button
            onClick={handleImportJSON}
            style={{
              padding: "8px 16px",
              backgroundColor: "var(--morado)",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--moradoSec)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--morado)")
            }
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"
                fill="currentColor"
              />
            </svg>
            Importar JSON
          </button>
          <button
            onClick={handleExportJSON}
            style={{
              padding: "8px 16px",
              backgroundColor: "var(--morado)",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--moradoSec)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--morado)")
            }
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"
                fill="currentColor"
                transform="rotate(180 12 12)"
              />
            </svg>
            Exportar JSON
          </button>
        </div>
      </div>
      <div style={{ display: "flex", flex: 1 }}>
        <Sidebar />
        <div ref={reactFlowWrapper} style={{ flex: 1, height: "100%" }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            fitView
          >
            <Controls />
            <MiniMap />
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
};

export default DCU;
