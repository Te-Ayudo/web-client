import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import _fetch from './../wrappers/_fetch'
import { startCreateBooking, startVerifyCoupon } from '../store/booking/thunks'
import { BOOKING_SET_COUPON, BOOKING_SET_COUPON_DATA, BOOKING_CLEAR_SUCCESS } from '../store/booking/bookingSlice'
import Swal from "sweetalert2";
import { employeeApi } from '../store/booking/helpers/employeeApi'
import moment from 'moment';

export const useCreateBookingScreen = (selectedEmployee, selectedDate, selectedTime, formData, selectedAddress, updateFormData) => {
  const {providerid} = useParams();
  const navigate = useNavigate();
 
	const provider = useSelector((state) => state.proveedor.selected)
	const booking = useSelector((state) => state.booking.selected)	
	const {success, error} = useSelector((state) => state.booking)
  const dispatch = useDispatch()
	
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
	const [loading, setLoading] = useState(false);
	const [loadingEmployees, setLoadingEmployees] = useState(false);
	const [loadingHours, setLoadingHours] = useState(false);
	
	const getAvailability = async () => {
		try {
			// Usar el empleado seleccionado si existe, sino 0
			const id = selectedEmployee?._id ?? 0;
			const providerId = provider?._id || localStorage.getItem('providerIdStorage');	
			let url = `${process.env.REACT_APP_API_URL}/availability/${id}?idprovider=${providerId}`;
			if (booking.branch?._id) {
			  url += "&branch=" + booking.branch?._id;
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
		
		// Inicializar el nombre del usuario si no está establecido
		if (user && !formData.name) {
			const fullName = (user.first_name + ' ' + user.last_name).trim();
			if (fullName) {
				updateFormData('name', fullName);
			}
		}
		
		if(user.directions){
			const rawAddresses = user.directions.filter((e) => e.state)
			const addressesPicker = rawAddresses.reduce(
				(array, element) => [
					...array,
					{
						...element,
						label: element.direction,
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
		setLoadingEmployees(true);
		try {
			const employee = booking.serviceCart?.map(function(element){ return element.service._id; });
			if (employee && employee.length > 0) {
				localStorage.setItem('providerIdStorage', provider._id);
			}
			const savedMetodo = booking.isInBranch?'En sucursal':'A domicilio';
			const result = (await employeeApi(savedMetodo, employee, provider._id));
			
			// Transformar el formato de respuesta para que sea compatible
			const employeefilter = result?.data?.map(function(element){
				return {
					'_id': element._id,
					'fullName': element.first_name + ' ' + element.last_name,
					'picture': element.picture,
					'CI': element.CI_NIT,
					'branch': element.branch?._id ?? 0,
				};
			});
			setEmployee(employeefilter || []);
		} catch (error) {
			console.error('Error cargando empleados:', error);
			setEmployee([]);
		} finally {
			setLoadingEmployees(false);
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
		// Crear objeto con el código del cupón y los servicios para la validación
		const couponData = {
			code: formData.descuento,
			services: booking.serviceCart?.map(service => service.service._id) || []
		};
		dispatch(startVerifyCoupon(couponData))
	}

	const onRemoveCoupon = () => {
		dispatch(BOOKING_SET_COUPON(null));
		dispatch(BOOKING_SET_COUPON_DATA(null));
		// Limpiar el campo del formulario
		updateFormData('descuento', '');
		// Resetear el descuento
		setDiscount(0);
	}

	const getDiscount = () => {
		if (!booking.coupon) return 0;
		
		let totalDiscount = 0;
		const couponData = booking.coupon;
		
		booking.serviceCart?.forEach((item) => {
			// Verificar si el servicio es válido para este cupón
			if (couponData.coupon.validServices.includes(item.service._id)) {
				if (couponData.discountType === 'Porcentaje') {
					const discountAmount = (item.price * couponData.discount) / 100;
					totalDiscount += discountAmount;
				} else {
					// Descuento fijo - aplicar solo una vez por carrito
					totalDiscount = couponData.discount;
					return; // Salir del forEach ya que el descuento fijo se aplica una sola vez
				}
			}
		});
		
		setDiscount(totalDiscount);
		return totalDiscount;
	}

	useEffect(() => {
		getDiscount();
	}, [booking.coupon])

	const onSubmit = (event) => {
		event.preventDefault();

		// Validar que se haya seleccionado una hora
		if (!selectedTime) {
			Swal.fire({
				icon: "error",
				title: "Error",
				text: "No se seleccionó una hora",
			});
			return;
		}

		// Validar campos obligatorios
		if (
			!selectedDate ||
			!selectedTime ||
			!formData.metodopago ||
			booking.serviceCart.length === 0
		) {
      Swal.fire({
				icon:"error",
				title:"Error",
				text:"Por favor rellena los espacios obligatorios"
			})
			return
		}

		// Calcular el descuento actual
		const currentDiscount = getDiscount();
		const originalPrice = booking?.paymentInfo?.totalPrice || 0;
		const finalPrice = originalPrice - currentDiscount;

		// Crear objeto de reserva con datos temporales del formulario
		const bookingData = {
			...booking,
			employee: selectedEmployee,
			bookingDate: selectedTime,
			paymentInfo: {
				...booking?.paymentInfo,
				paymentMethod: formData.metodopago,
				totalPrice: finalPrice,
				couponCode: booking.coupon?.code || null, // Incluir el código del cupón
			},
			totalDiscount: currentDiscount, // Agregar el descuento total
			customer: {
				_id: user._id,
				fullName: formData.name || (user.first_name + ' ' + user.last_name).trim(),
				phone: formData.telefono || user.phone,
				pushToken: user.pushToken,
				email: user.email,
				address: selectedAddress, // Usar la dirección seleccionada del estado local
			},
			provider: {
				_id: provider._id,
				name: provider.first_name,
				email: provider.email,
				logoURL: provider.picture,
				phone: provider.phone,
			},
			createdFrom: 'Web',
			notes: formData.nota || '',
		};

		setLoading(true);
		dispatch(
      		startCreateBooking(
				bookingData,
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
		getAvailability()
		getAddresses()
		getListEmployee()
	}, [])
	
	// Escuchar cambios en success para actualizar direcciones cuando se crea una nueva
	useEffect(() => {
		if (success) {
			// Limpiar el mensaje de éxito después de un tiempo
			setTimeout(() => {
				dispatch(BOOKING_CLEAR_SUCCESS());
			}, 3000);
			
			// Actualizar direcciones inmediatamente
			getAddresses();
		}
	}, [success])
	
	// Escuchar cambios en error para manejar errores de creación de dirección
	useEffect(() => {
		if (error) {
			// Si hay un error, también actualizar direcciones por si acaso
			getAddresses();
		}
	}, [error])
	
	// Listener para cambios en localStorage (cuando se crea una nueva dirección)
	useEffect(() => {
		const handleStorageChange = (e) => {
			if (e.key === 'user') {
				// Actualizar direcciones cuando cambia el usuario en localStorage
				getAddresses();
			}
		};

		window.addEventListener('storage', handleStorageChange);
		
		// También escuchar cambios locales (mismo tab)
		const originalSetItem = localStorage.setItem;
		localStorage.setItem = function(key, value) {
			if (key === 'user') {
				// Disparar evento personalizado para cambios locales
				window.dispatchEvent(new CustomEvent('localStorageChange', {
					detail: { key, value }
				}));
			}
			originalSetItem.apply(this, arguments);
		};

		window.addEventListener('localStorageChange', (e) => {
			if (e.detail.key === 'user') {
				getAddresses();
			}
		});

		return () => {
			window.removeEventListener('storage', handleStorageChange);
			window.removeEventListener('localStorageChange', handleStorageChange);
			localStorage.setItem = originalSetItem;
		};
	}, []);
	
	useEffect(() => {
		getAvailability();
	}, [selectedEmployee]);

	// Llamar a _hourPicker cuando se selecciona una fecha o cambia el empleado
	useEffect(() => {
		if (selectedDate) {
			_hourPicker(selectedDate);
		}
	}, [selectedDate, selectedEmployee?._id, booking.branch?._id, booking.serviceCart]);

	const onValueCh = (value) => {
		if (!value) {
			return {}
		}
		// Aquí podrías manejar la dirección si es necesario
	}

  const _hourPicker = async (date) => {
    setLoadingHours(true);
    try {
      let array = [];
      let today = moment();
      let isSameDay = moment(today).isSame(date, "day");
      
      // Usar el empleado seleccionado si existe, sino 0
      const id = selectedEmployee?._id ?? 0;
      const providerId = provider?._id || localStorage.getItem('providerIdStorage');
      
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
            estimatedTime: booking.totalEstimatedWorkMinutes,
            isInBranch: booking.isInBranch,
            branch: booking.branch?._id,
            employee: id === 0 ? null : id, // Usar el ID del empleado si existe
            serviceCart: booking.serviceCart.map((e) => e.service?._id),
          }),
        }
      );
      const responseJSON = await response.json();
      
      responseJSON.data.availability.map((e) => {
        array.push((new Date(e)).getTime());
      });
      
      setHourPicker(array);
    } catch (error) {
      console.error('Error cargando horas:', error);
      setHourPicker([]);
    } finally {
      setLoadingHours(false);
    }
  };

  const _setHour = (_hour) => {
    if (!_hour) {
      return;
    }
    setHour(_hour);
  };

	return {
		_hourPicker,
		maxAvailableAfterHours,
		availability,
		unavailability,
		dialogVisible,
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
		loadingEmployees,
		loadingHours,
		onVerifyCoupon,
		onRemoveCoupon,
		dateBusy,
		getAddresses
	}
}
