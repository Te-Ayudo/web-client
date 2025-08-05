import React from "react";
import { formatCurrency } from "../../utils/formatCurrency";

export const ServicesInfoTooltip = ({ services, totalPrice }) => {
  if (!services || services.length === 0) {
    return null;
  }

  return (
    <div className="absolute right-0 top-full mt-2 w-60 sm:w-80 bg-white rounded-xl shadow-lg border border-gray-200 p-3 sm:p-4 z-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
        <h4 className="text-sm font-semibold text-gray-800">Servicios seleccionados</h4>
        <div className="w-2 h-2 bg-primary rounded-full"></div>
      </div>

      {/* Services List */}
      <div className="space-y-2 sm:space-y-3 max-h-40 sm:max-h-48 overflow-y-auto">
        {services.map((item, index) => (
          <div key={item.service._id} className="flex items-center gap-2 sm:gap-3">
            {/* Service Image */}
            <div className="flex-shrink-0">
              <img
                src={item.service.imageURL || "https://placehold.co/60x60/f3f4f6/9ca3af?text=?"}
                alt={item.service.name}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover border border-gray-200"
                onError={(e) => {
                  e.target.src = "https://placehold.co/60x60/f3f4f6/9ca3af?text=?";
                }}
              />
            </div>

            {/* Service Details */}
            <div className="flex-1 min-w-0">
              <h5 className="text-xs sm:text-sm font-medium text-gray-800 truncate">
                {item.service.name}
              </h5>
              <p className="text-xs text-gray-500 truncate hidden sm:block">
                {item.service.description}
              </p>
              <div className="flex items-center gap-1 sm:gap-2 mt-1">
                <span className="text-xs text-gray-400">
                  {item.quantity}x
                </span>
                <span className="text-xs text-gray-400 hidden sm:inline">•</span>
                <span className="text-xs text-gray-400">
                  {item.estimatedWorkMinutes}min
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex-shrink-0 text-right">
              <div className="text-xs sm:text-sm font-semibold text-gray-800">
                {formatCurrency(item.price)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-sm font-medium text-gray-700">Total:</span>
          <span className="text-sm sm:text-lg font-bold text-primary">
            {formatCurrency(totalPrice)}
          </span>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {services.reduce((acc, item) => acc + item.estimatedWorkMinutes, 0)} min total
        </div>
      </div>

      {/* Arrow */}
      <div className="absolute -top-2 right-3 sm:right-4 w-3 h-3 sm:w-4 sm:h-4 bg-white border-l border-t border-gray-200 transform rotate-45"></div>
    </div>
  );
}; 