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
import CartSidebar from "../organisms/CartSidebar";

export const Empresa = (props) => {

  const { isOpenModal,active } = useSelector( state => state.servicios );

  const services = useSelector((state) => state.servicios.services);
  const booking = useSelector((state) => state.booking.selected);
  const provider = useSelector((state) => state.proveedor.selected);
  //const service = useSelector((state) => state.servicios.selected);
  const search = useSelector( state => state.servicios.search );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const { providerid } = useParams();
  const [, setUbicacion] = useState({});

  useEffect(() => {
    //dispatch(startListServiciosbyProvider(booking.provider._id));

    dispatch( startListProveedores(params.providerid) );
    const position = {
      'latitude': JSON.parse(localStorage.getItem('latitude')),
      'longitude': JSON.parse(localStorage.getItem('longitude'))
     }
     setUbicacion(position)



  }, []);

  const servicesAvailableByBranch = (services) => {    
    
    // return services;
    return services.filter((service) =>
      booking.isInBranch ? booking.branch.services.includes(service._id) : true
    );
  };

  const groupServicesBySubCategory = () => {
    return servicesAvailableByBranch(services).reduce(
      (result, currentValue) => {
        if (
          Object.keys(result).length === 0 &&
          props.route.params.subcategory &&
          props.route.params.subcategory !== "Todos"
        ) {
          result[props.route.params.subcategory] = [];
        }
        (result[currentValue.subCategory.name] =
          result[currentValue.subCategory.name] || []).push(currentValue);
        return result;
      },
      {}
    );
  };

  const createRoute = async (latitude, longitude) => {
    const url = `comgooglemaps://?daddr=${latitude},${longitude}&travelmode=driving`;
    const urlAndroid = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;

    const newWindow = window.open(urlAndroid, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null

  };
  const [cartOpen, setCartOpen] = useState(false);
  const openCart  = () => setCartOpen(true);
  const closeCart = () => setCartOpen(false);
  return (
    <Main header={<Header back={true}/>}
    // footer={<Footer />}
    >

      <ServModal isOpen={ isOpenModal } {...active} openCart={openCart}/>
      <List>
        <div className="grid grid-cols-1 gap-4">
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
                      services
                        && servicesAvailableByBranch(services).map((servicio) => {
                            return (
                              <li key={servicio.id}>
                                <Lista servicio={servicio} />
                              </li>
                            );
                          })
                  )

                }
              </ul>
            </div>
          </div>
          <CartSidebar visible={cartOpen} onClose={closeCart} />
        </div>
      </List>
    </Main>
  );
}
