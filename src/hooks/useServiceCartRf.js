import { useDispatch, useSelector } from 'react-redux'
import { BOOKING_ADD_TO_CART, BOOKING_REMOVE_FROM_CART } from '../store'

const useServiceCartRf = () => {
	const dispatch = useDispatch()

	const changeQuantity = (serviceOrder, qty) => {		
		const serviceO= {
			...serviceOrder,
			quantity:qty
		}
		if (qty < 1) {
      return dispatch(BOOKING_REMOVE_FROM_CART(serviceO.service._id));
		}
		serviceO.price = qty * serviceO.service.unitPrice
		serviceO.estimatedWorkMinutes = qty * serviceO.service.unitEstimatedWorkMinutes

    dispatch( BOOKING_ADD_TO_CART(serviceO) );
	}
	return {
		changeQuantity,
	}
}

export default useServiceCartRf
