import { memo } from "react";

interface SystemNodeProps {
  data: {
    label: string;
  };
}

const SystemNode = ({ data }: SystemNodeProps) => {
  return (
    <div
      style={{
        padding: "15px",
        border: "2px solid #00a650",
        borderRadius: "3px",
        background: "rgba(255, 255, 255, 0.9)",
        minWidth: "300px",
        minHeight: "200px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          fontWeight: "bold",
          marginBottom: "10px",
          textAlign: "center",
          borderBottom: "1px solid #00a650",
          paddingBottom: "5px",
        }}
      >
        {data.label}
      </div>
      <div
        style={{
          flex: 1,
          border: "1px dashed #00a650",
          borderRadius: "3px",
          padding: "20px",
          backgroundColor: "rgba(0, 166, 80, 0.05)",
        }}
      />
    </div>
  );
};

export default memo(SystemNode);
