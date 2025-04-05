import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { format } from "date-fns"; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Calendar } from "lucide-react";
import moment from "moment";
// import "react-datepicker/dist/react-datepicker.css";

export default function CustomDatepicker({calendarRef, blockedDates, availability, dateBusy, onDateChange, _hourPicker}) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  
  const renderHeader = ({
    date,
    changeYear,
    changeMonth,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled
  }) => {
    const dayMonthYear = format(date, "dd/MM/yyyy");
    const currentMonthIndex = date.getMonth();
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
          setSelectedDate(date)
          onDateChange(date)
        }}
        inline
        minDate={new Date()}
        renderCustomHeader={renderHeader}
        dateFormat="Pp"
        filterDate={(date) => {
          const _date = moment(date);

          const isBlocked = blockedDates.some((blockedDate) =>
            _date.isSame(blockedDate, "day")
          );
  
          // Verificar disponibilidad en `availability`
          const isAvailable = availability[_date.isoWeekday() - 1]?.length > 0;
          const dayIndex = _date.isoWeekday() - 1;
          const employeeAvailability = availability[dayIndex];
          if (employeeAvailability.length === 0) return false; 
          const busyPeriods = dateBusy
            .filter(busy => moment(busy.start).isSame(_date, "day"))
            .map(({ start, end }) => ({
              start: moment(start).hours() * 60 + moment(start).minutes(),
              end: moment(end).hours() * 60 + moment(end).minutes(),
            }));
          let availableMinutes = new Set();
          employeeAvailability.forEach(({ startHour, startMinute, endHour, endMinute }) => {
            for (let i = startHour * 60 + startMinute; i < endHour * 60 + endMinute; i++) {
              availableMinutes.add(i);
            }
          });

          busyPeriods.forEach(({ start, end }) => {
            for (let i = start; i < end; i++) {
              availableMinutes.delete(i);
            }
          });
          const allIntervalsBusy = availableMinutes.size === 0;
          return isAvailable && !isBlocked && !allIntervalsBusy;
        }}
        onCalendarOpen={() => {
          _hourPicker(new Date());
        }}
      />
    </div>
  );
}