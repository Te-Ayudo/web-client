
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setActiveModalAddress,
} from "../../store";
import Button from "../atoms/Button";
import "react-datepicker/dist/react-datepicker.css";
import { useCreateBookingScreen, useFormData } from "./../../hooks";
import { ServicesInfoTooltip } from "../atoms/ServicesInfoTooltip";
import Maps from "../map/Map";
import moment from "moment";
import DateSelect from "./DateSelect";
import TimeSelectDrawer from "./TimeSelectDrawer";
import SelectDrawer from "./SelectDrawer";
import { useTour } from "../../hooks/useTour";
import TourFloatingButton from "../TourFloatingButton";

export const Appointment = () => {
  const booking = useSelector((state) => state.booking.selected);
  const dispatch = useDispatch();
  const [isBranch, setIsBranch] = useState(false);
  
  // Hook del tour
  const { startAppointmentTour, checkAndStartTour } = useTour();
  
  // Hook para manejar datos temporales del formulario
  const {
    formData,
    updateFormData,
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    showDiscount,
    setShowDiscount,
    selectedEmployee,
    selectEmployee,
    selectedAddress,
    selectAddress,
  } = useFormData();

  const isCheckingCouponBtn = useMemo(() => {
    // Habilitar si hay código de cupón en el formulario O si ya hay un cupón aplicado
    return (!!formData.descuento && formData.descuento.trim().length > 0) || !!booking.coupon;
  }, [formData.descuento, booking.coupon]);

  // Calcular precio final con descuento
  const finalPrice = useMemo(() => {
    const originalPrice = booking?.paymentInfo?.totalPrice || 0;
    let discount = 0;
    
    if (booking.coupon) {
      if (booking.coupon.discountType === 'Porcentaje') {
        discount = (originalPrice * booking.coupon.discount / 100);
      } else {
        // Descuento fijo
        discount = booking.coupon.discount;
      }
    }
    
    return Math.max(0, originalPrice - discount);
  }, [booking?.paymentInfo?.totalPrice, booking.coupon]);

  const {
    maxAvailableAfterHours,
    availability,
    hourPicker,
    paymentMethods,
    addresses,
    employee,
    onSubmit,
    loading,
    loadingEmployees,
    loadingHours,
    onVerifyCoupon,
    onRemoveCoupon,
    unavailability,
    fullDateBusy,
    dateBusy,
  } = useCreateBookingScreen(selectedEmployee, selectedDate, selectedTime, formData, selectedAddress, updateFormData);

  const [formErrors, setFormErrors] = useState({});
  const [showServicesInfo, setShowServicesInfo] = useState(false);

  // Estado para guardar la fecha/hora seleccionada (solo en estado local)
  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    if (time) {
    }
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
          if (start.hours() <= 8) blockedDates.push(startDay.clone());
        } else if (startDay.isSame(end, "day")) {
          if (end.hours() >= 23) blockedDates.push(startDay.clone());
        } else {
          blockedDates.push(startDay.clone());
        }
        startDay.add(1, "day");
      }
    });
    return blockedDates;
  };

  // Usar datos del Redux en lugar de localStorage
  useEffect(() => {
    if (booking?.isInBranch) setIsBranch(true);
    else setIsBranch(false);
  }, [booking?.isInBranch]);

  const employeeAvailableByBranch = (employees) => {
    return employees.filter((employee) =>
      booking.isInBranch && booking.branch?._id === employee.branch
        ? employee
        : false
    );
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    let first_name = "";
    if (user.first_name) {
      first_name = user.first_name + " " + user.last_name;
    } else if (user.displayName) {
      first_name = user.displayName;
    }
    const phone = user.phone;
    
    // Solo actualizar si no hay datos previos
    if (!formData.name) {
      updateFormData('name', first_name);
      updateFormData('telefono', phone);
    }
  }, []);

  useEffect(() => {
    const now = new Date();
    if (hourPicker.length > 0 && !selectedDate) {
      const startDate = hourPicker.find((hour) => {
        return new Date(hour).getTime() >= now.getTime();
      });
      if (startDate) {
        setSelectedDate(new Date(startDate));
      }
    }
  }, [hourPicker]);

  // Los datos del formulario no se persisten en Redux, solo se mantienen en estado local

  // Validación de campos obligatorios
  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "El nombre es obligatorio";
    if (!formData.metodopago) errors.metodopago = "Selecciona un método de pago";
    if (!selectedDate) errors.date = "Selecciona una fecha";
    if (!selectedTime) errors.time = "Selecciona una hora";
    
    // Validar dirección solo si es servicio a domicilio
    if (!booking.isInBranch && !selectedAddress) {
      errors.address = "Selecciona una dirección";
    }
    
    return errors;
  };

  // Habilitar botón solo si no hay errores
  const isFormValid = () => {
    const errors = validateForm();
    return Object.keys(errors).length === 0;
  };

  const onInputChanged = ({ target }) => {
    updateFormData(target.name, target.value);
    
    if (target.name === "empleado") {
      const a = !!target.value ? JSON.parse(target.value) : "{}";
      selectEmployee(a);
      setSelectedTime(null);
    }
    if (target.name === "direccion") {
      const a = !!target.value ? JSON.parse(target.value) : null;
      selectAddress(a);
    }
  };

  const onDateChange = (event) => {
    setSelectedDate(event);
    // Limpiar hora seleccionada cuando cambie la fecha
    setSelectedTime(null);
  };

  const onAddress = (e) => {
    e.preventDefault();
    dispatch(setActiveModalAddress());
  };

  // Función para abrir el calendario desde el mensaje de "escoger otra"
  const openCalendar = () => {
    // Simular click en el DateSelect para abrirlo
    const dateSelectElement = document.querySelector('[data-date-select]');
    if (dateSelectElement) {
      dateSelectElement.click();
    }
  };

  const [blockedDates, setBlockedDate] = useState([]);
  useEffect(() => {
    setBlockedDate(getBlockedDates(unavailability || []));
  }, [unavailability]);

  // Mostrar errores en tiempo real
  useEffect(() => {
    setFormErrors(validateForm());
  }, [formData.name, formData.metodopago, selectedDate, selectedTime, selectedAddress, booking.isInBranch]);

  // Detectar si necesitamos iniciar el tour del formulario (usando el patrón estándar)
  useEffect(() => {
    // Solo iniciar el tour cuando los datos estén listos (siguiendo el patrón de otros componentes)
    if (!loading && booking.serviceCart && booking.serviceCart.length > 0 && paymentMethods.length > 0) {
      setTimeout(() => {
        checkAndStartTour('formulario');
      }, 100);
    }
  }, [loading, booking.serviceCart, paymentMethods.length, checkAndStartTour]);

  // Estados de focus para floating label
  const [, setFocusName] = useState(false);
  const [, setFocusDescuento] = useState(false);
  const [, setFocusNota] = useState(false);

  const employeeOptions = (isBranch ? employeeAvailableByBranch(employee) : employee).map((emp) => ({
    value: JSON.stringify(emp),
    label: emp.fullName,
    picture: emp.picture
  }));

  const paymentMethodOptions = paymentMethods.map((method) => ({
    value: method.value,
    label: method.label
  }));

  const addressOptions = addresses.map((address) => ({
    value: JSON.stringify(address),
    label: address.direction
  }));

  return (
    <>
      {/* Botón flotante para el tour */}
      <TourFloatingButton 
        onClick={() => {
          startAppointmentTour();
        }}
      />
      
      <div className="w-full">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-10 mx-auto">
          <div className="mb-3 sm:mb-6 flex items-center justify-between">
            <h2 className="text-primary font-[600] text-xl sm:text-2xl">Programar el Servicio</h2>
            
            {/* Botón de información de servicios */}
            {booking.serviceCart && booking.serviceCart.length > 0 && (
              <div className="relative">
                <button
                  type="button"
                  onMouseEnter={() => setShowServicesInfo(true)}
                  onMouseLeave={() => setShowServicesInfo(false)}
                  className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-600 hover:text-primary transition-colors rounded-lg hover:bg-gray-50"
                >
                  <span className="">Servicios</span>
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
                
                {/* Tooltip de información */}
                {showServicesInfo && (
                  <ServicesInfoTooltip 
                    services={booking.serviceCart}
                    totalPrice={booking.paymentInfo?.totalPrice || 0}
                  />
                )}
              </div>
            )}
          </div>
          <form className="text-center" method="POST" onSubmit={onSubmit}>
            {/* Nombre y Apellido */}
            <div className="col-span-full mb-4 text-left" data-tour="appointment-name">
              <div className="relative">
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={onInputChanged}
                  onFocus={() => setFocusName(true)}
                  onBlur={() => setFocusName(false)}
                  placeholder="Nombre y Apellido *"
                  className="peer w-full rounded-2xl border border-primary px-4 py-3 text-secondary placeholder-gray-400 focus:outline-none focus:border-2 focus:border-primary"
                />
                {/* Label flotante que solo aparece cuando hay valor */}
                {formData.name && (
                  <label className="absolute left-4 bg-white px-1 text-xs text-primary -top-2 pointer-events-none">
                    Nombre y Apellido *
                  </label>
                )}
              </div>
              {formErrors.name && <span className="text-red-500 text-xs mt-1 block">{formErrors.name}</span>}
            </div>

            {/* Empleado (opcional) */}
            <div className="col-span-full mb-4 text-left" data-tour="appointment-employee">
              <SelectDrawer
                value={formData.empleado}
                onChange={(value) => {
                  updateFormData('empleado', value);
                  if (value) {
                    const emp = JSON.parse(value);
                    selectEmployee(emp);
                    // Limpiar fecha y hora cuando cambia el empleado
                    setSelectedDate(null);
                    setSelectedTime(null);
                  }
                }}
                options={employeeOptions}
                placeholder="Empleado (opcional)"
                title="Empleado (opcional)"
                showImages={true}
                loading={loadingEmployees}
                noOptionsMessage="No hay empleados disponibles para los servicios seleccionados"
              />
            </div>

            {/* Fecha */}
            <div className="col-span-full mb-4 text-left" data-tour="appointment-date">
              <DateSelect
                selectedDate={selectedDate}
                onDateChange={onDateChange}
                blockedDates={blockedDates}
                availability={availability}
                dateBusy={dateBusy}
                fullDateBusy={fullDateBusy || []}
                maxAvailableAfterHours={maxAvailableAfterHours}
              />
              {formErrors.date && <span className="text-red-500 text-xs ml-2 mt-1 block">{formErrors.date}</span>}
            </div>

            {/* Hora */}
            <div className="col-span-full mb-4 text-left" data-tour="appointment-time">
              <TimeSelectDrawer
                selectedDate={selectedDate}
                onTimeSelect={handleTimeSelect}
                maxAvailableAfterHours={maxAvailableAfterHours}
                hourPicker={hourPicker}
                disabled={!selectedDate}
                loading={loadingHours}
                noHoursMessage="No hay horas disponibles para esta fecha"
                onSelectAnotherDate={openCalendar}
              />
              {formErrors.time && <span className="text-red-500 text-xs ml-2 mt-1 block">{formErrors.time}</span>}
            </div>

            {/* Método de pago */}
            <div className="col-span-full mb-4 text-left" data-tour="appointment-payment">
              <SelectDrawer
                value={formData.metodopago}
                onChange={(value) => {
                  updateFormData('metodopago', value);
                }}
                options={paymentMethodOptions}
                placeholder="Método de pago *"
                title="Método de Pago *"
              />
              {formErrors.metodopago && <span className="text-red-500 text-xs ml-2 mt-1 block">{formErrors.metodopago}</span>}
            </div>

            {/* Dirección (si aplica) */}
            {!booking.isInBranch && (
              <div className="col-span-full mb-4 text-left" data-tour="appointment-address">
                <div className="flex flex-col sm:flex-row gap-2 items-center">
                  <div className="relative flex-1 w-full">
                    <SelectDrawer
                      value={formData.direccion}
                      onChange={(value) => {
                        updateFormData('direccion', value);
                        if (value) {
                          const address = JSON.parse(value);
                          selectAddress(address);
                        }
                      }}
                      options={addressOptions}
                      placeholder="Dirección"
                      title="Seleccionar Dirección"
                    />
                  </div>
                  <Button href="#" onClick={onAddress} className="sm:h-[48px] !text-[14px] w-full sm:w-auto whitespace-nowrap">
                    Añadir nueva dirección
                  </Button>
                </div>
                {formErrors.address && <span className="text-red-500 text-xs mt-1 block">{formErrors.address}</span>}
              </div>
            )}

            {/* Código de descuento (opcional y colapsable) */}
            <div className="col-span-full mb-4 text-left">
              {!showDiscount ? (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setShowDiscount(true);
                    }}
                    className="text-primary underline underline-offset-2 hover:text-orange-500 transition-colors text-sm font-medium"
                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                  >
                    ¿Tienes un cupón?
                  </button>
                </div>
              ) : (
                <div className="">
                                      <div className="flex flex-col sm:flex-row gap-2 items-center">
                      <div className="relative flex-1 w-full">
                        <input
                          name="descuento"
                          type="text"
                          value={formData.descuento}
                          onChange={onInputChanged}
                          onFocus={() => setFocusDescuento(true)}
                          onBlur={() => setFocusDescuento(false)}
                          placeholder="Código de descuento"
                          className="peer w-full rounded-2xl border border-primary px-4 py-3 text-secondary placeholder-gray-400 focus:outline-none focus:border-2 focus:border-primary"
                          autoComplete="off"
                          disabled={!!booking.coupon}
                        />
                        {/* Label flotante que solo aparece cuando hay valor */}
                        {formData.descuento && (
                          <label className="absolute left-4 bg-white px-1 text-xs text-primary -top-2 pointer-events-none">
                            Código de descuento
                          </label>
                        )}
                      </div>
                      <Button 
                        disabled={!isCheckingCouponBtn} 
                        onClick={booking.coupon ? onRemoveCoupon : onVerifyCoupon} 
                        className="sm:h-[48px] !text-[14px] w-full sm:w-auto whitespace-nowrap"
                      >
                        {booking.coupon ? 'Quitar cupón' : 'Aplicar cupón'}
                      </Button>
                    </div>
                    
                    {/* Mostrar información del cupón aplicado */}
                    {booking.coupon && (
                      <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm font-medium text-green-800">
                              Cupón aplicado: {booking.coupon.code}
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-green-600">
                              -Bs{(booking.coupon.discountType === 'Porcentaje' 
                                ? (booking?.paymentInfo?.totalPrice * booking.coupon.discount / 100)
                                : booking.coupon.discount).toFixed(2)}
                            </div>
                            <div className="text-xs text-gray-600">
                              Precio final: Bs{finalPrice.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                </div>
              )}
            </div>

            {/* Notas (opcional) */}
            <div className="col-span-full mb-4 text-left">
              <div className="relative">
                <textarea
                  name="nota"
                  value={formData.nota}
                  onChange={onInputChanged}
                  onFocus={() => setFocusNota(true)}
                  onBlur={() => setFocusNota(false)}
                  placeholder="Notas (opcional)"
                  className="peer w-full rounded-2xl border border-primary px-4 py-3 text-secondary resize-none placeholder-gray-400 focus:outline-none focus:border-2 focus:border-primary"
                  rows={3}
                />
                {/* Label flotante que solo aparece cuando hay valor */}
                {formData.nota && (
                  <label className="absolute left-4 bg-white px-1 text-xs text-primary -top-2 pointer-events-none">
                    Notas (opcional)
                  </label>
                )}
              </div>
            </div>

            {/* Mapa (solo si hay dirección Y NO estamos en sucursal) */}
            <div className="col-span-full mb-4">
              {!booking.isInBranch && selectedAddress && (
                <div className="map">
                  <Maps
                    address={selectedAddress.street || selectedAddress.direction}
                    lat={selectedAddress.coordinates?.latitude}
                    lng={selectedAddress.coordinates?.longitude}
                    altura={true}
                    drag={false}
                  />
                </div>
              )}
            </div>

            {/* Botón de confirmar */}
            <div className="col-span-full" data-tour="appointment-submit">
              <div className="mb-3 sm:mb-6">
                <Button type="submit" className="sm:h-[48px] !text-[14px]" disabled={!isFormValid() || loading}>
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
