import { SucursalesItem } from "../atoms/SucursalesItem"
import List from "../molecules/List"
import Main from "../templates/Main"
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import Header from '../organisms/HeaderInit';
import { getBranchesByProvider } from '../../wrappers/api';

export const SucursalesPage = () => {
  const proveedor = useSelector((state) => state.proveedor.selected);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const loadBranches = async () => {
      if (proveedor?._id && proveedor._id !== "63aca8f96eeafc6f83a943f9") {
        try {
          setLoading(true);
          setError(null);
          
          const branchesResponse = await getBranchesByProvider(proveedor._id);
          setBranches(branchesResponse);
          
        } catch (error) {
          setError(error.message);
          setBranches([]);
        } finally {
          setLoading(false);
        }
      } else {
        setBranches([]);
        setLoading(false);
      }
    };

    loadBranches();
  }, [proveedor?._id]);

  // Mostrar loading mientras se cargan las sucursales
  if (loading) {
    return (
      <Main header={<Header isSticky={true} back={true}/>} isSticky={true}>
        <List>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-primary mb-1">Sucursales</h2>
            <p className="text-sm text-gray-600">Cargando sucursales disponibles...</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-white rounded-2xl shadow-md p-4 mb-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
                  <div className="flex gap-2">
                    <div className="h-10 bg-gray-200 rounded-full w-1/2"></div>
                    <div className="h-10 bg-gray-200 rounded-full w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </List>
      </Main>
    );
  }

  // Mostrar error si ocurrió algún problema
  if (error) {
    return (
      <Main header={<Header isSticky={true} back={true}/>} isSticky={true}>
        <List>
          <div className="text-center py-8">
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar sucursales</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md font-semibold"
            >
              Reintentar
            </button>
          </div>
        </List>
      </Main>
    );
  }

  // Mostrar mensaje si no hay sucursales
  if (branches.length === 0) {
    return (
      <Main header={<Header isSticky={true} back={true}/>} isSticky={true}>
        <List>
          <div className="text-center py-8">
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay sucursales disponibles</h3>
            <p className="text-gray-500 mb-4">Este proveedor no tiene sucursales disponibles en este momento.</p>
            <button 
              onClick={() => window.history.back()}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md font-semibold"
            >
              Volver
            </button>
          </div>
        </List>
      </Main>
    );
  }

  return (
    <>
      <Main header={<Header isSticky={true} back={true}/>} isSticky={true}>
        <List>
          {/* <Button  className="btn-auto font-normal mb-5" disabled={true} > Sucursales </Button> */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-primary mb-1">Sucursales</h2>
            <p className="text-sm text-gray-600">Elija la sucursal de su preferencia para continuar con su reserva</p>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            { branches.map((item) => (
              <SucursalesItem key={item._id} {...item} />
            ))}
          </ul>
        </List>
      </Main>
    </>
  );
}
