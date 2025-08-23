import React from "react";
import { useSelector } from "react-redux";

export const BookingDebugInfo = () => {
  const booking = useSelector((state) => state.booking.selected);
  const tour = useSelector((state) => state.tour);

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="fixed bottom-4 bg-black bg-opacity-75 text-white p-4 rounded-lg text-xs max-w-xs z-50">
      <h4 className="font-bold mb-2">Debug Info</h4>

      {/* Información del Tour */}
      <div className="mb-3 border-b border-gray-600 pb-2">
        <h5 className="font-semibold text-blue-300 mb-1">Tour Status:</h5>
        <div className="space-y-1 text-blue-200">
          <div>
            <strong>Activo:</strong> {tour.isActive ? "SÍ" : "NO"}
          </div>
          <div>
            <strong>Página actual:</strong> {tour.currentPage || "Ninguna"}
          </div>
          <div>
            <strong>🔄 Continue Tour:</strong> {tour.continueTour ? "SÍ" : "NO"}
          </div>
          <div>
            <strong>Paso actual:</strong> {tour.currentStep || 0}
          </div>
        </div>
      </div>

      {/* Estado de Continuación del Tour */}
      <div className="mb-3 border-b border-gray-600 pb-2">
        <h5 className="font-semibold text-yellow-300 mb-1">Tour Continuación:</h5>
        <div className="space-y-1 text-yellow-200">
          <div className={`p-2 rounded ${tour.continueTour ? "bg-green-900" : "bg-red-900"}`}>
            <strong>Estado:</strong> {tour.continueTour ? "🟢 CONTINUARÁ" : "🔴 DETENIDO"}
          </div>
          {tour.continueTour && (
            <div className="text-xs">⚠️ El tour continuará automáticamente cuando navegues a la siguiente página</div>
          )}
          {!tour.continueTour && !tour.isActive && (
            <div className="text-xs">✅ El tour está completamente terminado</div>
          )}
        </div>
      </div>

      {/* Datos Persistentes */}
      <div className="mb-3">
        <h5 className="font-semibold text-green-300 mb-1">Booking Data:</h5>
        <div className="space-y-1 text-green-200">
          <div>
            <strong>Tipo:</strong> {booking.serviceType || "No definido"}
          </div>
          <div>
            <strong>En sucursal:</strong> {booking.isInBranch ? "Sí" : "No"}
          </div>
          <div>
            <strong>Sucursal:</strong> {booking.branch?.name || "No seleccionada"}
          </div>
          <div>
            <strong>Servicios:</strong> {booking.serviceCart?.length || 0}
          </div>
          <div>
            <strong>Precio total:</strong> ${booking.paymentInfo?.totalPrice || 0}
          </div>
        </div>
      </div>

      {/* Datos Temporales */}
      {/* <div>
        <h5 className="font-semibold text-red-300 mb-1">🔄 Datos Temporales (NUNCA se persisten):</h5>
        <div className="space-y-1 text-red-200">
          <div><strong>Empleado:</strong> {booking.employee?.fullName || 'SIEMPRE null'}</div>
          <div><strong>Fecha:</strong> {booking.bookingDate ? new Date(booking.bookingDate).toLocaleString() : 'SIEMPRE null'}</div>
          <div><strong>Método pago:</strong> {booking.paymentInfo?.paymentMethod || 'SIEMPRE vacío'}</div>
          <div><strong>Nombre:</strong> {booking.formData?.name || 'SIEMPRE vacío'}</div>
          <div><strong>Teléfono:</strong> {booking.formData?.telefono || 'SIEMPRE vacío'}</div>
        </div>
      </div> */}
    </div>
  );
};

export default BookingDebugInfo;
