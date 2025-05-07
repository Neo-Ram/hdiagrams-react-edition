import { memo, useState, useCallback } from "react";
import { Handle, Position } from "reactflow";

interface UseCaseNodeProps {
  data: {
    label: string;
  };
}

const UseCaseNode = ({ data }: UseCaseNodeProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label);

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      setLabel(evt.target.value);
    },
    []
  );

  const handleKeyDown = useCallback(
    (evt: React.KeyboardEvent<HTMLInputElement>) => {
      if (evt.key === "Enter") {
        setIsEditing(false);
        data.label = label;
      }
    },
    [data, label]
  );

  const handleBlur = useCallback(() => {
    setIsEditing(false);
    data.label = label;
  }, [data, label]);

  return (
    <div
      style={{
        height: "70px",
        width: "150px",
        border: "2px solid #ff0072",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        background: "white",
        padding: "8px",
      }}
    >
      {isEditing ? (
        <input
          type="text"
          value={label}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          autoFocus
          style={{
            width: "90%",
            textAlign: "center",
            border: "none",
            outline: "none",
            fontSize: "14px",
            fontWeight: "500",
            background: "transparent",
            padding: "4px",
            borderRadius: "20px",
          }}
        />
      ) : (
        <div
          onDoubleClick={handleDoubleClick}
          style={{
            textAlign: "center",
            fontWeight: "500",
            width: "90%",
            cursor: "pointer",
            padding: "4px",
            userSelect: "none",
          }}
        >
          {label}
        </div>
      )}
      <Handle
        type="target"
        position={Position.Left}
        id="left-target"
        style={{
          background: "#fff",
          border: "2px solid #ff0072",
          width: "8px",
          height: "8px",
        }}
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left-source"
        style={{
          background: "#fff",
          border: "2px solid #ff0072",
          width: "8px",
          height: "8px",
        }}
      />
      <Handle
        type="target"
        position={Position.Right}
        id="right-target"
        style={{
          background: "#fff",
          border: "2px solid #ff0072",
          width: "8px",
          height: "8px",
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right-source"
        style={{
          background: "#fff",
          border: "2px solid #ff0072",
          width: "8px",
          height: "8px",
        }}
      />
    </div>
  );
};

export default memo(UseCaseNode);
