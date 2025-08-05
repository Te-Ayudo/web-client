import React from "react";

export const EmptyStateSelect = ({ 
  title, 
  message, 
  actionText = "Escoger otra", 
  onAction = null,
  showAction = true 
}) => {
  return (
    <div className="w-full">
      <div className="mb-2">
        <div className="text-sm font-medium text-gray-700">{title}</div>
      </div>
      <div className="relative">
        <div className="w-full rounded-2xl border border-gray-200 px-4 py-3 bg-gray-50">
          <div className="text-gray-500 text-sm">{message}</div>
        </div>
      </div>
      {showAction && onAction && (
        <div className="mt-2">
          <button
            type="button"
            onClick={onAction}
            className="text-primary underline underline-offset-2 hover:text-orange-500 transition-colors text-sm font-medium"
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
          >
            {actionText}
          </button>
        </div>
      )}
    </div>
  );
}; 