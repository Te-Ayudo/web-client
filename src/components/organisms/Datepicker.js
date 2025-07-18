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
  traductor,
  blockedDates, 
  availability, 
  dateBusy, 
  hourPicker, 
  _hourPicker, 
  onDateChange, 
  onTimeSelect,
  fullDateBusy,
  maxAvailableAfterHours
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
  const isToday = moment(selectedDate).isSame(moment(), 'day');
  console.log('max av',maxAvailableAfterHours)
  let i = maxAvailableAfterHours * 2; // si tus intervalos de media hora
  const now = new Date();

  const sortedSlots = hourPicker
    .map((timestamp) => new Date(timestamp))
    .sort((a, b) => a - b); // para asegurarte de procesarlos en orden asc

  const filteredSlots = [];

  for (const time of sortedSlots) {

    // 1) si no es hoy, se añade
    if (!isToday) {
      filteredSlots.push(time);
      continue;
    }

    // 2) si es hoy pero es anterior a 'ahora', se descarta
    if (time <= now) {
      continue;
    }

    // 3) si es hoy y está en el futuro, descartar 'i' intervalos primero
    if(maxAvailableAfterHours < 24){
      if (i > 0) {
        i--;
        continue;
      }
    }

    // 4) si ya no hay que descartar más, se añade al array final
    filteredSlots.push(time);
  }
  return (
    <Card translate="no" className="sm:p-4 sm:pr-2 py-2 pl-0.5 pr-0 flex flex-row gap-2">
        <CustomDatepicker 
          calendarRef={calendarRef} 
          blockedDates={blockedDates} 
          availability={availability} 
          dateBusy={dateBusy}
          onDateChange={handleDateChange}
          _hourPicker={_hourPicker}
          fullDateBusy={fullDateBusy || []}
          maxAvailableAfterHours={maxAvailableAfterHours}
        />
        <div className="w-full overflow-y-auto pr-3 min-w-[10px]"
             style={{ height: `${calendarHeight}px` }}
        >
          <CardHeader className="sm:pr-4 sm:pl-4 text-center p-0">
            <h4 className="font-semibold mb-2 text-base sm:text-xl text-primary">Seleccionar Hora</h4>
          </CardHeader>
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
        </div>
    </Card>
  );
}
