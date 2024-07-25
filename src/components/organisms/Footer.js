import { useSelector } from "react-redux";
import Button from "../atoms/Button";
import { useNavigate } from 'react-router-dom';

const Footer = ( { titulo="Ver Carrito",enlace="carrito" } ) =>  {

  const navigate = useNavigate();

  const carrito = useSelector((state) => state.booking.selected.serviceCart);

  const desabilitar = (enlace === "carrito" && carrito.length === 0 )

  const onCarrito = () => {
    const currentSlug = window.location.pathname.split('/')[1];

    enlace === 'carrito'
    ?navigate(`/${currentSlug}/carrito`)
    :navigate(`/${currentSlug}/programar`);
  }
  return (

  <footer className="fixed bottom-0 left-0 w-full z-10 shadowFooter py-4 sm:py-8">
    <div className="container flexCenter mx-auto">
      {
        desabilitar
        ?(
      <Button className="" disabled onClick={ onCarrito } >
        { titulo }
      </Button>
        )
        :(
      <Button className="" onClick={ onCarrito } >
        { titulo }
      </Button>
        )
      }
    </div>
  </footer>

  )

}
export default Footer
