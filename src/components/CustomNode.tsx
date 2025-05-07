import { memo } from "react";
import { Handle, Position } from "reactflow";

interface CustomNodeProps {
  data: {
    label: string;
  };
}

const CustomNode = ({ data }: CustomNodeProps) => {
  return (
    <div className="react-flow__node">
      <Handle type="target" position={Position.Top} />
      <div>{data.label}</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default memo(CustomNode);
