import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  BOOKING_CUSTOMER_FULLNAME,
  BOOKING_CUSTOMER_PHONE,
  BOOKING_PAGO,
  BOOKING_SET,
  BOOKING_SET_COUPON,
  BOOKING_SET_EMPLOYEE,
  setActiveModalAddress,
} from "../../store";
import Input from "../atoms/Input";
import Button from "../atoms/Button";
import TextArea from "../atoms/TextArea";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { useCreateBookingScreen } from "./../../hooks";
import { addDays, format } from "date-fns";
import Maps from "../map/Map";
import moment from "moment";
import MyCalendar from "./Datepicker";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";

export const Appointment = () => {
  const booking = useSelector((state) => state.booking.selected);
  const dispatch = useDispatch();
  const [isBranch, setIsBranch] = useState( false )
  const isCheckingCouponBtn = useMemo(() => !!booking.coupon, [booking.coupon]);
  const {
    _hourPicker,
    maxAvailableAfterHours,
    availability,
    hourPicker,
    paymentMethods,
    onValueCh,
    addresses,
    employee,
    onSubmit,
    loading,
    onVerifyCoupon,
    unavailability,
    fullDateBusy,
    dateBusy
  } = useCreateBookingScreen();
  
  const [calendarOpen, setCalendarOpen] = useState(false);
  // Estado para guardar la fecha/hora seleccionada
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const handleTimeSelect = (time) => {
    setSelectedDateTime(time);
    dispatch(
      BOOKING_SET({
        bookingDate: format(
          new Date(time),
          "yyyy-MM-dd'T'HH:mm:ssxxx"
        ),
      })
    );
    setCalendarOpen(false); // Cierra el diálogo
  };

  const getBlockedDates = (unavailablePeriods = []) => {
    let blockedDates = [];
  
    unavailablePeriods.forEach(({ startDate, endDate }) => {
      let start = moment(startDate);
      let end = moment(endDate);
  
      let startDay = start.clone().startOf("day"); 
      let endDay = end.clone().startOf("day"); 
  
      while (startDay.isSameOrBefore(endDay)) {        
        if (startDay.isSame(start, "day")) {
          if (start.hours() <= 8) {
            blockedDates.push(startDay.clone()); 
          }
        }         
        else if (startDay.isSame(end, "day")) {
          if (end.hours() >= 23) {
            blockedDates.push(startDay.clone()); 
          }
        }         
        else {
          blockedDates.push(startDay.clone());
        }
  
        startDay.add(1, "day"); 
      }
    });
  
    return blockedDates;
  };
  const savedBooking = localStorage.getItem('bookingStorage');
  
	const finalBooking = JSON.parse(savedBooking);

  useEffect(() => {
    if (finalBooking?.isInBranch) {
      setIsBranch(true);
    }else{
      setIsBranch(false);
    }
  }, [finalBooking]);
  const employeeAvailableByBranch = (employees) => {
    
    return employees.filter((employee) =>
      finalBooking.isInBranch && finalBooking.branch._id === employee.branch
        ? employee
        : false
    );
  };
  const [formValues, setFormValues] = useState({
    name: "User Testing",
    telefono: "",
    start:
      maxAvailableAfterHours >= 24
        ? addDays(new Date().setHours(0, 0, 0, 0), 1)
        : null, //new Date(),
    empleado: "",
    descuento: "",
    metodopago: "",
  });
  // console.log('FORMVALUES: ',formValues)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));    
    let first_name = "";
    if (user.first_name) {
      first_name = user.first_name + " " + user.last_name;
    } else {
      if (user.displayName) {
        first_name = user.displayName;
      }
    }
    const phone = user.phone;
    setFormValues({
      name: first_name,
      telefono: phone,
      empleado: "",
      descuento: "",
      metodopago: "",
      start: null,
    });

    dispatch(BOOKING_CUSTOMER_PHONE({ phone })); 
  }, []);

  useEffect(() => {
    const now = new Date();
    if (hourPicker.length > 0 && !formValues.start) { 
      const startDate = hourPicker.find((hour) => {
        return new Date(hour).getTime() >= now.getTime();
      });
      if (startDate) {
        setFormValues({ ...formValues, start: new Date(startDate) });
        dispatch(
          BOOKING_SET({
            bookingDate: format(
              new Date(startDate),
              "yyyy-MM-dd'T'HH:mm:ssxxx"
            ),
          })
        );
      }
    }
  }, [hourPicker]);
  function updateBookingInLocalStorage(updates) {  
    const stored = localStorage.getItem("bookingStorage");
    if (!stored) return;    
    const booking = JSON.parse(stored);
    Object.assign(booking, updates);    
    localStorage.setItem("bookingStorage", JSON.stringify(booking));
  }
  const onInputChanged = ({ target }) => {
    setFormValues({
      ...formValues,
      [target.name]: target.value,
    });
    if (target.name === "descuento") {
      const descuento = target.value;
      dispatch(BOOKING_SET_COUPON(descuento));
    }
    if (target.name === "metodopago") {
      const paymentMethod = target.value;
      dispatch(BOOKING_PAGO({ paymentMethod }));
    }
    if (target.name === "name") {
      const fullName = target.value;
      dispatch(BOOKING_CUSTOMER_FULLNAME({ fullName }));
    }
    if (target.name === "telefono") {
      const phone = target.value;
      dispatch(BOOKING_CUSTOMER_PHONE({ phone }));
    }

    if (target.name === "empleado") {
      const a = !!target.value ? JSON.parse(target.value) : "{}";
      console.log('EMPLEADO!', a);

      updateBookingInLocalStorage({ employee: a, bookingDate: null });
      dispatch(BOOKING_SET_EMPLOYEE(a));
      dispatch(BOOKING_SET({ bookingDate: null }));

      setSelectedDateTime(null);
      setFormValues((prev) => ({
        ...prev,
        start: null,
      }));
    }


    if (target.name === "direccion") {
      const a = !!target.value ? JSON.parse(target.value) : "";
      onValueCh(a);
    }
  };

  const onDateChange = (event) => {
    setFormValues({
      ...formValues,
      start: event, // Actualiza directamente el valor seleccionado
    });
  };
  
  const onAddress = (e) => {
    e.preventDefault();
    dispatch(setActiveModalAddress());
  };
  const [blockedDates, setBlockedDate] = useState([]);
  useEffect(()=>{
    setBlockedDate(getBlockedDates(unavailability || []));
  }, [unavailability])
  // const blockedDates = getBlockedDates(unavailability || []);
  return (
    <>
      <div className="w-full">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-10 mx-auto">
            <div className="mb-3 sm:mb-6">
              <h2 className="text-primary font-[600] text-xl sm:text-2xl">Programar el Servicio</h2>
            </div>
          <form className="text-center" method="POST" onSubmit={onSubmit}>
            <div className="col-span-full">
              <div className="mb-3 sm:mb-6">
                <Input name="name" type="text" label="Nombre y Apellido" value={formValues.name} onChange={onInputChanged} />
              </div>
            </div>
            <div className="col-span-full">
              <div className="mb-3 sm:mb-6">
                <select name="empleado" className="rounded-2xl border-solid border border-primary w-full px-4 sm:px-6 py-2 sm:py-3 text-secondary" value={formValues.empleado} onChange={onInputChanged}>
                  <option value=""> Empleado (Opcional) ... </option>
                  {isBranch
                    ? employeeAvailableByBranch(employee).map((metodo) => {
                        return (
                          <option key={metodo._id} value={JSON.stringify(metodo)}>
                            {" "}
                            {metodo.fullName}{" "}
                          </option>
                        );
                      })
                    : employee.map((metodo) => {
                        return (
                          <option key={metodo._id} value={JSON.stringify(metodo)}>
                            {" "}
                            {metodo.fullName}{" "}
                          </option>
                        );
                      })}
                </select>
              </div>
            </div>

            <div className="col-span-full">
              <div className="mb-3 sm:mb-6">
                <div className="flex flex-wrap gap-4 w-full">
                  <div className="datePicker flex justify-end flex-row-reverse flex-grow sm:w-2/3 rounded-2xl border-solid border border-primary mb-3 sm:mb-0 w-full">
                    <Dialog open={calendarOpen} onOpenChange={setCalendarOpen}>
                      <DialogTrigger asChild>
                        <button translate="no" className="rounded-2xl border w-full px-4 py-2 text-secondary text-left">
                          {selectedDateTime
                            ? format(selectedDateTime, "dd/MM/yyyy HH:mm")
                            : "Seleccionar fecha personalizada"}
                        </button>
                      </DialogTrigger>
                      <DialogContent className="p-0 sm:max-w-[600px] [&_[data-dialog-close]]:hidden">
                        <MyCalendar 
                          translate="no"
                          availability={availability} 
                          dateBusy={dateBusy} 
                          blockedDates={blockedDates} 
                          hourPicker={hourPicker} 
                          _hourPicker={_hourPicker}
                          onDateChange={onDateChange}
                          onTimeSelect={handleTimeSelect}
                          fullDateBusy={fullDateBusy || []}
                          maxAvailableAfterHours={maxAvailableAfterHours}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-full">
              <div className="mb-3 sm:mb-6">
                <div className="flex flex-wrap gap-4">
                  <div className="grow">
                    <Input name="descuento" type="text" label="Codigo de descuento" value={formValues.descuento} onChange={onInputChanged} />
                  </div>
                  <div className="grow">
                    <Button disabled={!isCheckingCouponBtn} onClick={onVerifyCoupon} className="sm:h-[48px] !text-[14px] w-full">
                      Aplicar Cupon
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-full">
              <div className="mb-3 sm:mb-6">
                <select name="metodopago" className="rounded-2xl border-solid border border-primary w-full px-4 sm:px-6 py-2 sm:py-3 text-secondary" value={formValues.metodopago} onChange={onInputChanged}>
                  <option value=""> Metodo de Pago ... </option>
                  {paymentMethods.map((metodo) => {
                    return (
                      <option key={metodo.value} value={metodo.value}>
                        {" "}
                        {metodo.label}{" "}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            {!booking.isInBranch && (
              <div className="col-span-full">
                <div className="mb-3 sm:mb-6 text-left">
                  <h2 className="text-primary font-[600] ">Direccion (seleccionar direccion)</h2>
                </div>
                <div className="mb-3 sm:mb-6">
                  <div className="flex flex-wrap gap-4">
                    <div className="grow">
                      {Object.keys(addresses).length === 0 ? (
                        "No tienes direccion"
                      ) : (
                        <select name="direccion" className="rounded-2xl border-solid border border-primary w-full px-4 sm:px-6 py-2 sm:py-3 text-secondary" value={formValues.direccion} onChange={onInputChanged}>
                          <option value=""> Seleccionar ... </option>
                          {addresses.map((metodo) => {
                            return (
                              <option key={metodo.key} value={JSON.stringify(metodo)}>
                                {" "}
                                {metodo.direction}{" "}
                              </option>
                            );
                          })}
                        </select>
                      )}
                    </div>
                    <div className="grow">
                      <Button href="#" onClick={onAddress} className="sm:h-[48px] !text-[14px] active:bg-opacity-80">
                        Añadir nueva dirección
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="mb-3 sm:mb-6"></div>
              </div>
            )}

            <div className="col-span-full">
              <div className="mb-3 sm:mb-6">
                <div className="map">{!!booking.customer.address._id ? <Maps address={booking.customer.address.street} lat={booking.customer.address.coordinates.latitude} lng={booking.customer.address.coordinates.longitude} altura={true} drag={false} /> : ""}</div>
              </div>
            </div>

            <div className="col-span-full">
              <div className="mb-3 sm:mb-6">
                <TextArea name="nota" type="text" label="Notas" />
              </div>
            </div>

            <div className="col-span-full">
              <div className="mb-3 sm:mb-6">
                <Button type="submit" className="sm:h-[48px] !text-[14px]" disabled={loading}>
                  {loading ? "Confirmando..." : "Confirmar servicio"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Appointment;
