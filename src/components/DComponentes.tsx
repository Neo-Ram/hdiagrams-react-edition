import { useEffect, useRef, useState } from "react";
import * as go from "gojs";
import "./DComponentes.css";
import { useNavigate } from "react-router-dom";

const DComponentes = () => {
  const navigate = useNavigate();
  const diagramRef = useRef<HTMLDivElement>(null);
  const [componentCounter, setComponentCounter] = useState(1);
  const [selectedComponentKey, setSelectedComponentKey] = useState<
    number | null
  >(null);
  const [linkType, setLinkType] = useState<"provided" | "required">("provided");
  const diagramRef2 = useRef<go.Diagram | null>(null);

  // Función para volver al menú
  const handleBack = () => {
    navigate("/menu");
  };

  // Funciones para añadir elementos a las listas del componente seleccionado
  const addToList = (type: "provided" | "required" | "artifact") => {
    if (!diagramRef2.current) return;
    const model = diagramRef2.current.model as go.GraphLinksModel;
    if (selectedComponentKey == null) return;
    const nodeData = model.findNodeDataForKey(selectedComponentKey);
    if (!nodeData) return;
    if (type === "provided") {
      nodeData.provided = nodeData.provided || [];
      nodeData.provided.push("NuevaProvided");
    } else if (type === "required") {
      nodeData.required = nodeData.required || [];
      nodeData.required.push("NuevaRequired");
    } else if (type === "artifact") {
      nodeData.artifacts = nodeData.artifacts || [];
      nodeData.artifacts.push("NuevoArtifact");
    }
    model.updateTargetBindings(nodeData);
    model.setDataProperty(nodeData, "refresh", Math.random()); // Forzar refresco
  };

  // Crear el diagrama solo una vez
  useEffect(() => {
    if (!diagramRef.current) return;
    if (diagramRef2.current) return; // Ya está creado

    const $ = go.GraphObject.make;

    const myDiagram = $(go.Diagram, diagramRef.current, {
      "undoManager.isEnabled": true,
      "grid.visible": true,
      "draggingTool.isGridSnapEnabled": true,
      "resizingTool.isGridSnapEnabled": true,
      "rotatingTool.snapAngleMultiple": 45,
      "rotatingTool.snapAngleEpsilon": 15,
      "undoManager.maxHistoryLength": 100,
      "clickCreatingTool.archetypeNodeData": null,
      "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
      "draggingTool.isEnabled": true,
      "linkingTool.isEnabled": true,
      // No poner background aquí
    });

    // Fondo blanco después de crear el diagrama
    if (myDiagram.div) {
      myDiagram.div.style.background = "white";
    }

    diagramRef2.current = myDiagram;

    // Compartimiento de nombre
    const namePanel = $(
      go.Panel,
      "Horizontal",
      $(
        go.TextBlock,
        {
          margin: 2,
          font: "bold 14px sans-serif",
          editable: true,
          isMultiline: false,
        },
        new go.Binding("text", "text").makeTwoWay()
      ),
      $(go.TextBlock, "\u25A6", { font: "16px sans-serif", margin: 2 })
    );

    // Compartimiento de provided (sin texto)
    const providedPanel = $(
      go.Panel,
      "Vertical",
      { name: "PROVIDED_PANEL" },
      // Sin texto
      $(
        go.Panel,
        "Vertical",
        new go.Binding("itemArray", "provided").makeTwoWay(),
        {
          itemTemplate: $(
            go.Panel,
            "Horizontal",
            $(
              go.TextBlock,
              { editable: true, margin: 2, font: "12px sans-serif" },
              new go.Binding("text", "", (v) => v).makeTwoWay()
            )
          ),
        }
      )
    );

    // Compartimiento de required (sin texto)
    const requiredPanel = $(
      go.Panel,
      "Vertical",
      { name: "REQUIRED_PANEL" },
      // Sin texto
      $(
        go.Panel,
        "Vertical",
        new go.Binding("itemArray", "required").makeTwoWay(),
        {
          itemTemplate: $(
            go.Panel,
            "Horizontal",
            $(
              go.TextBlock,
              { editable: true, margin: 2, font: "12px sans-serif" },
              new go.Binding("text", "", (v) => v).makeTwoWay()
            )
          ),
        }
      )
    );

    // Compartimiento de artifacts (sin texto)
    const artifactsPanel = $(
      go.Panel,
      "Vertical",
      { name: "ARTIFACTS_PANEL" },
      // Sin texto
      $(
        go.Panel,
        "Vertical",
        new go.Binding("itemArray", "artifacts").makeTwoWay(),
        {
          itemTemplate: $(
            go.Panel,
            "Horizontal",
            $(
              go.TextBlock,
              { editable: true, margin: 2, font: "12px sans-serif" },
              new go.Binding("text", "", (v) => v).makeTwoWay()
            )
          ),
        }
      )
    );

    // Puertos en 8 posiciones
    function makePort(name: string, spot: go.Spot) {
      return $(go.Shape, "Circle", {
        fill: "transparent",
        stroke: null,
        desiredSize: new go.Size(8, 8),
        alignment: spot,
        alignmentFocus: spot,
        portId: name,
        fromLinkable: true,
        toLinkable: true,
        fromSpot: spot,
        toSpot: spot,
        cursor: "pointer",
      });
    }

    myDiagram.nodeTemplate = $(
      go.Node,
      "Auto",
      {
        selectionAdorned: true,
        resizable: true,
        resizeObjectName: "SHAPE",
        minSize: new go.Size(180, 120),
        click: (e, obj) => {
          if (obj && obj.part && obj.part.data) {
            setSelectedComponentKey(obj.part.data.key);
          }
        },
      },
      $(go.Shape, "Rectangle", {
        name: "SHAPE",
        fill: "white",
        stroke: "black",
        strokeWidth: 2,
      }),
      $(
        go.Panel,
        "Table",
        { defaultRowSeparatorStroke: "black" },
        $(go.Panel, "Vertical", { row: 0 }, namePanel),
        $(go.Panel, "Vertical", { row: 1 }, providedPanel),
        $(go.Panel, "Vertical", { row: 2 }, requiredPanel),
        $(go.Panel, "Vertical", { row: 3 }, artifactsPanel)
      ),
      // Puertos en 8 posiciones
      makePort("left", go.Spot.Left),
      makePort("right", go.Spot.Right),
      makePort("top", go.Spot.Top),
      makePort("bottom", go.Spot.Bottom),
      makePort("topLeft", go.Spot.TopLeft),
      makePort("topRight", go.Spot.TopRight),
      makePort("bottomLeft", go.Spot.BottomLeft),
      makePort("bottomRight", go.Spot.BottomRight)
    );

    // Flecha de provided: flecha abierta
    const providedLinkTemplate = $(
      go.Link,
      {
        routing: go.Link.Orthogonal,
        corner: 5,
        toShortLength: 4,
        relinkableFrom: true,
        relinkableTo: true,
        fromPortId: "",
        toPortId: "",
      },
      $(go.Shape, { strokeWidth: 2, stroke: "black" }),
      $(go.Shape, {
        toArrow: "OpenTriangle",
        fill: "white",
        stroke: "black",
        strokeWidth: 2,
        width: 14,
        height: 14,
      })
    );
    // Flecha de required: flecha cerrada
    const requiredLinkTemplate = $(
      go.Link,
      {
        routing: go.Link.Orthogonal,
        corner: 5,
        toShortLength: 4,
        relinkableFrom: true,
        relinkableTo: true,
        fromPortId: "",
        toPortId: "",
      },
      $(go.Shape, { strokeWidth: 2, stroke: "black" }),
      $(go.Shape, {
        toArrow: "Triangle",
        fill: "black",
        stroke: "black",
        strokeWidth: 2,
        width: 14,
        height: 14,
      })
    );

    myDiagram.linkTemplateMap.add("provided", providedLinkTemplate);
    myDiagram.linkTemplateMap.add("required", requiredLinkTemplate);

    myDiagram.linkTemplate = $(
      go.Link,
      {
        routing: go.Link.Orthogonal,
        corner: 5,
        toShortLength: 4,
        relinkableFrom: true,
        relinkableTo: true,
        category: linkType,
        fromPortId: "",
        toPortId: "",
      },
      $(go.Shape, { strokeWidth: 2, stroke: "black" }),
      $(go.Shape, "Circle", {
        toArrow: "Circle",
        fill: "white",
        stroke: "black",
        strokeWidth: 2,
        width: 8,
        height: 8,
      })
    );

    // Selección de componente
    myDiagram.addDiagramListener("ChangedSelection", (e) => {
      const sel = e.diagram.selection.first();
      if (sel && sel instanceof go.Node) {
        setSelectedComponentKey(sel.data.key);
      } else {
        setSelectedComponentKey(null);
      }
    });

    // Inicializar con un modelo vacío
    myDiagram.model = new go.GraphLinksModel([], []);

    return () => {
      if (diagramRef2.current) {
        diagramRef2.current.div = null;
        diagramRef2.current = null;
      }
    };
  }, []); // Solo una vez

  // Actualizar el tipo de enlace cuando cambie linkType
  useEffect(() => {
    if (!diagramRef2.current) return;
    // Cambiar el archetypeLinkData y la categoría de la plantilla de enlace
    diagramRef2.current.toolManager.linkingTool.archetypeLinkData = {
      category: linkType,
    };
    diagramRef2.current.linkTemplate.category = linkType;
  }, [linkType]);

  const addComponent = () => {
    if (!diagramRef2.current) return;
    const model = diagramRef2.current.model as go.GraphLinksModel;
    const newNode = {
      key: componentCounter,
      text: `Componente ${componentCounter}`,
      provided: [],
      required: [],
      artifacts: [],
    };
    model.addNodeData(newNode);
    setComponentCounter((prev) => prev + 1);
  };

  // Corregir el select para que no recargue la página
  const handleLinkTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLinkType(e.target.value as "provided" | "required");
  };

  // Función para mostrar el JSON del diagrama
  const showDiagramJSON = () => {
    if (!diagramRef2.current) return;
    const model = diagramRef2.current.model;
    const jsonStr = model.toJson();
    console.log("Diagrama JSON:", JSON.parse(jsonStr)); // Para ver en consola
    alert("Diagrama JSON (ver consola para mejor formato):\n" + jsonStr);
  };

  return (
    <div className="diagram-container">
      <div className="toolbar">
        <button onClick={handleBack}>Volver</button>
        <button onClick={addComponent}>Añadir Componente</button>
        <button
          onClick={() => addToList("provided")}
          disabled={selectedComponentKey == null}
        >
          Añadir Provided
        </button>
        <button
          onClick={() => addToList("required")}
          disabled={selectedComponentKey == null}
        >
          Añadir Required
        </button>
        <button
          onClick={() => addToList("artifact")}
          disabled={selectedComponentKey == null}
        >
          Añadir Artifact
        </button>
        <button
          onClick={() => {
            if (diagramRef2.current) {
              diagramRef2.current.undoManager.undo();
            }
          }}
        >
          Deshacer
        </button>
        <button
          onClick={() => {
            if (diagramRef2.current) {
              diagramRef2.current.undoManager.redo();
            }
          }}
        >
          Rehacer
        </button>
        <span style={{ marginLeft: 16 }}>Tipo de conexión: </span>
        <select value={linkType} onChange={handleLinkTypeChange}>
          <option value="provided">Provided</option>
          <option value="required">Required</option>
        </select>
        <button onClick={showDiagramJSON} style={{ marginLeft: 16 }}>
          Ver JSON
        </button>
      </div>
      <div ref={diagramRef} className="diagram"></div>
    </div>
  );
};

export default DComponentes;
