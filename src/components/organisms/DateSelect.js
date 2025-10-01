import React, { useState } from "react";
import { format } from "date-fns";
import { Dialog, DialogContent } from "../ui/dialog";
import CustomDatepicker from "./CustomDatePicker";

export default function DateSelect({
  selectedDate,
  onDateChange,
  blockedDates,
  availability,
  dateBusy,
  fullDateBusy,
  maxAvailableAfterHours,
}) {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [focusDate, setFocusDate] = useState(false);

  const handleDateSelect = (date) => {
    onDateChange(date);
    setCalendarOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        data-cy="btn-open-calendar"
        data-date-select
        className={`peer w-full rounded-2xl border border-primary px-4 py-3 text-secondary text-left bg-white focus:outline-none focus:border-2 focus:border-primary ${
          selectedDate ? "text-black" : "text-gray-400"
        }`}
        onClick={() => {
          setCalendarOpen(true);
          setFocusDate(true);
        }}
        onBlur={() => setFocusDate(false)}
      >
        {selectedDate ? format(selectedDate, "dd/MM/yyyy") : "Seleccionar fecha"}
      </button>
      {/* Label flotante que solo aparece cuando hay fecha seleccionada */}
      {selectedDate && (
        <label className="absolute left-4 bg-white px-1 text-xs text-primary -top-2 pointer-events-none">Fecha *</label>
      )}
      <Dialog open={calendarOpen} onOpenChange={setCalendarOpen}>
        <DialogContent className="p-0 max-w-[320px] sm:max-w-[350px] [&_[data-dialog-close]]:hidden">
          <CustomDatepicker
            calendarRef={null}
            blockedDates={blockedDates}
            availability={availability}
            dateBusy={dateBusy}
            onDateChange={handleDateSelect}
            fullDateBusy={fullDateBusy || []}
            maxAvailableAfterHours={maxAvailableAfterHours}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
