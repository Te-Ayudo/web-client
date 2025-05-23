import {  useDispatch, useSelector } from "react-redux";
import Main from "../templates/Main";
import Header from "../organisms/Header";
import Footer from "../organisms/Footer";
import List from "../molecules/List";
import Item from "../atoms/Item";
import { ServModal } from "../ServModal";

import { startListProveedores } from '../../store';
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Button from "../atoms/Button";
import CartSidebar from "../organisms/CartSidebar";

const Servicios = (props) => {


  const dispatch = useDispatch();
  const params = useParams();

  useEffect(() => {
    dispatch( startListProveedores(params.providerid) );
  }, [])

  const { services,isOpenModal,active } = useSelector( state => state.servicios );
	const proveedor = useSelector((state) => state.proveedor.selected)  
  const filteredServices = services?.filter((service) => service.method === "Ambos" || service.method === "A domicilio");
  const [cartOpen, setCartOpen] = useState(false);

  const openCart  = () => setCartOpen(true);
  const closeCart = () => setCartOpen(false);
  return (
    <Main
      header={<Header back={true}/>}
      // footer={<Footer />}
    >
      <ServModal isOpen={ isOpenModal } {...active} openCart={openCart}/>
    
      <List>
        {proveedor && (
            <Item
              key= {proveedor._id}
              id= {proveedor._id}
              empresa= {proveedor.first_name}
              puntaje= {proveedor.avgRating}
              image= {proveedor.picture}
              categoria = {null}
              servicios= {filteredServices}
              recomendado={proveedor.recommendedServices}
            />
        )
        }
      </List>
      <CartSidebar visible={cartOpen} onClose={closeCart} />
    </Main>
  )
}

export default Servicios
