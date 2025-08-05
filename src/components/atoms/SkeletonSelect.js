import React from "react";

export const SkeletonSelect = ({ title, message = "Cargando..." }) => {
  return (
    <div className="w-full">
      <div className="mb-2">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3"></div>
      </div>
      <div className="relative">
        <div className="w-full rounded-2xl border border-gray-200 px-4 py-3 bg-gray-50 animate-pulse">
          <div className="h-5 bg-gray-200 rounded animate-pulse w-1/2"></div>
        </div>
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
          <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
      <div className="mt-2">
        <div className="text-sm text-gray-500">{message}</div>
      </div>
    </div>
  );
}; 