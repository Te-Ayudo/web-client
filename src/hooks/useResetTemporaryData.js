import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BOOKING_RESET_EMPLOYEE } from "../store";

export const useResetTemporaryData = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Resetear datos temporales al cargar la aplicación
    dispatch(BOOKING_RESET_EMPLOYEE());
  }, [dispatch]);
};
