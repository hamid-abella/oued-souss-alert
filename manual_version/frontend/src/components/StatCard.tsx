import React from "react";

interface Props {
  label: string;
  value: number | string;
  color?: "default" | "danger" | "warning" | "success";
}

const colorMap = {
  default: "text-gray-900",
  danger: "text-red-600",
  warning: "text-orange-500",
  success: "text-green-600",
};

export const StatCard: React.FC<Props> = ({
  label,
  value,
  color = "default",
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-1">
      <span className="text-sm text-gray-500">{label}</span>
      <span className={`text-3xl font-semibold ${colorMap[color]}`}>
        {value}
      </span>
    </div>
  );
};

export default StatCard;
