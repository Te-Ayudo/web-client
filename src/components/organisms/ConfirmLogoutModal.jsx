// components/modals/ConfirmLogoutModal.jsx
import React from "react";

export default function ConfirmLogoutModal({ visible, onConfirm, onCancel }) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-sm w-[90%] p-6 shadow-xl animate-modal-pop">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">¿Cerrar sesión?</h3>
        <p className="text-sm text-gray-600 mb-6">Se cerrará tu sesión actual y volverás al inicio.</p>

        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 rounded-md border text-gray-700 hover:bg-gray-50">
            Cancelar
          </button>

          <button onClick={onConfirm} className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90">
            Sí, cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
