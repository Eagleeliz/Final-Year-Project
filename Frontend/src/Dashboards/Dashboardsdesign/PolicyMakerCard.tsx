import React, { type ReactNode } from "react";

interface PolicyMakerCardProps {
  title?: string;
  children: ReactNode;
}

const PolicyMakerCard: React.FC<PolicyMakerCardProps> = ({ title, children }) => {
  const midnightTeal = "#002e33";

  return (
    <div
      className="bg-white p-6 rounded-2xl shadow-sm border-l-4"
      style={{ borderLeftColor: midnightTeal }}
    >
      {title && (
        <h3
          className="text-xs font-bold uppercase tracking-widest mb-4"
          style={{ color: midnightTeal }}
        >
          {title}
        </h3>
      )}
      <div className="text-gray-800">
        {children}
      </div>
    </div>
  );
};

export default PolicyMakerCard;