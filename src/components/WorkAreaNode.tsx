import { memo, useState, useCallback } from "react";
import { NodeResizer } from "reactflow";

interface WorkAreaNodeProps {
  selected: boolean;
  data: {
    label: string;
  };
}

const WorkAreaNode = ({ selected, data }: WorkAreaNodeProps) => {
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
      }
    },
    []
  );

  const handleBlur = useCallback(() => {
    setIsEditing(false);
    data.label = label;
  }, [data, label]);

  return (
    <>
      <NodeResizer
        minWidth={50}
        minHeight={50}
        maxWidth={1000}
        maxHeight={1000}
        isVisible={selected}
        handleStyle={{
          width: "8px",
          height: "8px",
          backgroundColor: "#3b82f6",
          border: "1px solid #2563eb",
        }}
        lineStyle={{
          borderWidth: "1px",
          borderColor: "#3b82f6",
        }}
      />
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#ffffff",
          border: "1px solid #ccc",
          borderRadius: "5px",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        <div
          style={{
            width: "100%",
            padding: "8px",
            borderBottom: "1px solid #eee",
            backgroundColor: "#f8f9fa",
            borderTopLeftRadius: "5px",
            borderTopRightRadius: "5px",
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
                fontSize: "14px",
                padding: "4px 8px",
                border: "2px solid #4a90e2",
                borderRadius: "4px",
                outline: "none",
                textAlign: "center",
                backgroundColor: "#ffffff",
              }}
            />
          ) : (
            <div
              onDoubleClick={handleDoubleClick}
              style={{
                width: "100%",
                textAlign: "center",
                padding: "4px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "bold",
                color: "#333",
                borderRadius: "4px",
                transition: "background-color 0.2s",
                backgroundColor: "transparent",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#f0f0f0")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              {label}
            </div>
          )}
        </div>

        <div
          style={{
            flex: 1,
            padding: "10px",
          }}
        ></div>
      </div>
    </>
  );
};

export default memo(WorkAreaNode);
