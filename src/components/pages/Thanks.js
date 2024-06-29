import Button from "../atoms/Button"
import { useNavigate } from 'react-router-dom';


import logoapple from '../../assets/apple.svg';
import logogoogle from '../../assets/google-play.svg';

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
  <span className="text-white-500 text-center top-2/5 my-0 mx-auto block relative w-1/3 h-0 mt-5" >
   <p> !Confirmado! </p>
    <div className="flex justify-between items-center ml-10 p-2 " >

    <svg width="266" height="352" viewBox="0 0 266 352" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_1_494)">
    <path d="M124.603 177.252C124.603 184.93 128.45 191.551 134.094 195.126H241.082C246.866 191.496 250.823 184.735 250.823 176.932V173.552C250.823 161.937 242.197 152.493 231.592 152.493H143.515C133.077 152.493 124.603 161.784 124.603 173.218V177.252Z" fill="white"/>
    <path d="M244.887 202.874H129.746C118.29 202.874 108.981 212.165 108.981 223.599V227.647C108.981 239.067 118.29 248.358 129.746 248.358H244.887C256.523 248.358 266 238.914 266 227.299V223.933C266 212.318 256.523 202.874 244.887 202.874Z" fill="white"/>
    <path d="M130.624 330.064C130.624 321.705 134.122 314.277 139.599 309.061C125.245 307.572 113.984 295.582 113.984 280.894V276.832C113.984 268.291 117.858 260.697 123.851 255.48C110.946 252.768 101.219 241.32 101.219 227.647V223.599C101.219 210.051 110.779 198.729 123.489 195.863C119.405 190.87 116.841 184.416 116.841 177.252V173.218C116.841 165.011 120.158 157.667 125.37 152.479H104.521H101.581H93.6651L94.6128 147.833L103.504 73.5549C103.546 73.2071 103.643 72.8594 103.783 72.5256C113.775 48.3643 116.284 16.817 93.8045 1.30767C89.9441 -1.34909 84.6066 0.194892 82.767 4.50691L6.94022 182.607C2.34128 191.259 0 200.676 0 210.162V223.488V240.875V248.623V261.601V294.316C0 326.114 25.9213 352 57.7794 352H139.264C133.982 346.798 130.624 339.454 130.624 331.261V330.064Z" fill="white"/>
    <path d="M224.498 309.339H157.702C147.041 309.339 138.372 318.644 138.372 330.064V331.261C138.372 342.681 147.041 351.972 157.702 351.972H224.498C235.326 351.972 244.134 342.528 244.134 330.913C244.134 318.797 235.326 309.339 224.498 309.339Z" fill="white"/>
    <path d="M237.779 256.106H142.511C131.056 256.106 121.747 265.398 121.747 276.832V280.893C121.747 292.299 131.056 301.605 142.511 301.605H237.779C249.416 301.605 258.879 292.146 258.879 280.532V277.179C258.879 265.551 249.416 256.106 237.779 256.106Z" fill="white"/>
    </g>
    <defs>
    <clipPath id="clip0_1_494">
    <rect width="266" height="352" fill="white"/>
    </clipPath>
    </defs>
    </svg>


    </div>
   <p> Tu servicio ha sido procesado con exito </p>

  </span>


  <div className="p-4 absolute inset-x-0 bottom-0 flex items-center justify-center bg-white text-primary shadow-lg rounded-lg  " >

  <div className="flex flex-col items-center justify-center" >

    <div className=" w-full bg-white flex flex-col space-y-1 p-3 " >
        <Button bg='white' tc='orange' className=' border-orange-500 border-2 ' onClick={onInicio} > Volver al Inicio </Button>
    </div>
    <div className=" w-full bg-white flex flex-col space-y-1 p-3 " >
        <Button> Chatea con nosotros </Button>
    </div>
    <div className=" w-full bg-white flex space-y-2 p-3 items-center justify-center " >

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
