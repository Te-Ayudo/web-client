import React, { useState } from "react";
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "../ui/drawer";
import { ChevronDown } from "lucide-react";

export default function SelectDrawer({
  value,
  onChange,
  options,
  placeholder,
  title,
  disabled = false,
  loading = false,
  error = null,
  showImages = false,
  noOptionsMessage = null,
  //props para cypress
  dataCyContainer = "select-empleado", // 👈 Nombre del contenedor
  dataCyTrigger = "appointment-employee", // 👈 Nombre del botón que abre
  dataCyOption = "employee-option", // 👈 Nombre de cada opción
  ...rest
}) {
  const [open, setOpen] = useState(false);
  const selectedOption = options.find((option) =>
    typeof option === "object" ? option.value === value : option === value
  );

  const handleSelect = (option) => {
    const optionValue = typeof option === "object" ? option.value : option;
    onChange(optionValue);
    setOpen(false);
  };

  const getDisplayValue = () => {
    if (disabled) return "Selecciona una fecha primero";
    if (error) return error;
    if (selectedOption) {
      return typeof selectedOption === "object" ? selectedOption.label : selectedOption;
    }
    return placeholder;
  };
  // probamos PR otra vez

  return (
    <div className="relative">
      <Drawer
        open={open}
        onOpenChange={setOpen}
        modal={true}
        preventScrollRestoration={true}
        disablePreventScroll={false}
      >
        <DrawerTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            data-cy={dataCyTrigger}
            className={`peer w-full rounded-2xl border border-primary px-4 py-3 text-secondary text-left bg-white focus:outline-none focus:border-2 focus:border-primary appearance-none flex items-center justify-between ${
              disabled ? "bg-gray-100 cursor-not-allowed" : "cursor-pointer"
            } ${selectedOption ? "text-black" : "text-gray-400"}`}
          >
            <span className="truncate">{getDisplayValue()}</span>
            <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
          </button>
        </DrawerTrigger>

        <DrawerContent>
          <DrawerHeader className="border-b">
            <DrawerTitle className="text-center">{title}</DrawerTitle>
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-3">
              {loading ? (
                // Skeleton mientras carga
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="w-full p-4 rounded-xl border border-gray-200 animate-pulse">
                    <div className="flex items-center gap-3">
                      {showImages && <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse"></div>}
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                      </div>
                      <div className="w-5 h-5 bg-gray-200 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                ))
              ) : options.length === 0 && noOptionsMessage ? (
                // Mensaje cuando no hay opciones
                <div className="text-center py-8">
                  <div className="text-gray-500 text-sm">{noOptionsMessage}</div>
                </div>
              ) : (
                // Opciones normales
                options.map((option, index) => {
                  const optionValue = typeof option === "object" ? option.value : option;
                  const optionLabel = typeof option === "object" ? option.label : option;
                  const optionData = typeof option === "object" ? option : null;
                  const isSelected = value === optionValue;

                  return (
                    <button
                      key={index}
                      onClick={() => handleSelect(option)}
                      role="option"
                      aria-selected={isSelected}
                      className={`w-full text-left p-4 rounded-xl border transition-all duration-200 hover:shadow-sm ${
                        isSelected
                          ? "border-primary bg-orange-50 shadow-sm"
                          : "border-gray-200 hover:border-primary hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        {/* Contenido izquierdo: Imagen (si aplica) + Texto */}
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {/* Imagen del empleado (si showImages es true y hay picture) */}
                          {showImages && optionData?.picture && (
                            <div className="flex-shrink-0">
                              <img
                                src={optionData.picture}
                                alt={optionLabel}
                                className="w-12 h-12 rounded-lg object-cover border border-gray-200 shadow-sm"
                              />
                            </div>
                          )}

                          {/* Texto */}
                          <span className={`font-medium truncate ${isSelected ? "text-primary" : "text-gray-700"}`}>
                            {optionLabel}
                          </span>
                        </div>

                        {/* Radio Button a la derecha */}
                        <div
                          className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            isSelected ? "border-primary bg-primary" : "border-gray-300"
                          }`}
                        >
                          {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          <div className="p-4 border-t">
            <DrawerClose asChild>
              <button className="w-full py-3 px-4 text-gray-500 hover:text-gray-700 transition-colors font-medium">
                Cancelar
              </button>
            </DrawerClose>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Label flotante que solo aparece cuando hay valor */}
      {selectedOption && (
        <label className="absolute left-4 bg-white px-1 text-xs text-primary -top-2 pointer-events-none">{title}</label>
      )}
    </div>
  );
}
