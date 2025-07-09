import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useNavigation, useParams } from 'react-router-dom'
import _fetch from './../wrappers/_fetch'
import { startCreateBooking, startVerifyCoupon } from '../store/booking/thunks'
import Swal from "sweetalert2";
import { BOOKING_SET, BOOKING_SET_ADDRESS, BOOKING_SET_CUSTOMER } from '../store'
import { employeeApi } from '../store/booking/helpers/employeeApi'
import moment from 'moment';

export const useCreateBookingScreen = () => {
  const {providerid} = useParams();
  const navigate = useNavigate();
 
	const provider = useSelector((state) => state.proveedor.selected)
	const booking = useSelector((state) => state.booking.selected)	
	console.log(booking)
	const {success} = useSelector((state) => state.booking)
    const dispatch = useDispatch()
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
	const [unavailability, setUnavailability] = useState([])
	const [fullDateBusy, setFullDateBusy] = useState([])
	const [dateBusy, setDateBusy] = useState([])
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
	const [maxAvailableAfterHours, setMaxAvailableAfterHours] = useState(1)
	console.log('Max', maxAvailableAfterHours)
	const [loading, setLoading] = useState(false);
	const getAvailability = async () => {
		try {
			const savedBooking = localStorage.getItem('bookingStorage');
			const finalBooking = JSON.parse(savedBooking);
			const id = finalBooking.employee?._id ?? 0;
			const providerId = localStorage.getItem('providerIdStorage');	
			let url = `${process.env.REACT_APP_API_URL}/availability/${id}?idprovider=${providerId}`;
			if (finalBooking.branch?._id) {
			  url += "&branch=" + finalBooking.branch?._id;
			}
			let response = await _fetch(url, {
				method: "GET",
				headers: {
				  Accept: "application/json",
				  "Content-Type": "application/json",
				},
			  });
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
			setUnavailability(responseJSON.data?.unavailability)
			setFullDateBusy(responseJSON.data?.fullyBusyDays)
			setDateBusy(responseJSON.data?.busy)
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
		const employee = booking.serviceCart?.map(function(element){
   			return element.service._id;
		})
		if (employee && employee.length > 0) {
			// booking.employee = "{}";
			const newBooking = {...booking, employee: {}, bookingDate: null};
			localStorage.setItem('employeeStorage', JSON.stringify(employee));
			localStorage.setItem('bookingStorage', JSON.stringify(newBooking));
			localStorage.setItem('providerIdStorage', provider._id); 
		}
		const savedEmployee = localStorage.getItem('employeeStorage');
		const savedProviderId = localStorage.getItem('providerIdStorage');
		const savedBooking = localStorage.getItem('bookingStorage');
		const finalBooking = JSON.parse(savedBooking);
		const savedMetodo = finalBooking.isInBranch?'En sucursal':'A domicilio'
		const finalEmployee = savedEmployee ? JSON.parse(savedEmployee) : employee;
		const result = (await employeeApi(savedMetodo, finalEmployee, savedProviderId))

		 const employeefilter = result?.data.map(function(element){
  	 	return {
				'_id':element.id,
				'fullName':element.first_name+' '+element.last_name,
				'photoURL':element.picture,
				'CI':element.CI_NIT,
				'branch':element.branch?._id??0,
				'pushToken':element.pushToken,
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

		console.log("blok", booking);
		

		const bookingDate = new Date(booking.bookingDate);
     	const isMidnight = bookingDate.getHours() === 0 && bookingDate.getMinutes() === 0;

		 if (isMidnight) {
			Swal.fire({
				icon: "error",
				title: "Error",
				text: "No se seleccionó una hora",
			});
			return; // No continúa con el envío
		}

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
		setLoading(true);
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
						phone: booking.customer.phone,
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
					createdFrom: 'Web',
					notes: booking?.billingInfo?.notes || '',
				},
				providerid,
				navigate
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

	useEffect(() => {
		getAvailability();
	  }, [booking.employee]);

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

  const _hourPicker = async (date) => {
    let array = [];
    let today = moment();
    let isSameDay = moment(today).isSame(date, "day");
	const savedBooking = localStorage.getItem('bookingStorage');
	const finalBooking = JSON.parse(savedBooking);

	const id = finalBooking.employee?._id ?? 0;
	const providerId = localStorage.getItem('providerIdStorage');	
    let response = await _fetch(
		process.env.REACT_APP_API_URL  + "/dateAvailability/" + (id === 0 ? 0 : providerId) + "?idprovider=" + providerId,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: moment(date).startOf("day").utc().format(),
          estimatedTime: finalBooking.totalEstimatedWorkMinutes,
          isInBranch: finalBooking.isInBranch,
          branch: finalBooking.branch?._id,
          employee: finalBooking.employee?._id ?? null,
          serviceCart: finalBooking.serviceCart.map((e) => e.service?._id),
        }),
      }
    );
    const responseJSON = await response.json();
    responseJSON.data.availability.map((e) => {
	  array.push((new Date(e)).getTime());
    });
    setHourPicker(array);
  };

  const _setHour = (_hour) => {
    if (!_hour) {
      return;
    }
    setHour(_hour);
    dispatch(
		BOOKING_SET.set({
        bookingDate: _hour
          ? moment(booking.bookingDate)
              .hours(_hour)
              .minutes((_hour % 1) * 60)
              .format()
          : booking.bookingDate,
      })
    );
  };

	return {
		// showCalendarModal,
		// closeModal,
		_hourPicker,
		maxAvailableAfterHours,
		availability,
		unavailability,
		// showCouponrModal,
		// setShowCouponModal,
		dialogVisible,
		// onVerifyCoupon,
		// setShowCalendarModal,
		hour,
		fullDateBusy,
		_setHour,
		hourPicker,
		discount,
		paymentMethods,
		onValueCh,
		addresses,
		employee,
		setDialogVisible,
		onSubmit,
		loading,
		valueFact,
		setValueFact,
		onVerifyCoupon,
		dateBusy,
		getAddresses
	}



}
