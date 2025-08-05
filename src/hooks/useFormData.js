import { useState, useEffect } from 'react';

export const useFormData = () => {
  // Datos temporales del formulario - NUNCA se persisten
  const [formData, setFormData] = useState({
    name: '',
    telefono: '',
    empleado: '',
    descuento: '',
    metodopago: '',
    nota: '',
    direccion: '',
  });

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [showDiscount, setShowDiscount] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);

  // Inicializar datos del usuario desde localStorage
  useEffect(() => {
    const initializeUserData = async () => {
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          const fullName = (user.first_name + ' ' + user.last_name).trim();
          if (fullName) {
            setFormData(prev => ({
              ...prev,
              name: fullName,
              telefono: user.phone || ''
            }));
          }
        }
      } catch (error) {
        console.error('Error initializing user data:', error);
      }
    };

    initializeUserData();
  }, []);

  // Listener para cambios en localStorage (cuando se actualiza el usuario)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'user') {
        try {
          const user = JSON.parse(e.newValue);
          const fullName = (user.first_name + ' ' + user.last_name).trim();
          if (fullName) {
            setFormData(prev => ({
              ...prev,
              name: fullName,
              telefono: user.phone || ''
            }));
          }
        } catch (error) {
          console.error('Error updating user data from storage change:', error);
        }
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
        try {
          const user = JSON.parse(e.detail.value);
          const fullName = (user.first_name + ' ' + user.last_name).trim();
          if (fullName) {
            setFormData(prev => ({
              ...prev,
              name: fullName,
              telefono: user.phone || ''
            }));
          }
        } catch (error) {
          console.error('Error updating user data from local change:', error);
        }
      }
    });

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageChange', handleStorageChange);
      localStorage.setItem = originalSetItem;
    };
  }, []);

  // Resetear todos los datos temporales
  const resetFormData = () => {
    setFormData({
      name: '',
      telefono: '',
      empleado: '',
      descuento: '',
      metodopago: '',
      nota: '',
      direccion: '',
    });
    setSelectedDate(null);
    setSelectedTime(null);
    setShowDiscount(false);
    setSelectedEmployee(null);
    setSelectedAddress(null);
  };

  // Actualizar datos del formulario
  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Seleccionar empleado
  const selectEmployee = (employee) => {
    setSelectedEmployee(employee);
    setSelectedDate(null); // Limpiar fecha cuando cambia empleado
    setSelectedTime(null); // Limpiar hora cuando cambia empleado
  };

  // Seleccionar dirección
  const selectAddress = (address) => {
    setSelectedAddress(address);
  };

  return {
    // Datos del formulario
    formData,
    updateFormData,
    
    // Fecha y hora
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    
    // Empleado y dirección
    selectedEmployee,
    selectEmployee,
    selectedAddress,
    selectAddress,
    
    // UI
    showDiscount,
    setShowDiscount,
    
    // Utilidades
    resetFormData
  };
}; 