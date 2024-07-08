import Main from "../templates/Main";
import Header from "../organisms/Header";
import Footer from "../organisms/Footer";
import List from "../molecules/List";
import Button from "../atoms/Button";
import { Lista } from "../atoms/Lista";
import { useDispatch, useSelector } from "react-redux";
import Maps from "../map/Map";
import { ServModal } from "../ServModal";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { startListProveedores, startListServiciosbyProvider } from "../../store";
import { DistanceDisplay } from "../../api/DistanceDisplay";

export const Empresa = (props) => {

  const { isOpenModal,active } = useSelector( state => state.servicios );

  const services = useSelector((state) => state.servicios.services);
  const state = useSelector((state) => state);
  const booking = useSelector((state) => state.booking.selected);
  const provider = useSelector((state) => state.proveedor.selected);
  //const service = useSelector((state) => state.servicios.selected);
  const search = useSelector( state => state.servicios.search );
  const [groupedServices, setGroupedServices] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [ubicacion, setUbicacion] = useState({});

  useEffect(() => {

    //dispatch(startListServiciosbyProvider(booking.provider._id));

    dispatch( startListProveedores() );
    const position = {
      'latitude': JSON.parse(localStorage.getItem('latitude')),
      'longitude': JSON.parse(localStorage.getItem('longitude'))
     }
     setUbicacion(position)

  }, []);

  const servicesAvailableByBranch = (services) => {
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

    //const finalUrl = Platform.OS === "ios" ? url : urlAndroid;
    //Linking.openURL(finalUrl);
  };

  return (
    <Main header={<Header />}
    footer={<Footer />}
    >

      <ServModal isOpen={ isOpenModal } {...active} />
      <List>
        <div className="grid grid-cols-1 gap-4">
          {
            provider && (
              <article className="flex items-start space-x-6">
                <img
                  src={provider.picture}
                  alt=""
                  width="145"
                  height="145"
                  className="flex-none rounded-md bg-slate-100"
                />
                <div className="relative h-full flex flex-col justify-end">
                  <h2 className="text-secondary">{ provider.first_name }</h2>
                  <dl className="mt-2 flex text-sm leading-6 font-medium">
                    <dt className="mr-3">
                      <span className="sr-only">Star rating</span>

                      <svg width="16" height="20" fill="#FF770F">
                        <path d="M7.05 3.691c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.372 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.539 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118L.98 9.483c-.784-.57-.381-1.81.587-1.81H5.03a1 1 0 00.95-.69L7.05 3.69z" />
                      </svg>
                    </dt>
                    <dd className="font-semibold text-secondary"> { provider.avgRating } </dd>
                  </dl>
                </div>
              </article>

            )
          }
          <div className="col-span-full">
            <div className="mb-3 sm:mb-6">
            {booking.isInBranch && (
              <>
              <Maps
                address={''}
                lat={ booking.branch.addressInfo.coordinates.latitude }
                lng={ booking.branch.addressInfo.coordinates.longitude }
                drag={false}
                altura={true}
              />
              </>
            )

            }

            </div>
          </div>

          <div className="col-span-full">
            <div className="mb-3 sm:mb-6">
              <div className="flex justify-center">
                <Button
                 onClick={ () =>
                  createRoute(
                    booking.branch.addressInfo.coordinates.latitude,
                    booking.branch.addressInfo.coordinates.longitude
                  )}
                 type="submit" className="sm:h-[48px] !text-[14px]">
                  Como llegar
                </Button>
              </div>
            </div>
          </div>

          {
            booking.branch && (
            <div className="col-span-full">
              <div className="mb-3 sm:mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>{ booking.branch.name }</div>
                  <div className="text-right text-primary">
                {booking.customer.address.coordinates && (
                  <>
                <DistanceDisplay
                    origin={ubicacion}
                    destination={ booking.branch.addressInfo.coordinates}
                />

                  </>
                  // <DistanceDisplay
                  //   origin={booking.customer.address.coordinates}
                  //   destination={booking.branch.addressInfo.coordinates}
                  // />
                )}
                    {/* Distancia 2 KM */}
                  </div>
                </div>
              </div>
            </div>
            )
          }
          { booking.branch && servicesAvailableByBranch(provider.recommendedServices).length > 0 && (
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
          )}

          <div className="col-span-full">
            <div className="mb-3 sm:mb-6">
              <ul>
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
                  && services.map((servicio) => {
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

        </div>
      </List>
    </Main>
  );
}
