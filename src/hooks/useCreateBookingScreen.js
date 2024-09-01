import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useNavigation, useParams } from 'react-router-dom'
import _fetch from './../wrappers/_fetch'
import { startCreateBooking, startVerifyCoupon } from '../store/booking/thunks'
import Swal from "sweetalert2";
import { BOOKING_SET_ADDRESS, BOOKING_SET_CUSTOMER } from '../store'
import { employeeApi } from '../store/booking/helpers/employeeApi'

export const useCreateBookingScreen = () => {
  const {providerid} = useParams();

	const provider = useSelector((state) => state.proveedor.selected)
	const booking = useSelector((state) => state.booking.selected)
	const {success} = useSelector((state) => state.booking)
  const dispatch = useDispatch()
	//const navigation = useNavigation()
	const [valueFact, setValueFact] = useState({ razonSocial: '', nit: '' })
	const [availability, setAvailability] = useState({
		0: [],
		1: [],
		2: [],
		3: [],
		4: [],
		5: [],
		6: [],
	})
	const [addresses, setAddresses] = useState([])
	const [hourPicker, setHourPicker] = useState([])
	const [user, setUser] = useState(null)
  const [dialogVisible, setDialogVisible] = useState(false)
	const [discount, setDiscount] = useState(0)
	const [paymentMethods, setPaymentMethods] = useState([
		{ label: 'Efectivo', value: 'Efectivo' },
	])
	const [employee, setEmployee] = useState([])
	const [hour, setHour] = useState(null)
	const [maxAvailableAfterHours, setMaxAvailableAfterHours] = useState(24)

  const getAvailability = async () => {
		try {
			let response = await _fetch(
				"https://test.teayudo.com.bo"+ '/api/availability/' + provider._id,
				{
					method: 'GET',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
					},
				}
			)
			let responseJSON = await response.json()
			let availability = {
				0: [],
				1: [],
				2: [],
				3: [],
				4: [],
				5: [],
				6: [],
			}
			responseJSON.data?.availability?.map((e) => {
				availability[e.dayIndex].push(e)
			})
			setAvailability(availability)
		} catch (error) {
			console.error(error)
		}
	}

  const getAddresses = async () => {
		let user = JSON.parse(await localStorage.getItem('user'))
		setUser(user)
		if(user.directions){
			const rawAddresses = user.directions.filter((e) => e.state)
			const addressesPicker = rawAddresses.reduce(
				(array, element) => [
					...array,
					{
						...element,
						label: element.direction,
						// value: JSON.stringify(element),
						value: element,
						key: element._id,
					},
				],
				[]
			)
			setAddresses(addressesPicker)
		}
	}

	const getListEmployee = async () => {
		const metodo = booking.isInBranch?'En sucursal':'A domicilio'
		const employee = booking.serviceCart?.map(function(element){
   	return element.service._id;
		})
		const result = (await employeeApi(metodo, employee,provider._id))


		 const employeefilter = result?.data.map(function(element){
  	 	return {
				'_id':element.id,
				'fullName':element.first_name+' '+element.last_name,
				'photoURL':element.picture,
				'CI':element.CI_NIT,
				'branch':element.branch?._id??0,
			};
		 })
		 setEmployee(employeefilter);

	}

	const onVerifyCoupon = (event) => {
		event.preventDefault();
		const servicesIds = booking.serviceCart?.map((e) => e.service?._id)
		 dispatch(
			startVerifyCoupon({
				code: booking.coupon,
				services: servicesIds,
			})
		 )
		getDiscount(booking?.couponData.coupon)
	}

	const getDiscount = (coupon) => {
		if (!coupon) {
			return 0
		}

		let discount = 0

		booking?.serviceCart?.forEach((service) => {
			if (coupon?.validServices?.includes(service.service._id)) {
				if (coupon.discountType === 'Porcentaje') {
					discount += (coupon.discount / 100) * service.price
					setDiscount(discount)
				} else if (coupon.discountType === 'Monto') {
					let discountAux = 0
					discountAux += coupon.discount
					setDiscount(discountAux)
				}
			}
		})

		return discount
	}

	useEffect(() => {
		getDiscount(booking?.couponData?.coupon)
	}, [booking.couponData])

	const onSubmit = (event) => {

		event.preventDefault();

		if (
			!booking.bookingDate ||
			!booking.paymentInfo.paymentMethod ||
			// (!booking.isInBranch && !booking.customer.address._id) ||
			booking.serviceCart.length === 0
		) {
			// setDialogVisible(true)
      Swal.fire({
				icon:"error",
				title:"Error",
				text:"Por favor rellena los espacios obligatorios"
			})
			return
		}
		dispatch(
      startCreateBooking(
				{
					...booking,
					paymentInfo: {
						...booking?.paymentInfo,
						totalPrice: booking?.paymentInfo?.totalPrice - discount,
						couponCode: booking?.coupon?.coupon?.code,
					},
					customer: {
						...booking.customer,
						_id: user._id,
						fullName: (user.first_name + ' ' + user.last_name).trim(),
						phone: user.phone,
						pushToken: user.pushToken,
						email: user.email,
					},
					provider: {
						_id: provider._id,
						name: provider.first_name,
						email: provider.email,
						logoURL: provider.picture,
						phone: provider.phone,
					},
					notes: booking?.billingInfo?.notes || '',
				},
				onConfirmation
			)
		)
	}

	useEffect(() => {
		const qrEnabledArray = booking.serviceCart?.map((e) => e.service?.qrEnabled)
		const _paymentMethods = [{ label: 'Efectivo', value: 'Efectivo' }]
		if (!qrEnabledArray.includes(false)) {
			_paymentMethods.push({ label: 'QR', value: 'QR' })
		}

		const cardPaymentEnabledArray = booking.serviceCart?.map(
			(e) => e.service?.cardPaymentEnabled
		)
		if (!cardPaymentEnabledArray.includes(false)) {
			_paymentMethods.push(
				{
					label: 'Tarjeta de crédito/débito',
					value: 'Tarjeta',
				},
				{
					label: 'Tigo Money',
					value: 'Tigo Money',
				}
			)
		}
		setPaymentMethods(_paymentMethods)
		setMaxAvailableAfterHours(
			booking.serviceCart.reduce(
				(a, b) =>
					Math.max(
						a?.service?.availableAfterHours ?? 0,
						b?.service?.availableAfterHours ?? 24
					),
				-Infinity
			)
		)
	}, [booking.serviceCart])

	useEffect(() => {
		if (
			!booking.bookingDate ||
			!hour ||
			!booking.paymentInfo.paymentMethod ||
			(!booking.isInBranch && !booking.customer.address._id)
		) {
			setDialogVisible(true)
			return
		} else {
			setDialogVisible(false)
		}
		setDialogVisible(false)
	}, [
		booking.bookingDate,
		hour,
		booking.paymentInfo.paymentMethod,
		booking.customer.address._id,
	])

	useEffect(() => {
		getAvailability()
		getAddresses()
		getListEmployee()
	}, [])
	useEffect(() => {
		getAvailability()
		getAddresses();
	}, [success])

	const onValueCh = (value) => {
		if (!value) {
			return {}
		}
		dispatch(
			BOOKING_SET_CUSTOMER({
				customer: {
					...booking.customer,
					address: value,
				},
			})

		)
	}

  const navigate = useNavigate();
	const onConfirmation = () => {
    navigate(`/${providerid}/gracias`)
  }


	return {
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
		onVerifyCoupon
	}



}
