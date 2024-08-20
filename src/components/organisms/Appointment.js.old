import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

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
import { addDays, format,setHours,setMinutes,
  isMonday,isThursday,isWednesday,isTuesday,isFriday,isSaturday,isSunday
 } from "date-fns";
import Maps from "../map/Map";

export const Appointment = () => {
  const booking = useSelector((state) => state.booking.selected);
  const bookingLoading = useSelector((state) => state.booking.loading);
  const state = useSelector((state) => state);
  const provider = useSelector((state) => state.proveedor.selected);
  const dispatch = useDispatch();
  const isCheckingCouponBtn = useMemo(() => !!booking.coupon, [booking.coupon]);
  const {
    // showCalendarModal,
    // closeModal,
    // _hourPicker,
    maxAvailableAfterHours,
    availability,
    // showCouponrModal,
    // setShowCouponModal,
    dialogVisible,
    // onVerifyCoupon,
    // setShowCalendarModal,
    hour,
    // _setHour,
    hourPicker,
    discount,
    paymentMethods,
    // selectedValue,
    onValueCh,
    addresses,
    employee,
    setDialogVisible,
    onSubmit,
    valueFact,
    setValueFact,
    // handleValueFact,
    onVerifyCoupon,
  } = useCreateBookingScreen();
  //Todo: cargar fechas y horas disponibles
  console.log(availability);

  const [selectedDate, setSelectedDate] = useState(setHours(setMinutes(new Date(2024, 8, 9, 8, 30), 0), 8))
  const [horas, setHoras] = useState([new Date('2020-08-08'), new Date('2020-08-09')])
  const [excludedTimes, setExcludedTimes] = useState([])

  const handleSelectedDate = (date) => {
    setSelectedDate(date)
  }

  console.log(excludedTimes);

  const getExcludedTimes = (date) => {
    let arrSpecificDates = [];
    // console.log( format(new Date(date)),"eeee");
    const day1 = date.getDay();
    const dayNames = ["Sunday", "Monday", "Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const nday = dayNames[day1];
    // console.log(availability[0]);

    let armarHorasWeed = [];
    switch (nday) {
      case "Monday":
          const novo = availability[0];
           for (let i = 0; i < novo.length; i++) {
            const horaI = novo[i].startHour;
            const horaF = novo[i].endHour;
            const horaIm = novo[i].startMinute;
            const horaFm = novo[i].endMinute;
            console.log(horaI,'__',horaF);

            var now = date;
            now.setHours(horaI);
            now.setMinutes(horaIm);
            now.setSeconds(0);

            armarHorasWeed.push({
              time:now.getHours().toString().padStart(2,'0') +':'+ now.getMinutes().toString().padStart(2,'0'),
              date:new Date(now).toLocaleDateString()
            });


            for(var j = horaI; j < 50; j++){
                armarHorasWeed.push({
                  time:now.getHours().toString().padStart(2,'0') +':'+ now.getMinutes().toString().padStart(2,'0'),
                  date:new Date(now).toLocaleDateString()
                });

                now.setMinutes(now.getMinutes() + 30);
                // console.log(now.getHours() + ":" + ("00" + now.getMinutes()).slice(-2));
                armarHorasWeed.push({
                  time:now.getHours().toString().padStart(2,'0') +':'+ now.getMinutes().toString().padStart(2,'0'),
                  date:new Date(now).toLocaleDateString()
                });

                if( now.getHours() >= horaF ){
                  break;
                }

                }
           }

        break;

      case "Tuesday":

        break;
      case "Wednesday":

        break;
      case "Thursday":

        break;
      case "Friday":

        break;
      case "Saturday":

        break;
      case "Sunday":

        break;
      default:
        break;
    }
    setExcludedTimes(armarHorasWeed)









    // for (let i = 0; i < arrDates.length; i++) {
    //   if (
    //     moment(date, moment.ISO_8601).format("YYYY/MM/DD") ===
    //     moment(arrDates[i], moment.ISO_8601).format("YYYY/MM/DD")
    //   ) {
    //     arrSpecificDates.push(moment(arrDates[i], moment.ISO_8601).toObject());
    //   }
    // }

    // let arrExcludedTimes = [];
    // if (arrSpecificDates.length > 0) {
    //   for (let i = 0; i < arrSpecificDates.length; i++) {
    //     const test = arrSpecificDates[i];
    //     arrExcludedTimes.push({
    //       time: (
    //         test.hours.toString().padStart(2, "0") +
    //         ":" +
    //         test.minutes.toString().padStart(2, "0")
    //       ).toString(),
    //       date: new Date().toDateString(),
    //     });
    //     console.log(arrExcludedTimes);

    //     setExcludedTimes(arrExcludedTimes);
    //   }
    // } else {
    //   setExcludedTimes(arrExcludedTimes);
    // }
  };

  const [formValues, setFormValues] = useState({
    name: "frank Callapa",
    telefono: "",
    start: (maxAvailableAfterHours >= 24)? addDays(new Date().setHours(0, 0, 0, 0), 1): new Date() , //new Date(),
    empleado: "",
    descuento: "",
    metodopago: "",
  });

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
      start: (maxAvailableAfterHours >= 24)? addDays(new Date(), 1): new Date() , //new Date(),
    });
  }, []);

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
      dispatch(BOOKING_SET_EMPLOYEE( a ));
    }

    if (target.name === "direccion") {
      const a = !!target.value ? JSON.parse(target.value) : "";
      onValueCh(a);
    }
  };

  const onDateChange = (event) => {
    setFormValues({
      ...formValues,
      ["start"]: event,
    });

    //TODO: guardar fecha
    const result = format(event, "yyyy-MM-dd'T'HH:mm:ssxxx");
    dispatch(
      BOOKING_SET({
        bookingDate: result,
      })
    );

    //update fecha para calendario
    setSelectedDate(result)
  };

  const navigate = useNavigate();
  const onAddress = (e) => {
    e.preventDefault();
    console.log("guardar direccion");
    dispatch(setActiveModalAddress());
  };
  return (
    <>
      <div className="col-span-full">
        <div className="mb-3 sm:mb-6 text-left">
          <h2 className="text-primary font-[600] ">Programar el Servicio</h2>
        </div>
      </div>

      <form className="text-center" method="POST" onSubmit={onSubmit}>
        <div className="col-span-full">
          <div className="mb-3 sm:mb-6">
            <Input
              name="name"
              type="text"
              label="Nombre y Apellido"
              value={formValues.name}
              onChange={onInputChanged}
            />
          </div>
        </div>
        <div className="col-span-full">
          <div className="mb-3 sm:mb-6">
            <Input
              name="telefono"
              type="text"
              label="Telefono"
              value={formValues.telefono}
              onChange={onInputChanged}
            />
          </div>
        </div>
        <div className="col-span-full">
          <div className="mb-3 sm:mb-6">
            {/* <Input
              name="empleado"
              type="text"
              label="Empleado (opcional)"
              value={formValues.empleado}
              onChange={onInputChanged}
            /> */}
            <select
              name="empleado"
              className="rounded-2xl border-solid border border-primary w-full px-4 sm:px-6 py-2 sm:py-3 text-secondary"
              value={formValues.direccion}
              onChange={onInputChanged}
            >
              <option value=""> Empleado (Opcional) ... </option>
              {employee.map((metodo) => {
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
            <div className=" flex justify-end flex-row-reverse sm:w-2/3 rounded-2xl border-solid border-2 border-primary mb-3 sm:mb-0 ">
              <DatePicker
                minDate={formValues.start}
                selected={formValues.start}
                onChange={(event) => onDateChange(event)}
                onSelect={getExcludedTimes}
                dateFormat="Pp"
                showTimeSelect
                className=" rounded-2xl  border  w-full px-4 sm:px-6 py-2 sm:py-3 text-secondary "
                withPortal
              />
              <DatePicker
                selected={formValues.start}
                onChange={(event) => onDateChange(event)}
                onSelect={getExcludedTimes}
                includeTimes={
                    excludedTimes.map((exclude, index) => { return new Date(new Date().setHours(parseInt(exclude.time.slice(0, -3)), exclude.time.slice(3), 0)); })
                }

                popperPlacement="top-start"
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={30}
                timeFormat="HH:mm"
                dateFormat="hh:mm aa"
                minDate={formValues.start}
                // minTime={setHours(setMinutes(new Date(), 0), 8)}
                // maxTime={setHours(setMinutes(new Date(), 45), 14)}
              />
            </div>
          </div>
        </div>
        <div className="col-span-full">
          <div className="mb-3 sm:mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input
                  name="descuento"
                  type="text"
                  label="Codigo de descuento"
                  value={formValues.descuento}
                  onChange={onInputChanged}
                />
              </div>
              <div>
                <Button
                  disabled={!isCheckingCouponBtn}
                  onClick={onVerifyCoupon}
                  className="sm:h-[48px] !text-[14px]"
                >
                  Aplicar Cupon
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-full">
          <div className="mb-3 sm:mb-6">
            {/* <Input
          name="metodo"
          type="text"
          label="Metodo de pago"
        /> */}
            <select
              name="metodopago"
              className="rounded-2xl border-solid border border-primary w-full px-4 sm:px-6 py-2 sm:py-3 text-secondary"
              value={formValues.metodopago}
              onChange={onInputChanged}
            >
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
              <h2 className="text-primary font-[600] ">
                Direccion (seleccionar direccion)
              </h2>
            </div>
            <div className="mb-3 sm:mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  {Object.keys(addresses).length === 0 ? (
                    "No tienes direccion"
                  ) : (
                    <select
                      name="direccion"
                      className="rounded-2xl border-solid border border-primary w-full px-4 sm:px-6 py-2 sm:py-3 text-secondary"
                      value={formValues.direccion}
                      onChange={onInputChanged}
                    >
                      <option value=""> Seleccionar ... </option>
                      {addresses.map((metodo) => {
                        return (
                          <option
                            key={metodo.key}
                            value={JSON.stringify(metodo)}
                          >
                            {" "}
                            {metodo.direction}{" "}
                          </option>
                        );
                      })}
                    </select>
                  )}
                </div>
                <div>
                  <Button
                    href="#"
                    onClick={onAddress}
                    className="sm:h-[48px] !text-[14px]"
                  >
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
            <div className="map">
              {
                !!booking.customer.address._id ? (
                  <Maps
                    address={booking.customer.address.street}
                    lat={booking.customer.address.coordinates.latitude}
                    lng={booking.customer.address.coordinates.longitude}
                    drag={false}
                  />
                ) : (
                  ""
                )
                // (!!ubication.coordinates)?
                // <Maps address={ubication.direction}
                //     lat={ ubication.coordinates.latitude }
                //     lng={ ubication.coordinates.longitude }
                // />
                // : ''
              }
            </div>
          </div>
        </div>

        <div className="col-span-full">
          <div className="mb-3 sm:mb-6">
            <TextArea name="nota" type="text" label="Notas" />
          </div>
        </div>

        <div className="col-span-full">
          <div className="mb-3 sm:mb-6">
            <Button type="submit" className="sm:h-[48px] !text-[14px]">
              Confirmar Servicio
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};

export default Appointment;
