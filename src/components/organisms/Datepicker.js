import React, { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import CustomDatepicker from "./CustomDatePicker";
import { Card, CardHeader } from "../ui/card";


function generateTimeSlots(periodData, baseDate, interval = 30) {
  if (!periodData || periodData.length === 0) return [];
  const period = periodData[0];
  let start = moment(baseDate)
    .hour(period.startHour)
    .minute(period.startMinute)
    .second(0)
    .millisecond(0);
  let end = moment(baseDate)
    .hour(period.endHour)
    .minute(period.endMinute)
    .second(0)
    .millisecond(0);
  let slots = [];
  while (start.isBefore(end) || start.isSame(end)) {
    slots.push(start.toDate());
    start.add(interval, "minutes");
  }
  return slots;
}
export default function MyCalendar({
  blockedDates, 
  availability, 
  dateBusy, 
  hourPicker, 
  _hourPicker, 
  onDateChange, 
  onTimeSelect
}) {
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const calendarRef = useRef(null);
  const [calendarHeight, setCalendarHeight] = useState(380);
  const [loadingHours, setLoadingHours] = useState(false);
  
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
    
  };
  
  useEffect(() => {
    setLoadingHours(true);
    // Llama a _hourPicker y asume que es una función asíncrona que retorna una promesa
    Promise.resolve(_hourPicker(selectedDate)).then(() => {
      setLoadingHours(false);
    });
  }, [selectedDate])
  
  useEffect(() => {
    handleDateChange(new Date());
  }, []);

  const handleTimeClick = (time) => {
    setSelectedTime(time);
    onDateChange(time);
    onTimeSelect && onTimeSelect(time);
  };
  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setCalendarHeight(entry.contentRect.height);
      }
    });
  
    if (calendarRef.current) {
      const container = calendarRef.current.querySelector(".react-datepicker__month-container");
      if (container) {
        observer.observe(container);
      }
    }
  
    return () => {
      observer.disconnect(); // Cleanup
    };
  }, []);
  const dayIndex = moment(selectedDate).isoWeekday() - 1;
  // const availableSlots = generateTimeSlots(availability[dayIndex], selectedDate, 30);
  const availableSlots = hourPicker.map((timestamp) => new Date(timestamp));
  // 1) Determinar si la fecha seleccionada es “hoy”
  const isToday = moment(selectedDate).isSame(moment(), 'day');
  // 2) Convertir hourPicker (timestamps) a Date, y filtrar si es hoy 
  const filteredSlots = hourPicker
  .map((timestamp) => new Date(timestamp))
  .filter((time) => {
    if (!isToday) return true; 
    // Si es hoy, solo mostrar si time > ahora
    return time > new Date();
  });
  return (
    // <div className="p-4 bg-white shadow-md rounded-xl max-w-full overflow-hidden">
    <Card className="sm:p-4 sm:pr-2 py-2 pl-0.5 pr-0 flex flex-row gap-2">
      {/* <div className="flex flex-col flex-wrap gap-2"> */}
        {/* Calendario */}
        <CustomDatepicker 
          calendarRef={calendarRef} 
          blockedDates={blockedDates} 
          availability={availability} 
          dateBusy={dateBusy}
          onDateChange={handleDateChange}
          _hourPicker={_hourPicker}
        />

        {/* Sección de horas */}
        <div className="w-full overflow-y-auto pr-3 min-w-[10px]"
             style={{ height: `${calendarHeight}px` }}
        >
          <CardHeader className="sm:pr-4 sm:pl-4 text-center p-0">
            <h4 className="font-semibold mb-2 text-base sm:text-xl text-primary">Seleccionar Hora</h4>
          </CardHeader>
          {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-2"> */}
              {/* {availableSlots.map((time) => {
                const label = moment(time).format("HH:mm A");
                const isSelected = selectedTime && time.getTime() === selectedTime.getTime();
                const isEnabled = hourPicker.includes(time.getTime());
                return (
                  <button
                    key={time.getTime()}
                    onClick={() => isEnabled && handleTimeClick(time)}
                    disabled={!isEnabled}
                    className={`py-2 px-3 rounded-lg text-xs sm:text-sm border 
                      ${
                        isSelected
                          ? "border-[#FF770F] bg-[#fff7f1] text-[#FF770F] font-medium"
                          : isEnabled
                          ? "border-gray-300 bg-white hover:bg-[#fff7f1]"
                          : "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                  >
                    {label}
                  </button>
                );
              })} */}
              {/* {availableSlots
                .filter((time) => hourPicker.includes(time.getTime())) // solo horarios habilitados
                .map((time) => {
                  const label = moment(time).format("HH:mm A");
                  const isSelected = selectedTime && time.getTime() === selectedTime.getTime();
                  return (
                    <button
                      key={time.getTime()}
                      onClick={() => handleTimeClick(time)}
                      className={`py-2 px-3 rounded-lg text-xs sm:text-sm border 
                        ${
                          isSelected
                            ? "border-[#FF770F] bg-[#fff7f1] text-[#FF770F] font-medium"
                            : "border-gray-300 bg-white hover:bg-[#fff7f1]"
                        }`}
                    >
                      {label}
                    </button>
                  );
                })} */}
              {filteredSlots.length === 0 ? (
                <p className="text-gray-500 text-sm flex items-center justify-center">
                  No hay horas disponibles
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {filteredSlots.map((time) => {
                      const label = moment(time).format("hh:mm A");
                      const isSelected = selectedTime && time.getTime() === selectedTime.getTime();
                      return (
                        <button
                          key={time.getTime()}
                          onClick={() => handleTimeClick(time)}
                          className={`py-2 px-3 rounded-lg text-xs sm:text-sm border ${
                            isSelected
                              ? "border-[#FF770F] bg-[#fff7f1] text-[#FF770F] font-medium"
                              : "border-gray-300 bg-white hover:bg-[#fff7f1]"
                          }`}
                        >
                          {label}
                        </button>
                      );
                  })}  
                </div>
              )}
          {/* </div> */}
        </div>
    </Card>
  );
}
