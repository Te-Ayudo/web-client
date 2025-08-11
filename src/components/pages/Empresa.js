import Main from "../templates/Main";
import Header from "../organisms/Header";
import List from "../molecules/List";
import { Lista } from "../atoms/Lista";
import { useDispatch, useSelector } from "react-redux";
import { ServModal } from "../ServModal";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { startListProveedores } from "../../store";
import { BOOKING_SET_BRANCH, BOOKING_SET_SERVICE_TYPE } from "../../store/booking";
import { getBranchById, getServicesByIds } from "../../wrappers/api";
import CartSidebar from "../organisms/CartSidebar";

// Componente Skeleton profesional para servicios de sucursal
const BranchServiceSkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-white rounded-2xl shadow-md p-6 mb-4">
      {/* Header del servicio */}
      <div className="flex items-start space-x-4 mb-4">
        {/* Imagen skeleton */}
        <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0"></div>
        
        {/* Contenido skeleton */}
        <div className="flex-1 min-w-0">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>
        
        {/* Precio skeleton */}
        <div className="text-right">
          <div className="h-5 bg-gray-200 rounded w-16 mb-1"></div>
          <div className="h-3 bg-gray-200 rounded w-12"></div>
        </div>
      </div>
      
      {/* Descripción skeleton */}
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded w-full"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        <div className="h-3 bg-gray-200 rounded w-4/6"></div>
      </div>
      
      {/* Botón skeleton */}
      <div className="mt-4">
        <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
      </div>
    </div>
  </div>
);

// Componente Skeleton para la información de la sucursal
const BranchInfoSkeleton = () => (
  <div className="animate-pulse">
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-6">
      {/* Tarjeta del proveedor skeleton */}
      <div className="flex-1 rounded-2xl border border-gray-200 bg-white shadow-md p-4 sm:p-6 flex items-start gap-4">
        <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-200 rounded-xl flex-shrink-0"></div>
        <div className="flex flex-col justify-between h-full w-full">
          <div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="flex items-center mt-1">
              <div className="w-4 h-4 bg-gray-200 rounded mr-1"></div>
              <div className="h-4 bg-gray-200 rounded w-8"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Tarjeta de sucursal skeleton */}
      <div className="flex-1 bg-orange-50 border border-orange-200 rounded-2xl shadow-sm p-4 sm:p-6 flex flex-col justify-between">
        <div>
          <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-5 bg-gray-200 rounded w-3/4"></div>
        </div>
        <div className="mt-4 sm:mt-auto">
          <div className="h-10 bg-gray-200 rounded-md w-32"></div>
        </div>
      </div>
    </div>
  </div>
);

export const Empresa = (props) => {

  const { isOpenModal,active } = useSelector( state => state.servicios );

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const booking = useSelector((state) => state.booking.selected);
  const provider = useSelector((state) => state.proveedor.selected);
  const search = useSelector( state => state.servicios.search );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const { providerid, branchid } = useParams();
  const [, setUbicacion] = useState({});


  useEffect(() => {
    
    // Si tenemos ID de sucursal, cargar la sucursal y sus servicios
    if (branchid) {
      const loadBranchAndServices = async () => {
        try {
          setLoading(true);
          setError(null);
          
          // Cargar proveedor si no está cargado o es el por defecto
          if (!provider || provider.slugUrl !== providerid || provider._id === "63aca8f96eeafc6f83a943f9") {
            await dispatch(startListProveedores(providerid));
            return; // Salir aquí para que el efecto se ejecute de nuevo cuando el proveedor cambie
          }
          
          
          // Cargar sucursal por ID directamente
          const branchResponse = await getBranchById(branchid);
          // Configurar booking con la sucursal
          dispatch(BOOKING_SET_BRANCH(branchResponse));
          dispatch(BOOKING_SET_SERVICE_TYPE('local'));
          
          // Cargar servicios de la sucursal directamente
          if (branchResponse.services && branchResponse.services.length > 0) {
            const servicesResponse = await getServicesByIds(branchResponse.services);
            setServices(servicesResponse.data);
          } else {
            setServices([]);
          }
        } catch (error) {
          setError(error.message);
          setServices([]);
        } finally {
          setLoading(false);
        }
      };
      
      loadBranchAndServices();
    } else {
      // Lógica original para cuando no hay ID de sucursal
      dispatch(startListProveedores(params.providerid));
    }

    const position = {
      'latitude': JSON.parse(localStorage.getItem('latitude')),
      'longitude': JSON.parse(localStorage.getItem('longitude'))
     }
     setUbicacion(position)

  }, [branchid, providerid, provider?.slugUrl]);

  const servicesAvailableByBranch = (services) => {    
    // Si estamos en modo sucursal y hay servicios de la sucursal, mostrarlos
    if (booking.isInBranch && booking.branch && booking.branch.services) {
      return services.filter((service) =>
        booking.branch.services.includes(service._id)
      );
    }
    return services; // Fallback: mostrar todos los servicios
  };

  const [cartOpen, setCartOpen] = useState(false);
  const openCart  = () => setCartOpen(true);
  const closeCart = () => setCartOpen(false);
  return (
    <Main header={<Header back={true} services={services}/>}
    // footer={<Footer />}
    >

      <ServModal isOpen={ isOpenModal } {...active} openCart={openCart}/>
      <List>
        <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <>
            {/* Skeleton para información de proveedor y sucursal */}
            <BranchInfoSkeleton />
            
            {/* Skeleton para servicios */}
            <div className="">
              <h2 className="text-2xl font-bold text-primary mb-1">Servicios</h2>
              <p className="text-sm text-gray-600">Cargando servicios disponibles...</p>
            </div>
            
            {/* Múltiples skeletons de servicios */}
            <div className="col-span-full">
              <div className="mb-3 sm:mb-6">
                <div className="">
                  {[...Array(3)].map((_, index) => (
                    <BranchServiceSkeleton key={index} />
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : error ? (
          <div className="text-center py-8">
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar servicios</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md font-semibold"
            >
              Reintentar
            </button>
          </div>
        ) : !provider ? (
          <div className="text-center py-8">
            <div className="mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            </div>
            <h3 className="text-orange-500 text-lg font-semibold">
              Cargando proveedor<span className="animate-pulse">...</span>
            </h3>
          </div>
        ) : !booking.branch ? (
          <div className="text-center py-8">
            <div className="mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            </div>
            <h3 className="text-orange-500 text-lg font-semibold">
              Cargando sucursal<span className="animate-pulse">...</span>
            </h3>
          </div>
        ) : (
          <>
            {provider && booking.branch && (
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-6">
                {/* Tarjeta del proveedor */}
                <div className="flex-1 rounded-2xl border border-gray-200 bg-white shadow-md p-4 sm:p-6 flex items-start gap-4">
                  <img
                    src={provider.picture}
                    alt="Imagen del proveedor"
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl object-cover"
                  />
                  <div className="flex flex-col justify-between h-full w-full">
                    <div>
                      <h2 className="text-lg sm:text-xl font-semibold text-secondary">{provider.first_name}</h2>
                      <div className="flex items-center mt-1 text-sm text-gray-500">
                        <svg width="16" height="20" fill="#FF770F" className="mr-1">
                          <path d="M7.05 3.691c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.372 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.539 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118L.98 9.483c-.784-.57-.381-1.81.587-1.81H5.03a1 1 0 00.95-.69L7.05 3.69z" />
                        </svg>
                        <span className="font-medium text-secondary">{provider.avgRating}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tarjeta de sucursal */}
                <div className="flex-1 bg-orange-50 border border-orange-200 rounded-2xl shadow-sm p-4 sm:p-6 flex flex-col justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">Sucursal seleccionada:</p>
                    <h3 className="text-primary font-semibold text-lg">{booking.branch.name}</h3>
                  </div>
                  <div className="mt-4 sm:mt-auto">
                    <button
                      onClick={() => navigate(`/${providerid}/sucursales/${booking.branch._id}`)}
                      className="text-sm bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md font-semibold shadow"
                    >
                      Ver ubicación
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Resto del contenido cuando no está cargando */}
            { !!provider.recommendedServices?
            (
              
              booking.branch && servicesAvailableByBranch(provider.recommendedServices).length > 0 && (
                <>

                          <div className="col-span-full">
                            <div className="mb-3 sm:mb-6">
                              <h2 className='text-primary font-[600] mb-5 ' >
                              Recomendado
                              </h2>
                            <div className="flex flex-row  items-start " >
                              {servicesAvailableByBranch(provider.recommendedServices)[0] && (
                                <>
                        <div className="flex flex-col w-1/3 h-fit mr-5">
                          <div className="col-span-full">
                              <img
                                src={ servicesAvailableByBranch(provider.recommendedServices)[0].imageURL }
                                alt=""
                                className=" w-24 h-24 md:w-32 md:h-32 lg:w-32 lg:h-32 object-cover rounded-md "
                              />
                          </div>
                          <div className="col-span-full">
                              <h2 className='text-primary font-[600] mb-5 ' >
                                { servicesAvailableByBranch(provider.recommendedServices)[0].name } </h2>
                          </div>
                        </div>
                                </>
                              )}

                              {servicesAvailableByBranch(provider.recommendedServices)[1] && (
                                <>
                        <div className="flex flex-col w-1/3 h-fit">
                          <div className="col-span-full">
                              <img
                                src={ servicesAvailableByBranch(provider.recommendedServices)[1].imageURL }
                                alt=""
                                className=" w-24 h-24 md:w-32 md:h-32 lg:w-32 lg:h-32 object-cover rounded-md "
                              />
                          </div>
                          <div className="col-span-full">
                              <h2 className='text-primary font-[600] mb-5 ' >
                                { servicesAvailableByBranch(provider.recommendedServices)[1].name } </h2>
                          </div>
                        </div>
                                </>
                              )}

                            </div>

                            </div>
                          </div>
                </>
              )
            )
            :
            (
              //TODO: no hay recomendados
              ''
            )
            }
            { }
          <div className="">
            <h2 className="text-2xl font-bold text-primary mb-1">Servicios</h2>
            <p className="text-sm text-gray-600">Elija el servicio de su preferencia para continuar con su reserva</p>
          </div>

            <div className="col-span-full">
              <div className="mb-3 sm:mb-6">
                <ul className="">
                  {
                    (search.length > 0)
                    ?
                    (
                      search.map(
                        dato =>{
                          return <li key={dato._id} >
                            <Lista servicio={ dato } />
                          </li>
                        }
                      )
                    )
                    :
                    (
                      services && services.length > 0 ? (
                        servicesAvailableByBranch(services).map((servicio) => {
                          return (
                            <li key={servicio._id || servicio.id}>
                              <Lista servicio={servicio} />
                            </li>
                          );
                        })
                      ) : (
                        <div className="text-center py-8">
                          <div className="mb-4">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
                            </svg>
                          </div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay servicios disponibles</h3>
                          <p className="text-gray-500 mb-4">Esta sucursal no tiene servicios disponibles en este momento.</p>
                          <button 
                            onClick={() => navigate(`/${providerid}/sucursales`)}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md font-semibold"
                          >
                            Ver otras sucursales
                          </button>
                        </div>
                      )
                    )
                  }
                </ul>
              </div>
            </div>
          </>
        )}
          <CartSidebar visible={cartOpen} onClose={closeCart} />
        </div>
      </List>
    </Main>
  );
}
