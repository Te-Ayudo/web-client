import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  BOOKING_CLEAR_SERVICES,
  BOOKING_SET_SERVICE_TYPE
} from '../store';

export const useBookingPersistence = () => {
  const dispatch = useDispatch();
  const booking = useSelector((state) => state.booking.selected);

  const clearServicesOnTypeChange = (newServiceType) => {
    if (booking.serviceType && booking.serviceType !== newServiceType) {
      dispatch(BOOKING_CLEAR_SERVICES());
    }
    dispatch(BOOKING_SET_SERVICE_TYPE(newServiceType));
  };

  const restoreFormData = () => {
  };

  const updateFormData = (updates) => {
  };

  const clearAllBookingData = () => {
  };

  useEffect(() => {
  }, []);

  useEffect(() => {
    const criticalData = {
      serviceType: booking.serviceType,
      isInBranch: booking.isInBranch,
      branch: booking.branch,
      serviceCart: booking.serviceCart,
      selectedServices: booking.selectedServices,
      totalEstimatedWorkMinutes: booking.totalEstimatedWorkMinutes,
      paymentInfo: {
        totalPrice: booking.paymentInfo?.totalPrice || 0
      }
    };
    localStorage.setItem('bookingBackup', JSON.stringify(criticalData));
  }, [booking.serviceType, booking.isInBranch, booking.branch, booking.serviceCart, booking.selectedServices, booking.totalEstimatedWorkMinutes, booking.paymentInfo?.totalPrice]);

  return {
    clearServicesOnTypeChange,
    restoreFormData,
    updateFormData,
    clearAllBookingData,
    currentServiceType: booking.serviceType,
    isInBranch: booking.isInBranch,
  };
}; 