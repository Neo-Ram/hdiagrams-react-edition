import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import * as go from "gojs";
import "./DSecuencia.css";

const DSecuencia = () => {
  const navigate = useNavigate();
  const diagramRef = useRef<HTMLDivElement>(null);
  const paletteRef = useRef<HTMLDivElement>(null);
  const diagramInstance = useRef<go.Diagram | null>(null);
  const paletteInstance = useRef<go.Palette | null>(null);

  // Función para volver al menú
  const handleBack = () => {
    navigate("/menu");
  };

  // Funciones para deshacer y rehacer
  const handleUndo = () => {
    if (diagramInstance.current) {
      diagramInstance.current.commandHandler.undo();
    }
  };

  const handleRedo = () => {
    if (diagramInstance.current) {
      diagramInstance.current.commandHandler.redo();
    }
  };

  // Función para ver JSON
  const handleViewJson = () => {
    if (diagramInstance.current) {
      const json = diagramInstance.current.model.toJson();
      alert(JSON.stringify(JSON.parse(json), null, 2));
    }
  };

  // Función para agregar nodos
  const addNode = (shape: string) => {
    if (!diagramInstance.current) return;
    const point = diagramInstance.current.lastInput.documentPoint;
    const newNodeData = {
      key: shape,
      category: shape,
      loc: go.Point.stringify(point || new go.Point(100, 100)),
    };
    diagramInstance.current.model.addNodeData(newNodeData);
  };

  // Función para guardar
  const save = () => {
    if (!diagramInstance.current) return;
    const jsonDiagrama = diagramInstance.current.model.toJson();
    localStorage.setItem("jsonDiagrama", jsonDiagrama);
    alert("¡Diagrama guardado!");
    downloadJson(jsonDiagrama);
  };

  // Función para descargar JSON
  const downloadJson = (jsonDiagrama: string) => {
    const blob = new Blob([jsonDiagrama], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "diagrama.json";
    link.click();
  };

  useEffect(() => {
    // Verificar que los refs no sean null
    if (!diagramRef.current || !paletteRef.current) {
      console.error("Error: diagramRef.current o paletteRef.current es null");
      return;
    }

    // Inicializar el diagrama
    diagramInstance.current = new go.Diagram(diagramRef.current, {
      "undoManager.isEnabled": true,
      "themeManager.changesDivBackground": false,
    });

    diagramInstance.current.grid = new go.Panel("Grid")
      .set({
        gridCellSize: new go.Size(10, 10),
        visible: true,
      })
      .add(
        new go.Shape("LineH", { stroke: "#d3d3d3", strokeWidth: 0.5 }),
        new go.Shape("LineV", { stroke: "#d3d3d3", strokeWidth: 0.5 })
      );

    // Configurar el tema
    diagramInstance.current.themeManager.set("light", {
      colors: {
        text: "#000",
        start: "rgb(255, 255, 255)",
        step: "rgb(255, 255, 255)",
        conditional: "rgb(255, 255, 255)",
        end: "rgb(255, 255, 255)",
        comment: "rgb(255, 255, 255)",
        bgText: "#000",
        link: "rgb(0, 0, 0)",
        linkOver: "#cbd5e1",
        div: "#ede9e0",
      },
    });

    // Estilos reutilizables
    const nodeStyle = (node: go.Node): go.Node => {
      node
        .set({ locationSpot: go.Spot.Center })
        .bindTwoWay("location", "loc", go.Point.parse, go.Point.stringify);
      return node;
    };

    const shapeStyle = (shape: go.Shape): go.Shape => {
      shape.set({
        strokeWidth: 1,
        portId: "",
        cursor: "pointer",
        fill: "white",
      });
      return shape;
    };

    const textStyle = (textblock: go.TextBlock): go.TextBlock => {
      textblock.set({ font: "10pt Figtree, sans-serif" }).theme("stroke", "text");
      return textblock;
    };

    // Definir figuras personalizadas
    go.Shape.defineFigureGenerator("Conditional", (shape, w, h) => {
      const geo = new go.Geometry();
      const fig = new go.PathFigure(w * 0.15, 0, true);
      geo.add(fig);
      fig.add(new go.PathSegment(go.SegmentType.Line, w * 0.85, 0));
      fig.add(new go.PathSegment(go.SegmentType.Line, w, 0.5 * h));
      fig.add(new go.PathSegment(go.SegmentType.Line, w * 0.85, h));
      fig.add(new go.PathSegment(go.SegmentType.Line, w * 0.15, h));
      fig.add(new go.PathSegment(go.SegmentType.Line, 0, 0.5 * h).close());
      geo.spot1 = new go.Spot(0.15, 0);
      geo.spot2 = new go.Spot(0.85, 1);
      return geo;
    });

    go.Shape.defineFigureGenerator("Condicion", (shape, w, h) => {
      const geo = new go.Geometry();
      const fig = new go.PathFigure(w * 0.5, 0, true);
      geo.add(fig);
      fig.add(new go.PathSegment(go.SegmentType.Line, w, 0.5 * h));
      fig.add(new go.PathSegment(go.SegmentType.Line, w * 0.5, h));
      fig.add(new go.PathSegment(go.SegmentType.Line, 0, 0.5 * h).close());
      geo.spot1 = new go.Spot(0.15, 0);
      geo.spot2 = new go.Spot(0.85, 1);
      return geo;
    });

    // Plantillas de nodos
    diagramInstance.current.nodeTemplateMap.add(
      "",
      new go.Node("Auto")
        .apply(nodeStyle)
        .add(
          new go.Shape("Rectangle", {
            fromLinkable: true,
            toLinkable: true,
            fromSpot: go.Spot.AllSides,
            toSpot: go.Spot.AllSides,
          })
            .apply(shapeStyle)
            .theme("fill", "step"),
          new go.TextBlock({
            margin: 12,
            maxSize: new go.Size(160, NaN),
            wrap: go.Wrap.Fit,
            editable: true,
          })
            .apply(textStyle)
            .bindTwoWay("text")
        )
    );

    diagramInstance.current.nodeTemplateMap.add(
      "Conditional",
      new go.Node("Auto")
        .apply(nodeStyle)
        .add(
          new go.Shape("Conditional", { fromLinkable: true, toLinkable: true })
            .apply(shapeStyle)
            .theme("fill", "conditional"),
          new go.TextBlock({
            margin: 8,
            maxSize: new go.Size(160, NaN),
            wrap: go.Wrap.Fit,
            textAlign: "center",
            editable: true,
          })
            .apply(textStyle)
            .bindTwoWay("text")
        )
    );

    diagramInstance.current.nodeTemplateMap.add(
      "Condicion",
      new go.Node("Auto")
        .apply(nodeStyle)
        .add(
          new go.Shape("Condicion", { fromLinkable: true, toLinkable: true })
            .apply(shapeStyle)
            .theme("fill", "conditional"),
          new go.TextBlock({
            margin: 8,
            maxSize: new go.Size(160, NaN),
            wrap: go.Wrap.Fit,
            textAlign: "center",
            editable: true,
          })
            .apply(textStyle)
            .bindTwoWay("text")
        )
    );

    diagramInstance.current.nodeTemplateMap.add(
      "Start",
      new go.Node("Auto")
        .apply(nodeStyle)
        .add(
          new go.Shape("Capsule", { fromLinkable: true })
            .apply(shapeStyle)
            .theme("fill", "start"),
          new go.TextBlock("Start", { margin: new go.Margin(5, 6) })
            .apply(textStyle)
            .bind("text")
        )
    );

    diagramInstance.current.nodeTemplateMap.add(
      "End",
      new go.Node("Auto")
        .apply(nodeStyle)
        .add(
          new go.Shape("Capsule", { toLinkable: true })
            .apply(shapeStyle)
            .theme("fill", "end"),
          new go.TextBlock("End", { margin: new go.Margin(5, 6) })
            .apply(textStyle)
            .bind("text")
        )
    );

    diagramInstance.current.nodeTemplateMap.add(
      "Comment",
      new go.Node("Auto")
        .apply(nodeStyle)
        .add(
          new go.Shape("Capsule", { strokeWidth: 3 })
            .theme("fill", "div")
            .theme("stroke", "comment"),
          new go.TextBlock({
            font: "9pt Figtree, sans-serif",
            margin: 8,
            maxSize: new go.Size(200, NaN),
            wrap: go.Wrap.Fit,
            textAlign: "center",
            editable: true,
          })
            .theme("stroke", "bgText")
            .bindTwoWay("text")
        )
    );

    // Plantilla de enlaces
    diagramInstance.current.linkTemplate = new go.Link({
      layerName: "Background",
      routing: go.Routing.Orthogonal,
      curve: go.Curve.JumpOver,
      corner: 5,
      toShortLength: 4,
      relinkableFrom: true,
      relinkableTo: true,
      reshapable: true,
      resegmentable: true,
      mouseEnter: (e, link) => {
        const highlight = link.findObject("HIGHLIGHT");
        if (highlight) highlight.background = "#cbd5e1";
      },
      mouseLeave: (e, link) => {
        const highlight = link.findObject("HIGHLIGHT");
        if (highlight) highlight.background = "transparent";
      },
      contextClick: (e, link) => {
        if (link.diagram && link.data) {
          link.diagram.model.commit((m) => {
            m.set(link.data, "text", "Label");
          });
        }
      },
    })
      .bindTwoWay("points")
      .add(
        new go.Shape({
          isPanelMain: true,
          strokeWidth: 8,
          stroke: "transparent",
          name: "HIGHLIGHT",
        }),
        new go.Shape({ isPanelMain: true, strokeWidth: 2 }).theme("stroke", "link"),
        new go.Shape({
          toArrow: "standard",
          strokeWidth: 0,
          scale: 1.5,
        }).theme("fill", "link"),
        new go.Panel("Auto", {
          visible: false,
        })
          .bind("visible", "text", (t) => typeof t === "string" && t.length > 0)
          .add(
            new go.Shape("Ellipse", { strokeWidth: 0 }).theme(
              "fill",
              "div",
              "",
              null,
              (c) => new go.Brush("Radial", { 0: c, 0.5: `${c}00` })
            ),
            new go.TextBlock({
              name: "LABEL",
              font: "9pt Figtree, sans-serif",
              margin: 3,
              editable: true,
            })
              .theme("stroke", "bgText")
              .bindTwoWay("text")
          )
      );

    // Configurar herramientas de enlace
    diagramInstance.current.toolManager.linkingTool.temporaryLink.routing = go.Routing.Normal;
    diagramInstance.current.toolManager.relinkingTool.temporaryLink.routing = go.Routing.Normal;

    // Inicializar la paleta
    if (!paletteRef.current) {
      console.error("Error: paletteRef.current es null");
      return;
    }
    paletteInstance.current = new go.Palette(paletteRef.current, {
      nodeTemplateMap: diagramInstance.current.nodeTemplateMap,
      themeManager: diagramInstance.current.themeManager,
      model: new go.GraphLinksModel([
        { category: "Start", text: "Start" },
        { text: "Step" },
        { category: "Conditional", text: "???" },
        { category: "End", text: "End" },
        { category: "Comment", text: "Comment" },
        { category: "Condicion", text: "Condicion", desiredSize: new go.Size(25, 50) },
      ]),
    });

    // Cargar diagrama desde localStorage
    const savedDiagram = localStorage.getItem("jsonDiagrama");
    if (savedDiagram) {
      try {
        diagramInstance.current.model = go.Model.fromJson(savedDiagram);
      } catch (error) {
        console.error("Error loading diagram:", error);
        alert("No se pudo cargar el diagrama guardado.");
      }
    }

    // Limpiar
    return () => {
      if (diagramInstance.current) {
        diagramInstance.current.div = null;
      }
      if (paletteInstance.current) {
        paletteInstance.current.div = null;
      }
    };
  }, []);

  return (
    <div className="diagram-container">
      <div className="toolbar">
        <button onClick={handleBack} aria-label="Volver al menú">
          Volver
        </button>
        <button onClick={handleUndo} aria-label="Deshacer acción">
          Deshacer
        </button>
        <button onClick={handleRedo} aria-label="Rehacer acción">
          Rehacer
        </button>
        <button
          onClick={handleViewJson}
          style={{ marginLeft: 16 }}
          aria-label="Ver JSON del diagrama"
        >
          Ver JSON
        </button>
        <button
          onClick={save}
          style={{ marginLeft: 8 }}
          aria-label="Guardar diagrama"
        >
          Guardar
        </button>
      </div>
      <div className="content">
        <div ref={paletteRef} className="palette" id="PaletteDiv" />
        <div ref={diagramRef} className="diagram" id="DiagramDiv" />
      </div>
    </div>
  );
};

export default DSecuencia;
