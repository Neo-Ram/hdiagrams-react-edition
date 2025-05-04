import { useEffect, useRef, useState } from "react";
import * as go from "gojs";
import { useNavigate } from "react-router-dom";
import "./DPaquetes.css";

interface ContentItem {
  type: "class" | "useCase";
  items: Array<{
    name: string;
    visibility?: "public" | "private";
  }>;
}

interface PackageData {
  key: number;
  text: string;
  content: ContentItem[];
}

const DPaquetes = () => {
  const navigate = useNavigate();
  const diagramRef = useRef<HTMLDivElement>(null);
  const [packageCounter, setPackageCounter] = useState(1);
  const [actorCounter, setActorCounter] = useState(1);
  const [selectedPackageKey, setSelectedPackageKey] = useState<number | null>(
    null
  );
  const [classVisibility, setClassVisibility] = useState<"public" | "private">(
    "public"
  );
  const diagramRef2 = useRef<go.Diagram | null>(null);

  // Función para volver al menú
  const handleBack = () => {
    navigate("/menu");
  };

  // Crear el diagrama solo una vez
  useEffect(() => {
    if (!diagramRef.current) return;
    if (diagramRef2.current) return; // Ya está creado

    const $ = go.GraphObject.make;

    const myDiagram = $(go.Diagram, diagramRef.current, {
      "undoManager.isEnabled": true,
      "clickCreatingTool.isEnabled": true,
      "draggingTool.isEnabled": true,
      "grid.visible": true,
      "grid.gridCellSize": new go.Size(20, 20),
      "animationManager.isEnabled": false,
      "undoManager.maxHistoryLength": 0,
      "clickCreatingTool.archetypeNodeData": { text: "Nuevo Paquete" },
      model: $(go.GraphLinksModel, {
        nodeKeyProperty: "key",
        linkKeyProperty: "key",
      }),
    });

    // Fondo blanco después de crear el diagrama
    if (myDiagram.div) {
      myDiagram.div.style.background = "white";
    }

    diagramRef2.current = myDiagram;

    // Template para los actores
    const actorTemplate = $(
      go.Node,
      "Spot",
      {
        selectionAdorned: true,
        resizable: false,
        cursor: "pointer",
      },
      $(
        go.Panel,
        "Vertical",
        $(go.Shape, "Circle", {
          width: 20,
          height: 20,
          fill: "white",
          stroke: "black",
          strokeWidth: 1,
        }),
        $(go.Shape, {
          geometryString:
            "M 0 0 L 0 30 M -15 10 L 15 10 M 0 30 L -15 45 M 0 30 L 15 45",
          fill: "transparent",
          stroke: "black",
          strokeWidth: 1,
        }),
        $(
          go.TextBlock,
          {
            margin: new go.Margin(5, 0, 0, 0),
            editable: true,
            alignment: go.Spot.Center,
          },
          new go.Binding("text").makeTwoWay()
        )
      ),
      // Puertos invisibles SOLO DE SALIDA
      makePort("T", go.Spot.Top, true, false),
      makePort("L", go.Spot.Left, true, false),
      makePort("R", go.Spot.Right, true, false),
      makePort("B", go.Spot.Bottom, true, false),
      new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
        go.Point.stringify
      )
    );

    // Añadir el template de actor al diagrama
    myDiagram.nodeTemplateMap.add("actor", actorTemplate);

    // Template para los paquetes
    myDiagram.nodeTemplate = $(
      go.Node,
      "Spot",
      {
        selectionAdorned: true,
        resizable: true,
        resizeObjectName: "SHAPE",
        minSize: new go.Size(180, 120),
        cursor: "pointer",
        click: (_e, obj) => {
          if (obj && obj.part && obj.part.data) {
            setSelectedPackageKey(obj.part.data.key);
          }
        },
      },
      $(
        go.Panel,
        "Auto",
        $(go.Shape, "RoundedRectangle", {
          name: "SHAPE",
          fill: "white",
          stroke: "black",
          strokeWidth: 2,
        }),
        $(
          go.Panel,
          "Vertical",
          $(
            go.TextBlock,
            { margin: 5, font: "bold 14px sans-serif", editable: true },
            new go.Binding("text", "text").makeTwoWay()
          ),
          $(
            go.Panel,
            "Vertical",
            { margin: 5, name: "CONTENT" },
            new go.Binding("itemArray", "content").makeTwoWay(),
            {
              itemTemplate: $(
                go.Panel,
                "Auto",
                { margin: 2 },
                new go.Binding("itemArray", "items").makeTwoWay(),
                {
                  itemTemplate: $(
                    go.Panel,
                    "Auto",
                    { margin: 2 },
                    $(
                      go.Shape,
                      "RoundedRectangle",
                      {
                        fill: "white",
                        stroke: "black",
                        strokeWidth: 1,
                      },
                      new go.Binding("parameter1", "type", (type) =>
                        type === "useCase" ? 20 : 0
                      )
                    ),
                    $(
                      go.Panel,
                      "Horizontal",
                      { margin: 5 },
                      $(
                        go.TextBlock,
                        { font: "12px sans-serif", alignment: go.Spot.Left },
                        new go.Binding("text", "visibility", (v) =>
                          v === "public" ? "+" : "-"
                        ),
                        new go.Binding(
                          "visible",
                          "type",
                          (type) => type === "class"
                        )
                      ),
                      $(
                        go.TextBlock,
                        {
                          editable: true,
                          font: "12px sans-serif",
                          alignment: go.Spot.Left,
                          margin: new go.Margin(0, 0, 0, 5),
                        },
                        new go.Binding("text", "name").makeTwoWay()
                      )
                    )
                  ),
                }
              ),
            }
          )
        ),
        // Puertos invisibles SOLO DE ENTRADA
        makePort("T", go.Spot.Top, false, true),
        makePort("L", go.Spot.Left, false, true),
        makePort("R", go.Spot.Right, false, true),
        makePort("B", go.Spot.Bottom, false, true),
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
          go.Point.stringify
        )
      )
    );

    // Template para los enlaces
    myDiagram.linkTemplate = $(
      go.Link,
      {
        routing: go.Link.AvoidsNodes,
        corner: 5,
        curve: go.Link.JumpOver,
        toShortLength: 4,
        relinkableFrom: true,
        relinkableTo: true,
        reshapable: true,
        resegmentable: true,
      },
      $(go.Shape, {
        strokeWidth: 1.5,
        stroke: "black",
      }),
      $(go.Shape, {
        toArrow: "Standard",
        scale: 1,
        fill: "black",
        stroke: "black",
      })
    );

    // Inicializar con un modelo vacío
    myDiagram.model = new go.GraphLinksModel([], []);

    return () => {
      if (diagramRef2.current) {
        diagramRef2.current.div = null;
        diagramRef2.current = null;
      }
    };
  }, []);

  const addPackage = () => {
    if (!diagramRef2.current) return;
    const model = diagramRef2.current.model as go.GraphLinksModel;
    const newNode: PackageData = {
      key: packageCounter,
      text: `Paquete ${packageCounter}`,
      content: [],
    };
    model.addNodeData(newNode);
    setPackageCounter((prev) => prev + 1);
  };

  const addActor = () => {
    if (!diagramRef2.current) return;
    const model = diagramRef2.current.model as go.GraphLinksModel;
    const newActor = {
      key: `actor${actorCounter}`,
      category: "actor",
      text: `Actor ${actorCounter}`,
    };
    model.addNodeData(newActor);
    setActorCounter((prev) => prev + 1);
  };

  const addClass = () => {
    if (!diagramRef2.current || selectedPackageKey === null) return;
    const model = diagramRef2.current.model as go.GraphLinksModel;
    const nodeData = model.findNodeDataForKey(
      selectedPackageKey
    ) as PackageData;
    if (!nodeData) return;

    // Verificar si ya hay casos de uso
    if (
      nodeData.content &&
      nodeData.content.some((item: ContentItem) => item.type === "useCase")
    ) {
      alert(
        "No se pueden añadir clases a un paquete que ya tiene casos de uso"
      );
      return;
    }

    const content = nodeData.content || [];
    if (content.length === 0) {
      content.push({
        type: "class",
        items: [
          {
            name: `Clase 1`,
            visibility: classVisibility,
          },
        ],
      });
    } else {
      content[0].items.push({
        name: `Clase ${content[0].items.length + 1}`,
        visibility: classVisibility,
      });
    }

    model.setDataProperty(nodeData, "content", content);
    model.updateTargetBindings(nodeData);
  };

  const addUseCase = () => {
    if (!diagramRef2.current || selectedPackageKey === null) return;
    const model = diagramRef2.current.model as go.GraphLinksModel;
    const nodeData = model.findNodeDataForKey(
      selectedPackageKey
    ) as PackageData;
    if (!nodeData) return;

    // Verificar si ya hay clases
    if (
      nodeData.content &&
      nodeData.content.some((item: ContentItem) => item.type === "class")
    ) {
      alert(
        "No se pueden añadir casos de uso a un paquete que ya tiene clases"
      );
      return;
    }

    const content = nodeData.content || [];
    if (content.length === 0) {
      content.push({
        type: "useCase",
        items: [
          {
            name: `Caso de Uso 1`,
          },
        ],
      });
    } else {
      content[0].items.push({
        name: `Caso de Uso ${content[0].items.length + 1}`,
      });
    }

    model.setDataProperty(nodeData, "content", content);
    model.updateTargetBindings(nodeData);
  };

  // Función para mostrar el JSON del diagrama
  const showDiagramJSON = () => {
    if (!diagramRef2.current) return;
    const model = diagramRef2.current.model;
    const jsonStr = model.toJson();
    console.log("Diagrama JSON:", JSON.parse(jsonStr));
    alert("Diagrama JSON (ver consola para mejor formato):\n" + jsonStr);
  };

  // Función para crear puertos invisibles
  function makePort(
    name: string,
    spot: go.Spot,
    output: boolean,
    input: boolean
  ) {
    const $ = go.GraphObject.make;
    return $(go.Shape, "Circle", {
      fill: "transparent", // invisible
      stroke: null,
      desiredSize: new go.Size(8, 8),
      alignment: spot,
      alignmentFocus: spot, // coloca el puerto en el borde
      portId: name, // identifica el puerto
      fromSpot: spot,
      toSpot: spot, // conexiones desde/hacia este punto
      fromLinkable: output,
      toLinkable: input, // permite conexiones
      cursor: "pointer",
    });
  }

  return (
    <div className="diagram-container">
      <div className="toolbar">
        <button onClick={handleBack}>Volver</button>
        <button onClick={addPackage}>Añadir Paquete</button>
        <div className="class-controls">
          <button onClick={addClass} disabled={selectedPackageKey === null}>
            Añadir Clase
          </button>
          <select
            value={classVisibility}
            onChange={(e) =>
              setClassVisibility(e.target.value as "public" | "private")
            }
            disabled={selectedPackageKey === null}
          >
            <option value="public">Público (+)</option>
            <option value="private">Privado (-)</option>
          </select>
        </div>
        <button onClick={addUseCase} disabled={selectedPackageKey === null}>
          Añadir Caso de Uso
        </button>
        <button onClick={addActor}>Añadir Actor</button>
        <button
          onClick={() => {
            if (
              diagramRef2.current &&
              diagramRef2.current.undoManager.canUndo()
            ) {
              diagramRef2.current.undoManager.undo();
            }
          }}
        >
          Deshacer
        </button>
        <button
          onClick={() => {
            if (
              diagramRef2.current &&
              diagramRef2.current.undoManager.canRedo()
            ) {
              diagramRef2.current.undoManager.redo();
            }
          }}
        >
          Rehacer
        </button>
        <button onClick={showDiagramJSON}>Ver JSON</button>
      </div>
      <div ref={diagramRef} className="diagram"></div>
    </div>
  );
};

export default DPaquetes;
