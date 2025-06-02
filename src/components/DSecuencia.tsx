import React, { useState, ReactElement, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Actor {
  id: string;
  name: string;
}

interface Message {
  id: string;
  from: string;
  to: string;
  y: number;
  text: string;
  style: "solid" | "dashed" | "dotted" | "response";
  color: string;
}

interface Activation {
  id: string;
  actorId: string;
  y: number;
  height: number;
}

interface DiagramData {
  actors: Actor[];
  messages: Message[];
  activations: Activation[];
  projectName: string;
}

interface LifelineSize {
  top: number;
  bottom: number;
}

interface ResizingActivation {
  id: string;
  type: "move" | "top" | "bottom";
  initialY: number;
}

const initialActors: Actor[] = [];
const initialMessages: Message[] = [];
const initialActivations: Activation[] = [];

const actorWidth = 140;
const actorHeight = 50;
const actorSpacing = 170;
const topMargin = 40;
const lifelineTop = topMargin + actorHeight;
const lifelineBottom = 500;
const activationWidth = 18;

const MessageStyles = {
  solid: {
    dash: "",
    arrow: "arrow-solid",
    color: "#000000",
  },
  dashed: {
    dash: "8 8",
    arrow: "arrow-dashed",
    color: "#666666",
  },
  dotted: {
    dash: "3 3",
    arrow: "arrow-dotted",
    color: "#333333",
  },
  response: {
    dash: "5 5",
    arrow: "arrow-response",
    color: "#0066cc",
  },
};

const SequenceDiagram: React.FC = (): ReactElement => {
  const navigate = useNavigate();
  const [actors, setActors] = useState<Actor[]>(initialActors);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [activations, setActivations] =
    useState<Activation[]>(initialActivations);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [isDrawingMessage, setIsDrawingMessage] = useState(false);
  const [messageStart, setMessageStart] = useState<{
    actorId: string;
    y: number;
  } | null>(null);
  const [editingText, setEditingText] = useState<string | null>(null);
  const [currentMessageStyle, setCurrentMessageStyle] = useState<
    "solid" | "dashed" | "dotted" | "response"
  >("solid");
  const [lifelineSizes, setLifelineSizes] = useState<
    Record<string, LifelineSize>
  >({});
  const [resizingLifeline, setResizingLifeline] = useState<{
    actorId: string;
    type: "top" | "bottom";
    initialY: number;
  } | null>(null);
  const [resizingActivation, setResizingActivation] =
    useState<ResizingActivation | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [projectName, setProjectName] = useState(
    "Editor de Diagramas de Secuencia"
  );
  const [isEditingProjectName, setIsEditingProjectName] = useState(false);

  // Agregar manejador de eventos del teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "Delete" || e.key === "Backspace") && selectedElement) {
        handleDelete(selectedElement);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedElement]);

  // Calcular dimensiones del SVG basado en el número de actores
  const svgWidth = Math.min(
    window.innerWidth - 40,
    Math.max(800, actors.length * actorSpacing + 60)
  );
  const svgHeight = Math.min(window.innerHeight - 200, 750);

  // Agregar efecto para redimensionar cuando cambie el tamaño de la ventana
  useEffect(() => {
    const handleResize = () => {
      // Forzar actualización del componente
      setActors((prev) => [...prev]);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Función para obtener el tamaño de la línea de vida
  const getLifelineSize = (actorId: string): LifelineSize => {
    return (
      lifelineSizes[actorId] || { top: lifelineTop, bottom: lifelineBottom }
    );
  };

  const handleAddActor = () => {
    if (actors.length >= 10) {
      alert("Se ha alcanzado el límite máximo de 10 actores");
      return;
    }
    const newActor: Actor = {
      id: `actor-${Date.now()}`,
      name: `Actor ${actors.length + 1}`,
    };
    setActors([...actors, newActor]);
  };

  const handleResizeStart = (
    e: React.MouseEvent,
    actorId: string,
    type: "top" | "bottom"
  ) => {
    e.stopPropagation();
    const svgElement = e.currentTarget.closest("svg");
    if (!svgElement) return;

    const svgRect = svgElement.getBoundingClientRect();
    const y = e.clientY - svgRect.top;

    setResizingLifeline({
      actorId,
      type,
      initialY: y,
    });
  };

  const handleResizeMove = (e: React.MouseEvent) => {
    if (!resizingLifeline) return;

    const svgElement = e.currentTarget.closest("svg");
    if (!svgElement) return;

    const svgRect = svgElement.getBoundingClientRect();
    const y = e.clientY - svgRect.top;

    setLifelineSizes((prev) => {
      const current = prev[resizingLifeline.actorId] || {
        top: lifelineTop,
        bottom: lifelineBottom,
      };
      const newSize = { ...current };

      if (resizingLifeline.type === "top") {
        newSize.top = Math.max(lifelineTop, Math.min(current.bottom - 50, y));
      } else {
        newSize.bottom = Math.max(
          current.top + 50,
          Math.min(svgHeight - 20, y)
        );
      }

      return {
        ...prev,
        [resizingLifeline.actorId]: newSize,
      };
    });
  };

  const handleResizeEnd = () => {
    setResizingLifeline(null);
  };

  const handleActivationResizeStart = (
    e: React.MouseEvent,
    activation: Activation,
    type: "move" | "top" | "bottom"
  ) => {
    e.stopPropagation();
    setResizingActivation({
      id: activation.id,
      type,
      initialY: e.clientY,
    });
  };

  const handleActivationResizeMove = (e: React.MouseEvent) => {
    if (!resizingActivation) return;

    const svgElement = e.currentTarget.closest("svg");
    if (!svgElement) return;

    const svgRect = svgElement.getBoundingClientRect();
    const deltaY = e.clientY - svgRect.top;

    setActivations((prev) => {
      return prev.map((activation) => {
        if (activation.id !== resizingActivation.id) return activation;

        const actorId = activation.actorId;
        const lifelineSize = getLifelineSize(actorId);
        let newY = activation.y;
        let newHeight = activation.height;

        switch (resizingActivation.type) {
          case "move":
            // Mover la activación completa, respetando los límites de la línea de vida
            newY = Math.max(
              lifelineSize.top,
              Math.min(lifelineSize.bottom - activation.height, deltaY)
            );
            break;
          case "top":
            // Ajustar desde arriba, respetando los límites de la línea de vida
            const maxTopY = activation.y + activation.height - 20;
            const newTopY = Math.max(
              lifelineSize.top,
              Math.min(maxTopY, deltaY)
            );
            newHeight = activation.height + (activation.y - newTopY);
            newY = newTopY;
            break;
          case "bottom":
            // Ajustar desde abajo, respetando los límites de la línea de vida
            const maxHeight = lifelineSize.bottom - activation.y;
            newHeight = Math.max(
              20,
              Math.min(maxHeight, deltaY - activation.y)
            );
            break;
        }

        return {
          ...activation,
          y: newY,
          height: newHeight,
        };
      });
    });
  };

  const handleActivationResizeEnd = () => {
    setResizingActivation(null);
  };

  const handleLifelineClick = (
    e: React.MouseEvent<SVGRectElement>,
    actorId: string
  ) => {
    e.stopPropagation();
    const svgElement = e.currentTarget.closest("svg");
    if (!svgElement) return;

    const svgRect = svgElement.getBoundingClientRect();
    const y = e.clientY - svgRect.top;

    if (isDrawingMessage) {
      if (!messageStart) {
        setMessageStart({ actorId, y });
      } else if (messageStart.actorId !== actorId) {
        const newMessage: Message = {
          id: `message-${Date.now()}`,
          from: messageStart.actorId,
          to: actorId,
          y: messageStart.y,
          text: "Nuevo mensaje",
          style: currentMessageStyle,
          color: MessageStyles[currentMessageStyle].color,
        };
        setMessages([...messages, newMessage]);
        setIsDrawingMessage(false);
        setMessageStart(null);
      }
    } else {
      const newActivation: Activation = {
        id: `activation-${Date.now()}`,
        actorId,
        y,
        height: 100,
      };
      setActivations([...activations, newActivation]);
    }
  };

  const handleActorClick = (actorId: string) => {
    if (isDrawingMessage) {
      if (messageStart) {
        // Terminar de dibujar el mensaje
        const newMessage: Message = {
          id: `message-${Date.now()}`,
          from: messageStart.actorId,
          to: actorId,
          y: messageStart.y,
          text: "Nuevo mensaje",
          style: currentMessageStyle,
          color: MessageStyles[currentMessageStyle].color,
        };
        setMessages([...messages, newMessage]);
        setIsDrawingMessage(false);
        setMessageStart(null);
      }
    } else {
      setSelectedElement(actorId);
    }
  };

  const handleTextEdit = (element: Actor | Message, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setEditingText(element.id);
    setSelectedElement(element.id);
  };

  const handleTextSubmit = (id: string, newText: string) => {
    if (actors.find((a) => a.id === id)) {
      setActors(actors.map((a) => (a.id === id ? { ...a, name: newText } : a)));
    } else {
      setMessages(
        messages.map((m) => (m.id === id ? { ...m, text: newText } : m))
      );
    }
  };

  const handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setEditingText(null);
    }
  };

  const handleInputBlur = () => {
    setEditingText(null);
  };

  const handleDelete = (id: string) => {
    setActors(actors.filter((a) => a.id !== id));
    setMessages(messages.filter((m) => m.id !== id));
    setActivations(activations.filter((a) => a.id !== id));
    setSelectedElement(null);
  };

  const handleExportJSON = () => {
    const diagramData: DiagramData = {
      actors,
      messages,
      activations,
      projectName,
    };

    const dataStr = JSON.stringify(diagramData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${projectName}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data: DiagramData = JSON.parse(content);

        // Validar la estructura del JSON
        if (
          Array.isArray(data.actors) &&
          Array.isArray(data.messages) &&
          Array.isArray(data.activations)
        ) {
          setActors(data.actors);
          setMessages(data.messages);
          setActivations(data.activations);
          if (data.projectName) {
            setProjectName(data.projectName);
          }
        } else {
          alert("El archivo JSON no tiene el formato correcto");
        }
      } catch (error) {
        alert("Error al leer el archivo JSON");
        console.error(error);
      }
    };
    reader.readAsText(file);

    // Limpiar el input file para permitir cargar el mismo archivo nuevamente
    event.target.value = "";
  };

  const handleBack = () => {
    navigate("/menu");
  };

  return (
    <div className="sequence-diagram-editor">
      <div className="project-header">
        {isEditingProjectName ? (
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            onBlur={() => setIsEditingProjectName(false)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                setIsEditingProjectName(false);
              }
            }}
            className="project-name-input"
            autoFocus
          />
        ) : (
          <h2
            className="project-title"
            onClick={() => setIsEditingProjectName(true)}
          >
            {projectName}
          </h2>
        )}
      </div>

      <div className="toolbar">
        <button className="back-button" onClick={handleBack}>
          Volver al Menú
        </button>
        <button className="save-button" onClick={() => {}}>
          Guardar Diagrama
        </button>
        <button onClick={handleAddActor}>Agregar Actor</button>
        <button
          onClick={() => {
            setIsDrawingMessage(!isDrawingMessage);
            setMessageStart(null);
          }}
          className={isDrawingMessage ? "active" : ""}
        >
          {isDrawingMessage ? "Cancelar Mensaje" : "Nuevo Mensaje"}
        </button>
        {isDrawingMessage && (
          <select
            value={currentMessageStyle}
            onChange={(e) => setCurrentMessageStyle(e.target.value as any)}
          >
            <option value="solid">Mensaje Sólido</option>
            <option value="dashed">Mensaje Discontinuo</option>
            <option value="dotted">Mensaje Punteado</option>
            <option value="response">Mensaje Respuesta</option>
          </select>
        )}
        {selectedElement && (
          <button onClick={() => handleDelete(selectedElement)}>
            Eliminar Elemento
          </button>
        )}
        <button onClick={handleExportJSON} className="export-button">
          Exportar JSON
        </button>
        <label className="import-button">
          Importar JSON
          <input
            type="file"
            accept=".json"
            onChange={handleImportJSON}
            style={{ display: "none" }}
          />
        </label>
        <button onClick={() => setShowHelp(true)} className="help-button">
          Ayuda
        </button>
      </div>

      {showHelp && (
        <div className="help-modal">
          <div className="help-content">
            <h2>Guía de Uso del Editor de Diagramas de Secuencia</h2>
            <button className="close-button" onClick={() => setShowHelp(false)}>
              ×
            </button>
            <div className="help-section">
              <h3>Actores</h3>
              <ul>
                <li>Haz clic en "Agregar Actor" para crear nuevos actores</li>
                <li>Doble clic en el nombre del actor para editarlo</li>
                <li>
                  Selecciona un actor y presiona Delete/Backspace para
                  eliminarlo
                </li>
              </ul>
            </div>
            <div className="help-section">
              <h3>Mensajes</h3>
              <ul>
                <li>Haz clic en "Nuevo Mensaje" para comenzar a dibujar</li>
                <li>Selecciona el estilo de mensaje deseado</li>
                <li>Haz clic en una línea de vida para iniciar el mensaje</li>
                <li>Haz clic en otra línea de vida para terminar el mensaje</li>
                <li>Doble clic en el texto del mensaje para editarlo</li>
                <li>
                  Selecciona un mensaje y presiona Delete/Backspace para
                  eliminarlo
                </li>
              </ul>
              <div className="message-types">
                <h4>Tipos de Mensajes:</h4>
                <ul>
                  <li>
                    <strong>Mensaje Sólido:</strong> Representa una llamada
                    síncrona o un mensaje que requiere una respuesta inmediata.
                    <div className="message-example">→</div>
                  </li>
                  <li>
                    <strong>Mensaje Discontinuo:</strong> Indica un mensaje
                    asíncrono, donde el emisor no espera una respuesta
                    inmediata.
                    <div
                      className="message-example"
                      style={{ borderStyle: "dashed" }}
                    >
                      →
                    </div>
                  </li>
                  <li>
                    <strong>Mensaje Punteado:</strong> Se usa para representar
                    mensajes de retorno o respuestas a mensajes anteriores.
                    <div
                      className="message-example"
                      style={{ borderStyle: "dotted" }}
                    >
                      →
                    </div>
                  </li>
                  <li>
                    <strong>Mensaje Respuesta:</strong> Indica una respuesta
                    específica a un mensaje anterior, mostrando el flujo de
                    retorno.
                    <div
                      className="message-example"
                      style={{ color: "#0066cc" }}
                    >
                      ←
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div className="help-section">
              <h3>Líneas de Vida</h3>
              <ul>
                <li>Arrastra los controles verdes para ajustar la longitud</li>
                <li>
                  Las líneas de vida se ajustan automáticamente al contenido
                </li>
              </ul>
            </div>
            <div className="help-section">
              <h3>Activaciones</h3>
              <ul>
                <li>Haz clic en una línea de vida para crear una activación</li>
                <li>Arrastra los bordes para redimensionar</li>
                <li>Arrastra el centro para mover</li>
                <li>
                  Selecciona una activación y presiona Delete/Backspace para
                  eliminarla
                </li>
              </ul>
            </div>
            <div className="help-section">
              <h3>Importar/Exportar</h3>
              <ul>
                <li>Usa "Exportar JSON" para guardar tu diagrama</li>
                <li>Usa "Importar JSON" para cargar un diagrama guardado</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      <svg
        width={svgWidth}
        height={svgHeight}
        style={{
          background: "#ffffff",
          display: "block",
          margin: "20px auto",
        }}
        onMouseMove={(e) => {
          handleResizeMove(e);
          handleActivationResizeMove(e);
        }}
        onMouseUp={() => {
          handleResizeEnd();
          handleActivationResizeEnd();
        }}
        onMouseLeave={() => {
          handleResizeEnd();
          handleActivationResizeEnd();
        }}
      >
        {/* Actores */}
        {actors.map((actor, i) => (
          <g
            key={actor.id}
            onClick={(e) => {
              e.stopPropagation();
              handleActorClick(actor.id);
            }}
            style={{ cursor: "pointer" }}
          >
            <rect
              x={30 + i * actorSpacing}
              y={topMargin}
              width={actorWidth}
              height={actorHeight}
              fill="#ffd966"
              stroke={selectedElement === actor.id ? "#ff0000" : "#000"}
              strokeWidth={selectedElement === actor.id ? 3 : 2}
              rx={6}
            />
            {editingText === actor.id ? (
              <foreignObject
                x={30 + i * actorSpacing}
                y={topMargin}
                width={actorWidth}
                height={actorHeight}
              >
                <input
                  type="text"
                  value={actor.name}
                  onChange={(e) => handleTextSubmit(actor.id, e.target.value)}
                  onBlur={() => setEditingText(null)}
                  autoFocus
                  style={{
                    width: "90%",
                    height: "80%",
                    margin: "5%",
                    textAlign: "center",
                  }}
                />
              </foreignObject>
            ) : (
              <text
                x={30 + i * actorSpacing + actorWidth / 2}
                y={topMargin + actorHeight / 2 + 6}
                textAnchor="middle"
                fontWeight="bold"
                fontSize={16}
                fill="#333"
                onDoubleClick={(e) => handleTextEdit(actor, e)}
              >
                {actor.name}
              </text>
            )}
          </g>
        ))}

        {/* Líneas de vida con controles de redimensionamiento */}
        {actors.map((actor, i) => {
          const size = getLifelineSize(actor.id);
          const centerX = 30 + i * actorSpacing + actorWidth / 2;

          return (
            <g key={`lifeline-${actor.id}`}>
              {/* Línea de vida */}
              <line
                x1={centerX}
                y1={size.top}
                x2={centerX}
                y2={size.bottom}
                stroke="#000"
                strokeDasharray="8 8"
                strokeWidth={2}
              />

              {/* Área de click para mensajes */}
              <rect
                x={centerX - 15}
                y={size.top}
                width={30}
                height={size.bottom - size.top}
                fill="transparent"
                style={{ cursor: "pointer" }}
                onClick={(e) => handleLifelineClick(e, actor.id)}
              />

              {/* Control superior de redimensionamiento */}
              <g
                transform={`translate(${centerX}, ${size.top})`}
                style={{ cursor: "ns-resize" }}
                onMouseDown={(e) => handleResizeStart(e, actor.id, "top")}
              >
                <circle r={6} fill="#4CAF50" stroke="#fff" strokeWidth={2} />
                <line
                  x1={-4}
                  y1={0}
                  x2={4}
                  y2={0}
                  stroke="#fff"
                  strokeWidth={2}
                />
              </g>

              {/* Control inferior de redimensionamiento */}
              <g
                transform={`translate(${centerX}, ${size.bottom})`}
                style={{ cursor: "ns-resize" }}
                onMouseDown={(e) => handleResizeStart(e, actor.id, "bottom")}
              >
                <circle r={6} fill="#4CAF50" stroke="#fff" strokeWidth={2} />
                <line
                  x1={-4}
                  y1={0}
                  x2={4}
                  y2={0}
                  stroke="#fff"
                  strokeWidth={2}
                />
              </g>
            </g>
          );
        })}

        {/* Activaciones editables */}
        {activations.map((activation) => {
          const actorIndex = actors.findIndex(
            (a) => a.id === activation.actorId
          );
          if (actorIndex === -1) return null;

          const centerX = 30 + actorIndex * actorSpacing + actorWidth / 2;

          return (
            <g
              key={activation.id}
              style={{
                cursor:
                  resizingActivation?.id === activation.id
                    ? "grabbing"
                    : "grab",
              }}
            >
              {/* Rectángulo principal */}
              <rect
                x={centerX - activationWidth / 2}
                y={activation.y}
                width={activationWidth}
                height={activation.height}
                fill="#e6e6e6"
                stroke={selectedElement === activation.id ? "#ff0000" : "#000"}
                strokeWidth={2}
                rx={4}
                onClick={() => setSelectedElement(activation.id)}
                onMouseDown={(e) =>
                  handleActivationResizeStart(e, activation, "move")
                }
              />

              {/* Control superior */}
              <g
                transform={`translate(${centerX}, ${activation.y})`}
                style={{ cursor: "ns-resize" }}
                onMouseDown={(e) =>
                  handleActivationResizeStart(e, activation, "top")
                }
              >
                <rect
                  x={-activationWidth / 2}
                  y={-6}
                  width={activationWidth}
                  height={6}
                  fill="#4CAF50"
                  rx={2}
                />
              </g>

              {/* Control inferior */}
              <g
                transform={`translate(${centerX}, ${activation.y + activation.height})`}
                style={{ cursor: "ns-resize" }}
                onMouseDown={(e) =>
                  handleActivationResizeStart(e, activation, "bottom")
                }
              >
                <rect
                  x={-activationWidth / 2}
                  y={0}
                  width={activationWidth}
                  height={6}
                  fill="#4CAF50"
                  rx={2}
                />
              </g>
            </g>
          );
        })}

        {/* Mensajes */}
        {messages.map((msg) => {
          const fromIndex = actors.findIndex((a) => a.id === msg.from);
          const toIndex = actors.findIndex((a) => a.id === msg.to);
          if (fromIndex === -1 || toIndex === -1) return null;

          const fromX = 30 + fromIndex * actorSpacing + actorWidth / 2;
          const toX = 30 + toIndex * actorSpacing + actorWidth / 2;

          return (
            <g
              key={msg.id}
              onClick={() => setSelectedElement(msg.id)}
              style={{ cursor: "pointer" }}
            >
              <line
                x1={fromX}
                y1={msg.y}
                x2={toX}
                y2={msg.y}
                stroke={selectedElement === msg.id ? "#ff0000" : msg.color}
                strokeDasharray={MessageStyles[msg.style].dash}
                strokeWidth={2}
                markerEnd={`url(#${MessageStyles[msg.style].arrow})`}
              />
              {editingText === msg.id ? (
                <foreignObject
                  x={(fromX + toX) / 2 - 75}
                  y={msg.y - 25}
                  width={150}
                  height={30}
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="text"
                    value={msg.text}
                    onChange={(e) => handleTextSubmit(msg.id, e.target.value)}
                    onKeyPress={handleInputKeyPress}
                    onBlur={handleInputBlur}
                    autoFocus
                    style={{
                      width: "100%",
                      height: "100%",
                      padding: "2px 5px",
                      border: "2px solid #4CAF50",
                      borderRadius: "4px",
                      fontSize: "14px",
                      textAlign: "center",
                      backgroundColor: "white",
                      outline: "none",
                    }}
                  />
                </foreignObject>
              ) : (
                <g onClick={(e) => handleTextEdit(msg, e)}>
                  <rect
                    x={(fromX + toX) / 2 - 75}
                    y={msg.y - 25}
                    width={150}
                    height={30}
                    fill="transparent"
                    style={{ cursor: "text" }}
                  />
                  <text
                    x={(fromX + toX) / 2}
                    y={msg.y - 8}
                    fontSize={14}
                    fill={msg.color}
                    textAnchor="middle"
                    style={{ cursor: "text" }}
                  >
                    {msg.text}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Definición de flechas */}
        <defs>
          <marker
            id="arrow-solid"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#000000" />
          </marker>
          <marker
            id="arrow-dashed"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#666666" />
          </marker>
          <marker
            id="arrow-dotted"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#333333" />
          </marker>
          <marker
            id="arrow-response"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <path d="M 0 0 L 10 3.5 L 0 7 L 4 3.5 Z" fill="#0066cc" />
          </marker>
        </defs>

        {/* Línea de mensaje en construcción */}
        {isDrawingMessage && messageStart && (
          <line
            x1={
              30 +
              actors.findIndex((a) => a.id === messageStart.actorId) *
                actorSpacing +
              actorWidth / 2
            }
            y1={messageStart.y}
            x2={
              30 +
              actors.findIndex((a) => a.id === messageStart.actorId) *
                actorSpacing +
              actorWidth / 2
            }
            y2={messageStart.y}
            stroke="#ff0000"
            strokeWidth={2}
            strokeDasharray="4 4"
          />
        )}
      </svg>
    </div>
  );
};

// Estilos CSS en línea para la interfaz
const styles = `
  body {
    margin: 0;
    padding: 0;
    overflow: hidden;
  }

  .App {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }

  .sequence-diagram-editor {
    padding: 20px;
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    position: relative;
  }
  
  .project-header {
    text-align: center;
    margin-bottom: 8px;
    padding: 8px;
    margin-top: 30px;
  }

  .project-title {
    margin: 0;
    color: #333;
    font-size: 24px;
    font-weight: bold;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    display: inline-block;
  }

  .project-name-input {
    width: 300px;
    padding: 6px;
    font-size: 24px;
    border: 2px solid #4CAF50;
    border-radius: 4px;
    text-align: center;
    outline: none;
  }

  .toolbar {
    margin-bottom: 15px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    flex-shrink: 0;
    padding: 8px;
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 6px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .toolbar button, .toolbar select, .toolbar label.import-button {
    margin: 0;
    padding: 6px 12px;
    font-size: 13px;
    background-color: var(--morado);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .toolbar select {
    padding: 6px 8px;
    font-size: 13px;
  }
  
  .toolbar select:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
  
  .toolbar button:hover, .toolbar label.import-button:hover {
    background-color: var(--moradoSec);
  }
  
  .toolbar button.active {
    background-color: var(--moradoSec);
  }

  .message-text {
    user-select: none;
    cursor: text;
  }

  .help-button {
    background-color: #2196F3 !important;
  }

  .help-button:hover {
    background-color: #1976D2 !important;
  }

  .help-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    overflow-y: auto;
  }

  .help-content {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    max-width: 600px;
    max-height: 80vh;
    overflow-y: auto;
    position: relative;
    margin: 20px;
  }

  .close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #666;
  }

  .help-section {
    margin-bottom: 20px;
  }

  .help-section h3 {
    color: #333;
    margin-bottom: 10px;
  }

  .help-section ul {
    list-style-type: disc;
    padding-left: 20px;
  }

  .help-section li {
    margin-bottom: 8px;
    line-height: 1.4;
  }

  .sequence-diagram-editor svg {
    flex-grow: 1;
    min-height: 0;
    max-width: 100%;
    max-height: calc(100vh - 200px);
    overflow: visible;
  }

  .message-types {
    margin-top: 15px;
    padding: 10px;
    background-color: #f5f5f5;
    border-radius: 4px;
  }

  .message-types h4 {
    margin-top: 0;
    color: #333;
  }

  .message-example {
    display: inline-block;
    margin-left: 10px;
    padding: 2px 8px;
    border: 2px solid #000;
    border-radius: 4px;
    font-weight: bold;
  }

  .message-types li {
    margin-bottom: 12px;
    line-height: 1.5;
  }
`;

function App() {
  return (
    <div className="App">
      <style>{styles}</style>
      <SequenceDiagram />
    </div>
  );
}

export default App;
