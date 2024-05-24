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

export const Empresa = () => {

  const { isOpenModal,active } = useSelector( state => state.servicios );
//  const servicios = [
//    {
//      id: 1,
//      titulo: "Servicio 1",
//      precio: "80",
//      image: "https://placehold.co/200x200",
//    },
//    {
//      id: 2,
//      empresa: "Servicio 2",
//      precio: "145",
//      image: "https://placehold.co/200x200",
//   },
//     {
//      id: 2,
//      empresa: "Servicio 2",
//      precio: "145",
//      image: "https://placehold.co/200x200",
//    },
//  ];

  const services = useSelector((state) => state.servicios.services);
  const state = useSelector((state) => state);
  const booking = useSelector((state) => state.booking.selected);
  const provider = useSelector((state) => state.proveedor.selected);
  //const service = useSelector((state) => state.servicios.selected);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const servicesAvailableByBranch = (services) => {
    return services.filter((service) =>
      booking.isInBranch ? booking.branch.services.includes(service._id) : true
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

          <div className="col-span-full">
            <div className="mb-3 sm:mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>{ booking.branch.name }</div>
                <div className="text-right text-primary">
              {booking.customer.address.coordinates && (
                <>
                Distancia
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

{servicesAvailableByBranch(provider.recommendedServices).length > 0 && (
<>

          <div className="col-span-full">
            <div className="mb-3 sm:mb-6">
              <h2 className='text-primary font-[600] mb-5 ' >
              Recomendado
              </h2>
            <div className="flex justify-center items-start " >
              {servicesAvailableByBranch(provider.recommendedServices)[0] && (
                <>
        <div className="grid grid-flow-row-dense grid-cols-3">
           <div className="col-span-full">
               <img
                src={ servicesAvailableByBranch(provider.recommendedServices)[0].imageURL }
                alt=""
                width="120"
                height="120"
                className="flex-none rounded-md bg-slate-100 mr-5 bg-slate-500"
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
        <div className="grid grid-flow-row-dense grid-cols-3">
           <div className="col-span-full">
               <img
                src={ servicesAvailableByBranch(provider.recommendedServices)[1].imageURL }
                alt=""
                width="120"
                height="120"
                className="flex-none rounded-md bg-slate-100 mr-5 bg-slate-500"
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
                {services
                  ? services.map((servicio) => {
                      return (
                        <li key={servicio.id}>
                          <Lista servicio={servicio} />
                        </li>
                      );
                    })
                  : ""}
              </ul>
            </div>
          </div>

        </div>
      </List>
    </Main>
  );
}
