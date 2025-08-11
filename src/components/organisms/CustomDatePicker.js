import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { format } from "date-fns"; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Calendar } from "lucide-react";
import moment from "moment";
import { es } from "date-fns/locale/es"; 

export default function CustomDatepicker({
  calendarRef, 
  blockedDates, 
  availability, 
  dateBusy, 
  onDateChange, 
  fullDateBusy,
  maxAvailableAfterHours
}) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [, setCurrentYear] = useState(new Date().getFullYear());

  const renderHeader = ({
    date,
    changeYear,
    changeMonth,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
  }) => {
    const dayMonthYear = format(date, "dd/MM/yyyy");
    const currentYear = date.getFullYear();
    
    const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const years = [2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032];
  
    return (
      <div className="my-datepicker-header">      
        <div className="header-top" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="header-selected-date flex">
            <Calendar className="w-[18px] h-[18px] sm:w-[22px] sm:h-[22px] mr-2 flex justify-center " />
            {dayMonthYear}
          </span>
          <div className="header-arrows">
            <button
              onClick={() => {
                decreaseMonth();
                const newDate = new Date(date);
                newDate.setMonth(newDate.getMonth() - 1);
                setCurrentMonth(newDate.getMonth());
                setCurrentYear(newDate.getFullYear());
              }}
              disabled={prevMonthButtonDisabled}
              className="circle-arrow-btn"
            >
              &lt;
            </button>
            <button
              onClick={() => {
                increaseMonth();
                const newDate = new Date(date);
                newDate.setMonth(newDate.getMonth() + 1);
                setCurrentMonth(newDate.getMonth());
                setCurrentYear(newDate.getFullYear());
              }}
              disabled={nextMonthButtonDisabled}
              className="circle-arrow-btn"
            >
              &gt;
            </button>
          </div>
        </div>
  
        <div className="header-navigation" style={{ display: "flex" }}>
          <div className="header-navigation-mes">
            <Select 
              onValueChange={(val) => {
                changeMonth(Number(val));
                setCurrentMonth(Number(val));
              }}
              value={String(currentMonth)}
            >
              <SelectTrigger className="w-full rounded-none text-sm sm:text-base"> 
                <SelectValue placeholder="Seleccionar mes" />
              </SelectTrigger>
              <SelectContent>
                {months.map((mes, i) => (
                  <SelectItem key={i} value={String(i)}>
                    {mes}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="header-navigation-year">
            <Select 
              onValueChange={(val) => {
                changeYear(Number(val));
                setCurrentYear(Number(val));
              }}
              value={String(currentYear)}
            >
              <SelectTrigger className="w-full rounded-none text-sm sm:text-base">
                <SelectValue placeholder="Seleccionar año" />
              </SelectTrigger>
              <SelectContent>
                {years.map((y) => (
                  <SelectItem key={y} value={String(y)}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div ref={calendarRef} className="my-datepicker-container w-full max-w-[340px] sm:max-w-[400px] md:max-w-[500px]">
      <DatePicker
        selected={selectedDate}
        onChange={(date) => {
          setSelectedDate(date);
          onDateChange(date);
        }}
        inline
        minDate={new Date()}
        renderCustomHeader={renderHeader}
        dateFormat="Pp"
        locale={es}
        filterDate={(date) => {
          const _date = moment(date);
          const cutoff = moment().add(maxAvailableAfterHours, "hours");

          // 2) Si dayMoment está por debajo de cutoff, se bloquea.
          if (_date.isBefore(cutoff, "day")) {
            return false;
          }
          
          // 1) Chequea si está en fullDateBusy
          if (fullDateBusy.includes(_date.format("YYYY-MM-DD"))) {
            return false;
          }

          // 2) Chequea si está en blockedDates
          if (blockedDates.some((blockedDate) =>
            _date.isSame(blockedDate, "day")
          )) {
            return false;
          }

          // 3) Chequea si no hay disponibilidad formal ese día
          const dayIndex = _date.isoWeekday() - 1;
          if (!availability[dayIndex] || availability[dayIndex].length === 0) {
            return false;
          }

          // 4) Si pasó todos los checks, se considera día habilitado
          return true;
        }}
      />
    </div>
  );
}