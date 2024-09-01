import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import Button from "../atoms/Button";

import { BOOKING_ISINBRANCH, BOOKING_NOTISINBRANCH, startListServicios } from "../../store";

export const Service = () => {
  const {providerid} = useParams();
  const [actDomicilio, setActDomicilio] = useState(true)
  const [actLocal, setActLocal] = useState(true)


  const {status} = useSelector( state => state.auth );
  const provideSelect = useSelector((state) => state.proveedor.selected)
  const servicesList = useSelector((state) => state.servicios.services)
  const navigate = useNavigate();
  const dispatch= useDispatch();

  useEffect(() => {

      dispatch(startListServicios(provideSelect))

      const contAmbos = servicesList.reduce( (acount,item)=>{
        if(item.method === "Ambos"){ acount.ambos++ ;}
        if(item.method === "En sucursal"){acount.local++ ;}
        if(item.method === "A domicilio"){ acount.domicilio++ ; }

          return acount;
       }, {ambos:0,local:0,domicilio:0})

       if(contAmbos.ambos>0 || contAmbos.local>0 ){
          setActLocal(true)
       }else{

          setActLocal(false)
       }
       if(contAmbos.ambos>0 || contAmbos.domicilio>0 ){
          setActDomicilio(true)
       }else{

          setActDomicilio(false)
       }
       
  }, [])
  useEffect(() => {
       const contAmbos = servicesList.reduce( (acount,item)=>{
        if(item.method === "Ambos"){ acount.ambos++ ;}
        if(item.method === "En sucursal"){acount.local++ ;}
        if(item.method === "A domicilio"){ acount.domicilio++ ; }

          return acount;
       }, {ambos:0,local:0,domicilio:0})

       if(contAmbos.ambos>0 || contAmbos.local>0 ){
          setActLocal(true)
       }else{

          setActLocal(false)
       }
       if(contAmbos.ambos>0 || contAmbos.domicilio>0 ){
          setActDomicilio(true)
       }else{

          setActDomicilio(false)
       }

  }, [ servicesList ])

  const onServicioDomicilio = (event) => {
    event.preventDefault();
    dispatch( BOOKING_NOTISINBRANCH() );
    status === 'authenticated' ? navigate(`/${providerid}/servicios`):navigate(`/${providerid}/login`)
  }

  const onServicioLocal = (event) => {    event.preventDefault();
    dispatch( BOOKING_ISINBRANCH() );
    status === 'authenticated' ? navigate(`/${providerid}/sucursales`):navigate(`/${providerid}/login`)
  }

  const isProviedor=!!providerid;
  return (
    <div className="text-center" >
      <h3 className="h3 text-primary">Quieres tu servicio <br />en el local o a domicilio?</h3>

      <div className="col-span-full">
        <div className="mb-3 sm:mb-12">
          { actDomicilio?(
          <Button
            disabled={!isProviedor}
            bg="btn-transparent"
            tc="text-secondary hover:text-white"
            href = {`/${providerid}/login`}
            onClick={ onServicioDomicilio }
            className="sm:h-[80px] lg-text-[26px] sm bordered">
            Servicio a domicilio
          </Button>

          ):(
          <Button
            disabled={ true }
            bg="btn-transparent"
            tc="text-secondary hover:text-white"
            className="sm:h-[80px] lg-text-[26px] sm bordered">
            Servicio a domicilio
          </Button>

          )
          }
        </div>
      </div>
      <div className="col-span-full">
        <div className="mb-3 sm:mb-6">
          {
          actLocal?(
          <Button
            disabled={!isProviedor}
            bg="btn-transparent"
            tc="text-secondary hover:text-white"
            href = {`/${providerid}/login`}
            onClick={ onServicioLocal }
            className="sm:h-[80px] lg-text-[26px] bordered">
            Servicio en el local
          </Button>

          ):(
          <Button
            disabled={ true }
            bg="btn-transparent"
            tc="text-secondary hover:text-white"
            className="sm:h-[80px] lg-text-[26px] bordered">
            Servicio en el local
          </Button>

          )
          }
        </div>
      </div>
    </div>
  )
};

export default Service
