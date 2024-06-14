import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';

import { BOOKING_CUSTOMER_FULLNAME, BOOKING_CUSTOMER_PHONE, BOOKING_PAGO, BOOKING_SET, BOOKING_SET_COUPON } from '../../store';
import Input from '../atoms/Input'
import Button from '../atoms/Button'
import TextArea from '../atoms/TextArea'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { useCreateBookingScreen } from "./../../hooks";
import { addDays, format } from 'date-fns';
import Maps from '../map/Map';

export const Appointment = () => {

	const booking = useSelector((state) => state.booking.selected)
	const bookingLoading = useSelector((state) => state.booking.loading)
	const state = useSelector((state) => state)
	const provider = useSelector((state) => state.proveedor.selected)
	const dispatch = useDispatch()
  const isCheckingCouponBtn =  useMemo( () => !!booking.coupon ,[booking.coupon] );
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
		setDialogVisible,
		onSubmit,
		valueFact,
		setValueFact,
		// handleValueFact,
    onVerifyCoupon
  } = useCreateBookingScreen();

  const [formValues, setFormValues] = useState({
    name: 'frank Callapa',
    telefono: '',
    start: addDays(new Date(),1), //new Date(),
    empleado: '',
    descuento: '',
    metodopago: ''
  })

  useEffect(() => {

    const user = JSON.parse(localStorage.getItem("user"));
    let first_name = '';
    if(user.first_name){
      first_name=user.first_name+' '+user.last_name;
    }else{
      if(user.displayName){
        first_name=user.displayName;
      }
    }
    const phone = user.phone;
    setFormValues({
      name:first_name,
      telefono:phone,
      empleado: '',
      descuento: '',
      metodopago: '',
      start: addDays(new Date(),1), //new Date(),
    })

  }, [])


  const onInputChanged = ({target}) => {
    setFormValues({
      ...formValues,
      [target.name]: target.value
    })
     if(target.name === "descuento"){
      const descuento= target.value;
      dispatch( BOOKING_SET_COUPON(descuento) );
    }
    if(target.name === "metodopago"){
      const paymentMethod= target.value;
      dispatch( BOOKING_PAGO({paymentMethod}) );
    }
    if(target.name === "name"){
      const fullName= target.value;
      dispatch( BOOKING_CUSTOMER_FULLNAME({fullName}) );
    }
   if(target.name === "telefono"){
      const phone= target.value;
      dispatch( BOOKING_CUSTOMER_PHONE({phone}) );
    }

   if(target.name === "direccion"){
    const a =!!target.value?JSON.parse(target.value):'';
    onValueCh(a);
   }

  }

  const onDateChange = (event) => {
    setFormValues({
      ...formValues,
      ['start']: event
    })

    //TODO: guardar fecha
     const result = format(event, "yyyy-MM-dd'T'HH:mm:ssxxx")
     dispatch( BOOKING_SET({
      bookingDate:result
     }) )

  }

  const navigate = useNavigate();

  return (
    <>
  <div className="col-span-full">
    <div className="mb-3 sm:mb-6 text-left">
      <h2 className='text-primary font-[600] ' >
      Programar el Servicio
      </h2>
    </div>
  </div>

  <form className="text-center" method="POST" onSubmit={ onSubmit }  >
    <div className="col-span-full">
      <div className="mb-3 sm:mb-6">
        <Input
          name="name"
          type="text"
          label="Nombre y Apellido"
          value={ formValues.name }
          onChange={ onInputChanged }
        />
      </div>
    </div>
    <div className="col-span-full">
      <div className="mb-3 sm:mb-6">
        <Input
          name="telefono"
          type="text"
          label="Telefono"
          value={ formValues.telefono }
          onChange={ onInputChanged }
        />
      </div>
    </div>
    <div className="col-span-full">
      <div className="mb-3 sm:mb-6">
        <div className=' flex justify-end flex-row-reverse sm:w-2/3 rounded-2xl border-solid border-2 border-primary mb-3 sm:mb-0 ' >
        <DatePicker
          minDate={ formValues.start }
          selected={ formValues.start }
          onChange={ (event) => onDateChange(event) }
          dateFormat="Pp"
          showTimeSelect
          className=" rounded-2xl  border  w-full px-4 sm:px-6 py-2 sm:py-3 text-secondary "
        />

        </div>
     </div>
    </div>
   <div className="col-span-full">
      <div className="mb-3 sm:mb-6">
        <Input
          name="empleado"
          type="text"
          label="Empleado (opcional)"
          value={ formValues.empleado }
          onChange={ onInputChanged }
        />
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
                  value={ formValues.descuento }
                  onChange={ onInputChanged }
                />
          </div>
          <div>
                <Button
                  disabled={ !isCheckingCouponBtn }
                  onClick={ onVerifyCoupon }
                  className="sm:h-[48px] !text-[14px]">
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
          name='metodopago'
          className='rounded-2xl border-solid border border-primary w-full px-4 sm:px-6 py-2 sm:py-3 text-secondary'
          value={ formValues.metodopago }
          onChange={ onInputChanged }
        >
          <option value=""> Metodo de Pago ... </option>
          {
            paymentMethods.map( metodo => {
              return <option key={metodo.value} value={ metodo.value } > { metodo.label }  </option>
            } )
          }
        </select>
      </div>
    </div>

{
  !booking.isInBranch && (
    <div className="col-span-full">
      <div className="mb-3 sm:mb-6 text-left">
        <h2 className='text-primary font-[600] ' >
        Direccion (seleccionar direccion)
        </h2>

      </div>
      <div className="mb-3 sm:mb-6">
        {
          Object.keys(addresses).length === 0?(
            "No tienes direccion"
          ): (
          <select
            name='direccion'
            className='rounded-2xl border-solid border border-primary w-full px-4 sm:px-6 py-2 sm:py-3 text-secondary'
            value={ formValues.direccion }
            onChange={ onInputChanged }
          >
            <option value=""> Seleccionar ... </option>
            {
              addresses.map( metodo => {
                return <option key={metodo.key} value={ JSON.stringify(metodo) } > { metodo.direction }  </option>
              } )
            }
          </select>

          )

        }
      </div>
    </div>


  )
}





    <div className="col-span-full">
      <div className="mb-3 sm:mb-6">

        <div className="map">
          {
            (!!booking.customer.address._id)
            ? <Maps
                address={booking.customer.address.street}
                lat={ booking.customer.address.coordinates.latitude }
                lng={ booking.customer.address.coordinates.longitude }
                drag={false}
              />

            : ''
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
        <TextArea
          name="nota"
          type="text"
          label="Notas"
        />
      </div>
    </div>

    <div className="col-span-full">
      <div className="mb-3 sm:mb-6">
        <Button
          type="submit"
          className="sm:h-[48px] !text-[14px]">
          Confirmar Servicio
        </Button>
      </div>
    </div>
  </form>

    </>
  )
}

export default Appointment
