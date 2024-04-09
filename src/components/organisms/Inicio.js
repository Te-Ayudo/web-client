import { Navigate } from "react-router-dom";
import Button from "../atoms/Button";

export const Service = () => {

  const gotToNewPage=(type)=> {
    const tipo = type;
    //console.log(type);
    <Navigate to="/servicios" replace={true}  state={tipo} />
  }

  return (
    <div className="text-center" >
      <h3 className="h3 text-primary">Quieres tu servicio <br />en el local o a dimicilio?</h3>

      <div className="col-span-full">
        <div className="mb-3 sm:mb-12">
          <Button
            bg="btn-transparent"
            tc="text-secondary hover:text-white"
            href = "/servicios"
            //onClick={() => gotToNewPage('D')}
            className="sm:h-[80px] lg-text-[26px] sm bordered">
            Servicio a domicilio
          </Button>
        </div>
      </div>
      <div className="col-span-full">
        <div className="mb-3 sm:mb-6">
          <Button
            bg="btn-transparent"
            tc="text-secondary hover:text-white"
            href = "/servicios"
            //onClick={() => gotToNewPage('L')}
            className="sm:h-[80px] lg-text-[26px] bordered">
            Servicio en el local
          </Button>
        </div>
      </div>
    </div>
  )
};

export default Service
