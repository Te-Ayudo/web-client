import { useSelector } from "react-redux";
import Button from "./Button"
import { Lista } from "./Lista"

const Item = (props) => {
  const  servicios  = !!(props.servicios)? props.servicios :false ;
  const categorias = !!props.categoria? props.categoria: null ;

  const search = useSelector( state => state.servicios.search );

  return (
    < >
      <div className="grid grid-cols-1 gap-4" >
        <article className="flex items-start space-x-6">
          <img src={props.image} alt="" width="145" height="145" className="flex-none rounded-md bg-slate-100" />
          <div className="relative h-full flex flex-col justify-end">
            <h2 className="text-secondary">{props.empresa}</h2>
            <dl className="mt-2 flex text-sm leading-6 font-medium">
                <dt className="mr-3">
                  <span className="sr-only">Star rating</span>

                  <svg width="16" height="20" fill="#FF770F">
                    <path d="M7.05 3.691c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.372 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.539 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118L.98 9.483c-.784-.57-.381-1.81.587-1.81H5.03a1 1 0 00.95-.69L7.05 3.69z" />
                  </svg>
                </dt>
                <dd className="font-semibold text-secondary">{props.puntaje}</dd>
            </dl>
          </div>
        </article>
        {/* agregar recomendados */}
        { !!props.recomendado?
        (
          props.recomendado.length>0 && (
  <>
  
            <div className="col-span-full">
              <div className="mb-3 sm:mb-6">
                <h2 className='text-primary font-[600] mb-5 ' >
                Recomendado
                </h2>
              <div className="flex flex-row  items-start " >
                {props.recomendado[0] && (
                  <>
          <div className="flex flex-col w-1/3 h-fit mr-5">
            <div className="col-span-full">
                <img
                  src={ props.recomendado[0].imageURL }
                  alt=""
                  className=" w-24 h-24 md:w-32 md:h-32 lg:w-32 lg:h-32 object-cover rounded-md "
                />
            </div>
            <div className="col-span-full">
                <h2 className='text-primary font-[600] mb-5 ' >
                  { props.recomendado[0].name } </h2>
            </div>
          </div>
                  </>
                )}

                {props.recomendado[1] && (
                  <>
          <div className="flex flex-col w-1/3 h-fit">
            <div className="col-span-full">
                <img
                  src={ props.recomendado[1].imageURL }
                  alt=""
                  className=" w-24 h-24 md:w-32 md:h-32 lg:w-32 lg:h-32 object-cover rounded-md "
                />
            </div>
            <div className="col-span-full">
                <h2 className='text-primary font-[600] mb-5 ' >
                  { props.recomendado[1].name } </h2>
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
        )}


        <div className="" >
          <Button className="pl-0" disabled  >
            Servicios
          </Button>
        </div>

        <div className="py-4">
          {
            (!!categorias)?
              categorias.map(
                category =>{
                  return  <Button key={category}  className="btn-auto font-normal mr-5" > {category} </Button>
                }
              )
            : ''
          }
        </div>
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
            (servicios)?
              servicios.map(
                servicio =>{
                  return <li key={servicio._id} >
                    <Lista servicio={ servicio } />
                  </li>
                }
              )
              : ''
            )
          }
        </ul>

      </div>

    </>
  )
}

export default Item
