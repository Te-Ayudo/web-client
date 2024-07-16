import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Button from "../atoms/Button";
import Swal from "sweetalert2";
import { BOOKING_ISINBRANCH, BOOKING_NOTISINBRANCH } from "../../store";

export const Service = () => {

  const [actDomicilio, setActDomicilio] = useState(true)
  const [actLocal, setActLocal] = useState(true)

  const {status} = useSelector( state => state.auth );
  const servicesList = useSelector((state) => state.servicios.services)
  const navigate = useNavigate();
  const dispatch= useDispatch();

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
    const currentSlug = window.location.pathname.split('/')[1];
    
    status === 'authenticated' ? navigate(`/${currentSlug}/servicios`):navigate(`/${currentSlug}/login`);
  }

  const onServicioLocal = (event) => {    event.preventDefault();
    dispatch( BOOKING_ISINBRANCH() );
    const currentSlug = window.location.pathname.split('/')[1];
    status === 'authenticated' ? navigate(`/${currentSlug}/sucursales`):navigate(`/${currentSlug}/login`);
  }

  const currentSlug = window.location.pathname.split('/')[1];

  return (
    <div className="text-center" >
      <h3 className="h3 text-primary">Quieres tu servicio <br />en el local o a domicilio?</h3>

      <div className="col-span-full">
        <div className="mb-3 sm:mb-12">
          { actDomicilio?(
          <Button
            bg="btn-transparent"
            tc="text-secondary hover:text-white"
            href = {`/${currentSlug}/login`}
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
            bg="btn-transparent"
            tc="text-secondary hover:text-white"
            href = {`/${currentSlug}/login`}
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
