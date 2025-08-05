import _fetch from './_fetch';
import moment from 'moment';

const API_BASE_URL = process.env.REACT_APP_API_URL;

// ===== NUEVOS ENDPOINTS =====

// Obtener sucursal por ID
export const getBranchById = async (branchId) => {
  try {
    const response = await _fetch(`${API_BASE_URL}/enterprise/branches/public/${branchId}`, {
      method: 'GET'
    });
    
    const text = await response.text();
    const data = text ? JSON.parse(text) : null;
    
    if (!response.ok) {
      const error = (data && data.message) || data?.error || response.statusText;
      throw new Error(error);
    }
    
    return data;
  } catch (error) {
    console.error("Error al obtener sucursal:", error);
    throw error;
  }
};

// Obtener sucursales filtradas por providerId
export const getBranchesByProvider = async (providerId) => {
  try {
    
    const response = await _fetch(`${API_BASE_URL}/enterprise/branches/public/provider/${providerId}`, {
      method: 'GET'
    });
    
    const text = await response.text();
    const data = text ? JSON.parse(text) : null;
    
    if (!response.ok) {
      const error = (data && data.message) || data?.error || response.statusText;
      throw new Error(error);
    }
    
    return data;
  } catch (error) {
    console.error("Error al obtener sucursales:", error);
    throw error;
  }
};

// Obtener servicios por array de IDs
export const getServicesByIds = async (serviceIds) => {
  try {
    
    const response = await _fetch(`${API_BASE_URL}/service/by-ids`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serviceIds })
    });
    
    const text = await response.text();
    
    const data = text ? JSON.parse(text) : null;
    
    if (!response.ok) {
      const error = (data && data.message) || data?.error || response.statusText;
      throw new Error(error);
    }
    
    return data;
  } catch (error) {
    throw error;
  }
};

// Obtener servicios de un proveedor filtrados por método
export const getServicesByProviderAndMethod = async (providerId, method) => {
  try {
    const response = await _fetch(`${API_BASE_URL}/service/provider/${providerId}`, {
      method: 'GET'
    });
    
    const text = await response.text();
    const data = text ? JSON.parse(text) : null;
    
    if (!response.ok) {
      const error = (data && data.message) || data?.error || response.statusText;
      throw new Error(error);
    }
    
    // Filtrar por método en el frontend
    const filteredServices = data.data.filter(service => 
      service.method === method || service.method === "Ambos"
    );
    
    return { data: filteredServices };
  } catch (error) {
    console.error("Error al obtener servicios del proveedor:", error);
    throw error;
  }
};

// Obtener todos los servicios de un proveedor (para verificar disponibilidad)
export const getAllServicesByProvider = async (providerId) => {
  try {
    
    const response = await _fetch(`${API_BASE_URL}/service/provider/${providerId}`, {
      method: 'GET'
    });
    
    const text = await response.text();
    const data = text ? JSON.parse(text) : null;
    
    if (!response.ok) {
      const error = (data && data.message) || data?.error || response.statusText;
      throw new Error(error);
    }
    
    return data;
  } catch (error) {
    console.error("Error al verificar servicios disponibles:", error);
    throw error;
  }
};

// NUEVA FUNCIÓN: Obtener servicios filtrados directamente desde el backend
export const getServicesFilteredByMethod = async (providerId, method) => {
  try {
    
    const response = await _fetch(`${API_BASE_URL}/service/provider/${providerId}/filtered`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ method })
    });
    
    const text = await response.text();
    
    const data = text ? JSON.parse(text) : null;
    
    if (!response.ok) {
      const error = (data && data.message) || data?.error || response.statusText;
      throw new Error(error);
    }
    
    return data;
  } catch (error) {
    console.error("Error al obtener servicios filtrados:", error);
    throw error;
  }
};

// Obtener disponibilidad de fechas
export const getDateAvailability = async (providerId, selectedDate, finalBooking) => {
  try {
    const response = await _fetch(
      `${API_BASE_URL}/dateAvailability/${providerId === 0 ? 0 : providerId}?idprovider=${providerId}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: moment(selectedDate).startOf("day").utc().format(),
          estimatedTime: finalBooking.totalEstimatedWorkMinutes,
          isInBranch: finalBooking.isInBranch,
          branch: finalBooking.branch?._id,
          employee: finalBooking.employee?._id ?? null,
          serviceCart: finalBooking.serviceCart.map((e) => e.service?._id),
        }),
      }
    );
    
    const data = await response.json();
    
    if (!response.ok) {
      const error = data?.message || data?.error || response.statusText;
      throw new Error(error);
    }
    
    return data;
  } catch (error) {
    console.error("Error al obtener disponibilidad de fechas:", error);
    throw error;
  }
}; 