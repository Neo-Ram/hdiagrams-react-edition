import { memo, useState, useCallback } from "react";
import { Handle, Position } from "reactflow";
//maldito
interface ActorNodeProps {
  data: {
    label: string;
  };
}

const ActorNode = ({ data }: ActorNodeProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label);

  const onDoubleClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  const onChange = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
    setLabel(evt.target.value);
  }, []);

  const onKeyDown = useCallback(
    (evt: React.KeyboardEvent<HTMLInputElement>) => {
      if (evt.key === "Enter") {
        setIsEditing(false);
        data.label = label;
      }
    },
    [data, label]
  );

  const onBlur = useCallback(() => {
    setIsEditing(false);
    data.label = label;
  }, [data, label]);

  return (
    <div
      style={{
        border: "1px solid #0041d0",
        padding: "10px",
        borderRadius: "4px",
        background: "white",
        position: "relative",
        width: "120px",
      }}
    >
      <div
        style={{
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
            marginBottom: "10px",
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
        {/* Etiqueta */}
        <div
          style={{
            fontSize: "12px",
            textAlign: "center",
            color: "#0041d0",
            fontWeight: "bold",
            width: "100%",
          }}
          onDoubleClick={onDoubleClick}
        >
          {isEditing ? (
            <input
              type="text"
              value={label}
              onChange={onChange}
              onKeyDown={onKeyDown}
              onBlur={onBlur}
              autoFocus
              style={{
                width: "100%",
                border: "none",
                padding: "2px",
                textAlign: "center",
                outline: "none",
                fontSize: "12px",
                fontWeight: "bold",
                color: "#0041d0",
                background: "transparent",
              }}
            />
          ) : (
            label
          )}
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Left}
        id="left-source"
        style={{
          left: "-3px",
          width: "6px",
          height: "6px",
          background: "#fff",
          border: "1px solid #0041d0",
        }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left-target"
        style={{
          left: "-3px",
          width: "6px",
          height: "6px",
          background: "#fff",
          border: "1px solid #0041d0",
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right-source"
        style={{
          right: "-3px",
          width: "6px",
          height: "6px",
          background: "#fff",
          border: "1px solid #0041d0",
        }}
      />
      <Handle
        type="target"
        position={Position.Right}
        id="right-target"
        style={{
          right: "-3px",
          width: "6px",
          height: "6px",
          background: "#fff",
          border: "1px solid #0041d0",
        }}
      />
    </div>
  );
};

export default memo(ActorNode);
