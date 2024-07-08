import Button from "../atoms/Button"
import { useNavigate } from 'react-router-dom';


import logoapple from '../../assets/apple-play.png';
import logogoogle from '../../assets/google-play.png';
import handok from '../../assets/frame_ok.svg';

export const Thanks = () => {


  const navigate = useNavigate();
  const onInicio = () => {
    navigate('/');
  }

  const onApple = () => {
    console.log('apple');
  }
  const onGoogle = () => {
    console.log('google');
  }

  return (
    <>


<div className="bg-primary text-white w-full h-full fixed block top-0 left-0  opacity-100 z-50">
  <span className="flex justify-items-center text-white-500 text-center top-2/5 my-0 mx-auto block relative w-2/3 h-0 mt-5" >
  <div className="flex flex-col w-full" >

      <p className="pb-2" > !Confirmado! </p>
      <div className="flex items-center justify-center w-full  content-center " >
        <img src={ handok } className="m-2 p-5 w-60  " />

      </div>
   <p className="pt-2" > Tu servicio ha sido procesado con exito </p>
    <div className="w-full flex space-y-2 p-3 items-center justify-center " >

        <div className='flex justify-center cursor-pointer' >
        Descarga la app
        </div>
        <a href="http://onelink.to/teayudo" className='flex justify-center cursor-pointer ml-2' >
          <img src={logoapple}  />
        </a>
        <a href="http://onelink.to/teayudo" className='flex justify-center cursor-pointer ml-2' >
          <img src={logogoogle}  />
        </a>

    </div>


  </div>

  </span>


  <div className="p-4 absolute inset-x-0 bottom-0 flex items-center justify-center bg-white text-primary shadow-lg rounded-lg  " >

  <div className="flex flex-col items-center justify-center" >

    <div className=" w-full bg-white flex flex-col space-y-1 p-3 " >
        <Button bg='white' tc='orange' className=' border-orange-500 border-2 ' onClick={onInicio} > Volver al Inicio </Button>
    </div>
    <div className=" w-full bg-white flex flex-col space-y-1 p-3 " >
        <Button> Chatea con nosotros </Button>
    </div>
  </div>


      {/* <div className=" flex justify-between items-center border-b border-slate-200 py-3 px-2 border-l-4  border-l-transparent mb-5 " >
        <div className=" w-full bg-white flex flex-col space-y-2 p-3 " >

        <Button onClick={onInicio} > Volver al Inicio </Button>
        </div>
      </div>
      <div className=" flex justify-between items-center border-b border-slate-200 py-3 px-2 border-l-4  border-l-transparent mb-5 " >
        <div className=" w-full bg-white flex flex-col space-y-2 p-3 " >

        <Button> Chatea con nosotros </Button>
        </div>
      </div> */}

  </div>

</div>



    </>
  )
}
