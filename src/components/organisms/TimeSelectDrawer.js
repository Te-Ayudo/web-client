import React, { useEffect, useState } from "react";
import moment from "moment";
import SelectDrawer from "./SelectDrawer";

export default function TimeSelectDrawer({
  selectedDate,
  onTimeSelect,
  maxAvailableAfterHours,
  hourPicker = [],
  disabled = false,
  loading: externalLoading = false,
  noHoursMessage = "No hay horarios disponibles para esa fecha",
  onSelectAnotherDate = null
}) {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTime, setSelectedTime] = useState("");
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  // Usar las horas que ya se cargaron desde el hook
  useEffect(() => {
    if (hourPicker && hourPicker.length > 0) {
      processHourPicker(hourPicker);
    } else {
      setAvailableSlots([]);
      setSelectedTime("");
      setHasLoadedOnce(false);
    }
  }, [hourPicker, selectedDate]);

  const processHourPicker = (hourPickerArray) => {
    
    if (!hourPickerArray || hourPickerArray.length === 0) {
      setAvailableSlots([]);
      setHasLoadedOnce(true);
      return;
    }
    
    setLoading(true);
    
    try {
      // Procesar las horas disponibles
      const isToday = moment(selectedDate).isSame(moment(), 'day');
      const now = new Date();
      const currentTime = moment(now);

      const sortedSlots = hourPickerArray
        .map((timestamp) => new Date(timestamp))
        .sort((a, b) => a - b);

      const filteredSlots = [];

      for (const time of sortedSlots) {
        const timeMoment = moment(time);
        
        // Si es hoy, verificar que la hora no haya pasado
        if (isToday) {
          // Si la hora ya pasó, saltarla
          if (timeMoment.isBefore(currentTime)) {
            continue;
          }
          
          // Aplicar maxAvailableAfterHours solo para hoy
          if (maxAvailableAfterHours < 24) {
            const cutoffTime = moment().add(maxAvailableAfterHours, 'hours');
            if (timeMoment.isBefore(cutoffTime)) {
              continue;
            }
          }
        } else {
          // Para días futuros, solo aplicar maxAvailableAfterHours si es menos de 24 horas
          if (maxAvailableAfterHours < 24) {
            const cutoffTime = moment().add(maxAvailableAfterHours, 'hours');
            if (timeMoment.isBefore(cutoffTime)) {
              continue;
            }
          }
        }

        // Si pasó todos los filtros, agregar al array
        filteredSlots.push(time);
      }

      setAvailableSlots(filteredSlots);
      setHasLoadedOnce(true);
    } catch (error) {
      console.error('Error procesando horas disponibles:', error);
      setAvailableSlots([]);
      setHasLoadedOnce(true);
    } finally {
      setLoading(false);
    }
  };

  const handleTimeChange = (timeValue) => {
    setSelectedTime(timeValue);
    
    if (timeValue) {
      // Crear la fecha combinando la fecha seleccionada con la hora
      const selectedTimeObj = new Date(timeValue);
      
      // Usar moment para combinar fecha y hora correctamente
      const combinedDateTime = moment(selectedDate)
        .hours(selectedTimeObj.getHours())
        .minutes(selectedTimeObj.getMinutes())
        .seconds(0)
        .milliseconds(0);
      onTimeSelect(combinedDateTime.toDate());
    } else {
      onTimeSelect(null);
    }
  };

  // Convertir las horas disponibles a opciones para el drawer
  const timeOptions = availableSlots.map((time) => ({
    value: time.toISOString(),
    label: moment(time).format("hh:mm A")
  }));
  

  // Determinar el mensaje de error
  const getErrorMessage = () => {
    if (externalLoading || loading) return null; // No mostrar error mientras carga
    if (hasLoadedOnce && availableSlots.length === 0) {
      return noHoursMessage;
    }
    return null;
  };

  // Determinar si mostrar el botón de "escoger otra fecha"
  const shouldShowSelectAnother = () => {
    return hasLoadedOnce && availableSlots.length === 0 && onSelectAnotherDate;
  };

  return (
    <div className="relative">
      <SelectDrawer
        value={selectedTime}
        onChange={handleTimeChange}
        options={timeOptions}
        placeholder="Selecciona una hora"
        title="Seleccionar Hora"
        disabled={disabled}
        loading={externalLoading || loading}
        error={getErrorMessage()}
      />
      {/* Mostrar error y botón de acción debajo del input */}
      {getErrorMessage() && (
        <div className="mt-1">
          <span className="text-red-500 text-xs block">
            {getErrorMessage()}
          </span>
          {shouldShowSelectAnother() && (
            <button
              type="button"
              onClick={onSelectAnotherDate}
              className="text-primary underline underline-offset-2 hover:text-orange-500 transition-colors text-xs font-medium mt-1"
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
            >
              Escoger otra fecha
            </button>
          )}
        </div>
      )}
    </div>
  );
} 