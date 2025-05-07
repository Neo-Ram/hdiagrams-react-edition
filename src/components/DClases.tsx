import React, { useState, useCallback, useEffect } from "react";
import ReactFlow, {
  Node,
  Controls,
  Background,
  NodeTypes,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  NodeProps,
  MarkerType,
  Panel,
  Handle,
  Position,
  ConnectionMode,
} from "reactflow";
import { useNavigate } from "react-router-dom";
import "reactflow/dist/style.css";
import "./DClases.css";

interface ClassNodeData {
  name: string;
  attributes: string[];
  methods: string[];
}

type RelationType =
  | "association"
  | "inheritance"
  | "aggregation"
  | "composition";

const relationColors = {
  association: "#3366FF",
  inheritance: "#FF3366",
  aggregation: "#33CC33",
  composition: "#9933CC",
};

const ClassNode: React.FC<NodeProps<ClassNodeData>> = ({ data, id }) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingAttr, setIsEditingAttr] = useState<number | null>(null);
  const [isEditingMethod, setIsEditingMethod] = useState<number | null>(null);
  const [newAttr, setNewAttr] = useState("");
  const [newMethod, setNewMethod] = useState("");

  const updateNodeData = (newData: Partial<ClassNodeData>) => {
    const storedNodes = JSON.parse(
      localStorage.getItem("diagramNodes") || "[]"
    );
    const updatedNodes = storedNodes.map((node: Node) =>
      node.id === id ? { ...node, data: { ...node.data, ...newData } } : node
    );
    localStorage.setItem("diagramNodes", JSON.stringify(updatedNodes));
    window.dispatchEvent(
      new CustomEvent("nodesUpdated", { detail: updatedNodes })
    );
  };

  const handleNameBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    updateNodeData({ name: e.target.value });
    setIsEditingName(false);
  };

  const handleAttrBlur = (
    index: number,
    e: React.FocusEvent<HTMLInputElement>
  ) => {
    const newAttributes = [...data.attributes];
    newAttributes[index] = e.target.value;
    updateNodeData({ attributes: newAttributes });
    setIsEditingAttr(null);
  };

  const handleMethodBlur = (
    index: number,
    e: React.FocusEvent<HTMLInputElement>
  ) => {
    const newMethods = [...data.methods];
    newMethods[index] = e.target.value;
    updateNodeData({ methods: newMethods });
    setIsEditingMethod(null);
  };

  const addAttribute = () => {
    if (newAttr.trim()) {
      updateNodeData({ attributes: [...data.attributes, newAttr] });
      setNewAttr("");
    }
  };

  const addMethod = () => {
    if (newMethod.trim()) {
      updateNodeData({ methods: [...data.methods, newMethod] });
      setNewMethod("");
    }
  };

  return (
    <div className="class-node">
      <Handle type="target" position={Position.Top} id="top-target" />
      <Handle type="source" position={Position.Top} id="top-source" />

      <Handle type="target" position={Position.Right} id="right-target" />
      <Handle type="source" position={Position.Right} id="right-source" />

      <Handle type="target" position={Position.Bottom} id="bottom-target" />
      <Handle type="source" position={Position.Bottom} id="bottom-source" />

      <Handle type="target" position={Position.Left} id="left-target" />
      <Handle type="source" position={Position.Left} id="left-source" />

      <div
        className="class-header"
        onDoubleClick={() => setIsEditingName(true)}
      >
        {isEditingName ? (
          <input defaultValue={data.name} onBlur={handleNameBlur} autoFocus />
        ) : (
          data.name
        )}
      </div>

      <div className="class-attributes">
        {data.attributes.map((attr, index) => (
          <div key={index} onDoubleClick={() => setIsEditingAttr(index)}>
            {isEditingAttr === index ? (
              <input
                defaultValue={attr}
                onBlur={(e) => handleAttrBlur(index, e)}
                autoFocus
              />
            ) : (
              attr
            )}
          </div>
        ))}
        <div className="add-item">
          <input
            value={newAttr}
            onChange={(e) => setNewAttr(e.target.value)}
            placeholder="+ Nuevo atributo"
            onKeyPress={(e) => e.key === "Enter" && addAttribute()}
          />
        </div>
      </div>

      <div className="class-methods">
        {data.methods.map((method, index) => (
          <div key={index} onDoubleClick={() => setIsEditingMethod(index)}>
            {isEditingMethod === index ? (
              <input
                defaultValue={method}
                onBlur={(e) => handleMethodBlur(index, e)}
                autoFocus
              />
            ) : (
              method
            )}
          </div>
        ))}
        <div className="add-item">
          <input
            value={newMethod}
            onChange={(e) => setNewMethod(e.target.value)}
            placeholder="+ Nuevo método"
            onKeyPress={(e) => e.key === "Enter" && addMethod()}
          />
        </div>
      </div>
    </div>
  );
};

const nodeTypes: NodeTypes = {
  classNode: ClassNode,
};

const initialNodes: Node[] = [
  {
    id: "1",
    type: "classNode",
    position: { x: 250, y: 5 },
    data: {
      name: "Clase Ejemplo",
      attributes: ["- atributo1: string", "- atributo2: number"],
      methods: ["+ metodo1(): void", "+ metodo2(param: string): number"],
    },
  },
];

const getRelationStyle = (type: RelationType) => {
  const color = relationColors[type];

  switch (type) {
    case "inheritance":
      return {
        type: "smoothstep",
        animated: false,
        style: { strokeWidth: 2, stroke: color },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: color,
        },
        className: "inheritance-edge",
      };
    case "aggregation":
      return {
        type: "smoothstep",
        animated: false,
        style: { strokeWidth: 2, stroke: color },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: color,
          strokeWidth: 2,
          style: { fill: "white", stroke: color },
        },
        className: "aggregation-edge",
      };
    case "composition":
      return {
        type: "smoothstep",
        animated: false,
        style: { strokeWidth: 2, stroke: color },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: color,
          style: { fill: color },
        },
        className: "composition-edge",
      };
    case "association":
    default:
      return {
        type: "smoothstep",
        animated: false,
        style: { strokeWidth: 2, stroke: color },
        markerEnd: {
          type: MarkerType.Arrow,
          width: 20,
          height: 20,
          color: color,
        },
        className: "association-edge",
      };
  }
};

const HelpModal = ({ onClose }: { onClose: () => void }) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <button className="modal-close" onClick={onClose}>
        ×
      </button>
      <h2>Guía de Uso - Diagrama de Clases UML</h2>

      <section>
        <h3>Crear y Editar Clases</h3>
        <ul>
          <li>Haz clic en "Agregar Nueva Clase" para crear una clase</li>
          <li>Doble clic en el nombre de la clase para editarlo</li>
          <li>Usa los campos de entrada para agregar atributos y métodos</li>
          <li>Doble clic en cualquier atributo o método para editarlo</li>
        </ul>
      </section>

      <section>
        <h3>Tipos de Relaciones</h3>
        <ul className="relation-types-list">
          <li>
            <span
              className="relation-icon"
              style={{ color: relationColors.association }}
            >
              ──▶
            </span>
            <strong>Asociación:</strong> Relación básica entre clases
          </li>
          <li>
            <span
              className="relation-icon"
              style={{ color: relationColors.inheritance }}
            >
              ───▷
            </span>
            <strong>Herencia:</strong> Una clase hereda de otra
          </li>
          <li>
            <span
              className="relation-icon"
              style={{ color: relationColors.aggregation }}
            >
              ◇──▶
            </span>
            <strong>Agregación:</strong> Una clase contiene referencias a otra
          </li>
          <li>
            <span
              className="relation-icon"
              style={{ color: relationColors.composition }}
            >
              ◆──▶
            </span>
            <strong>Composición:</strong> Una clase contiene y es responsable de
            otra
          </li>
        </ul>
      </section>

      <section>
        <h3>Crear Relaciones</h3>
        <ol>
          <li>Selecciona el tipo de relación en el panel derecho</li>
          <li>Localiza los puntos azules en los bordes de las clases</li>
          <li>
            Haz clic en un punto y arrastra hasta otro punto de otra clase
          </li>
          <li>Suelta para crear la relación</li>
        </ol>
      </section>

      <section>
        <h3>Consejos Adicionales</h3>
        <ul>
          <li>Puedes arrastrar las clases para reorganizar el diagrama</li>
          <li>Usa la rueda del mouse para hacer zoom</li>
          <li>Los cambios se guardan automáticamente</li>
        </ul>
      </section>
    </div>
  </div>
);

const DClases = () => {
  const navigate = useNavigate();
  const [nodes, setNodes, onNodesChange] = useNodesState(
    JSON.parse(
      localStorage.getItem("diagramNodes") || JSON.stringify(initialNodes)
    )
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    JSON.parse(localStorage.getItem("diagramEdges") || "[]")
  );
  const [selectedRelationType, setSelectedRelationType] =
    useState<RelationType>("association");
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    localStorage.setItem("diagramNodes", JSON.stringify(nodes));
  }, [nodes]);

  useEffect(() => {
    localStorage.setItem("diagramEdges", JSON.stringify(edges));
  }, [edges]);

  useEffect(() => {
    const handleNodesUpdate = (event: CustomEvent) => {
      setNodes(event.detail);
    };

    window.addEventListener("nodesUpdated", handleNodesUpdate as EventListener);
    return () => {
      window.removeEventListener(
        "nodesUpdated",
        handleNodesUpdate as EventListener
      );
    };
  }, [setNodes]);

  const onConnect = useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.target) return;

      const edgeStyle = getRelationStyle(selectedRelationType);
      const newEdge = {
        ...connection,
        ...edgeStyle,
        data: { type: selectedRelationType },
        id: `${connection.source}-${connection.target}-${selectedRelationType}`,
      };

      setEdges((eds) => {
        const newEdges = addEdge(newEdge, eds);
        localStorage.setItem("diagramEdges", JSON.stringify(newEdges));
        return newEdges;
      });
    },
    [setEdges, selectedRelationType]
  );

  const addNewClass = () => {
    const newNode: Node = {
      id: Date.now().toString(),
      type: "classNode",
      position: { x: 250, y: nodes.length * 150 },
      data: {
        name: "Nueva Clase",
        attributes: [],
        methods: [],
      },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const exportToJson = () => {
    const diagramData = {
      nodes: nodes.map((node) => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: node.data,
      })),
      edges: edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: edge.data?.type,
        style: edge.style,
      })),
    };

    const jsonString = JSON.stringify(diagramData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "diagrama-clases.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleBack = () => {
    navigate("/menu");
  };

  return (
    <div className="App">
      <div className="toolbar">
        <button className="back-button" onClick={handleBack}>
          Volver al Menú
        </button>
        <button className="add-class-button" onClick={addNewClass}>
          Agregar Nueva Clase
        </button>
        <button className="help-button" onClick={() => setShowHelp(true)}>
          <span className="help-icon">?</span>
          Ayuda
        </button>
        <button className="export-button" onClick={exportToJson}>
          <span className="export-icon">↓</span>
          Exportar JSON
        </button>
      </div>

      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        connectionMode={ConnectionMode.Loose}
        snapToGrid={false}
        elevateNodesOnSelect={true}
      >
        <Background />
        <Controls />
        <Panel position="top-right" className="relation-panel">
          <div className="relation-selector">
            <h3>Tipo de Relación</h3>
            <select
              value={selectedRelationType}
              onChange={(e) =>
                setSelectedRelationType(e.target.value as RelationType)
              }
              style={{ borderColor: relationColors[selectedRelationType] }}
            >
              <option
                value="association"
                style={{ color: relationColors.association }}
              >
                Asociación ──▶
              </option>
              <option
                value="inheritance"
                style={{ color: relationColors.inheritance }}
              >
                Herencia ───▷
              </option>
              <option
                value="aggregation"
                style={{ color: relationColors.aggregation }}
              >
                Agregación ◇──▶
              </option>
              <option
                value="composition"
                style={{ color: relationColors.composition }}
              >
                Composición ◆──▶
              </option>
            </select>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default DClases;
