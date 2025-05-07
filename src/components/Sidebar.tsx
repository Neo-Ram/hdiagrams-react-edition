import React, { useState } from "react";

const Sidebar = () => {
  const [elementCount, setElementCount] = useState({
    actor: 0,
    usecase: 0,
    workarea: 0,
  });

  const onDragStart = (
    event: React.DragEvent,
    nodeType: string,
    label: string
  ) => {
    const count = elementCount[nodeType as keyof typeof elementCount];
    const uniqueId = `${nodeType}-${count}`;
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.setData("nodeName", label);
    event.dataTransfer.setData("nodeId", uniqueId);
    event.dataTransfer.effectAllowed = "move";

    // Incrementar el contador para el próximo elemento
    setElementCount((prev) => ({
      ...prev,
      [nodeType]: prev[nodeType as keyof typeof elementCount] + 1,
    }));
  };

  return (
    <aside
      style={{
        width: "200px",
        height: "100%",
        padding: "15px",
        borderRight: "1px solid #eee",
        backgroundColor: "#f8f8f8",
      }}
    >
      <div style={{ marginBottom: "20px" }}>
        <h4
          style={{ marginBottom: "15px", color: "#333", textAlign: "center" }}
        >
          Elementos
        </h4>

        {/* Actor */}
        <div
          className="dndnode"
          onDragStart={(event) => onDragStart(event, "actor", "Actor")}
          draggable
          style={{
            padding: "15px",
            marginBottom: "15px",
            cursor: "grab",
            backgroundColor: "white",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            borderRadius: "8px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Figura del actor */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: "5px",
            }}
          >
            {/* Cabeza */}
            <div
              style={{
                width: "25px",
                height: "25px",
                borderRadius: "50%",
                border: "2px solid #0041d0",
                backgroundColor: "white",
                marginBottom: "3px",
              }}
            />
            {/* Cuerpo y brazos */}
            <div
              style={{
                position: "relative",
                height: "35px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {/* Cuerpo */}
              <div
                style={{
                  width: "2px",
                  height: "100%",
                  backgroundColor: "#0041d0",
                }}
              />
              {/* Brazos */}
              <div
                style={{
                  position: "absolute",
                  top: "5px",
                  width: "40px",
                  height: "2px",
                  backgroundColor: "#0041d0",
                }}
              />
            </div>
            {/* Piernas */}
            <div
              style={{
                display: "flex",
                gap: "3px",
                transform: "translateY(-1px)",
              }}
            >
              {/* Pierna izquierda */}
              <div
                style={{
                  width: "2px",
                  height: "30px",
                  backgroundColor: "#0041d0",
                  transform: "rotate(-15deg)",
                  transformOrigin: "top",
                }}
              />
              {/* Pierna derecha */}
              <div
                style={{
                  width: "2px",
                  height: "30px",
                  backgroundColor: "#0041d0",
                  transform: "rotate(15deg)",
                  transformOrigin: "top",
                }}
              />
            </div>
          </div>
          <span
            style={{ fontSize: "12px", color: "#0041d0", fontWeight: "bold" }}
          >
            Actor
          </span>
        </div>

        {/* Caso de Uso */}
        <div
          className="dndnode"
          onDragStart={(event) => onDragStart(event, "usecase", "Caso de Uso")}
          draggable
          style={{
            padding: "12px 20px",
            marginBottom: "15px",
            cursor: "grab",
            backgroundColor: "white",
            boxShadow: "0 2px 8px rgba(255,0,114,0.1)",
            border: "2px solid #ff0072",
            borderRadius: "30px",
            textAlign: "center",
            fontSize: "13px",
            color: "#ff0072",
            fontWeight: "600",
            background: "linear-gradient(to bottom, #ffffff, #fff5f9)",
            transition: "all 0.2s ease",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#ff0072",
                boxShadow: "0 0 4px rgba(255,0,114,0.5)",
              }}
            />
            Caso de Uso
          </div>
        </div>

        {/* Área de Trabajo */}
        <div
          className="dndnode"
          onDragStart={(event) =>
            onDragStart(event, "workarea", "Área de Trabajo")
          }
          draggable
          style={{
            width: "100%",
            height: "40px",
            cursor: "grab",
            border: "2px solid #666",
            borderRadius: "4px",
            marginBottom: "15px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white",
          }}
        >
          <span
            style={{
              fontSize: "12px",
              color: "#666",
              fontWeight: "bold",
            }}
          >
            Área de Trabajo
          </span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
