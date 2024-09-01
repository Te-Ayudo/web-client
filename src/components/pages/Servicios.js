import {  useDispatch, useSelector } from "react-redux";
import Main from "../templates/Main";
import Header from "../organisms/Header";
import Footer from "../organisms/Footer";
import List from "../molecules/List";
import Item from "../atoms/Item";
import { ServModal } from "../ServModal";

import { startListProveedores } from '../../store';
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Button from "../atoms/Button";

const Servicios = (props) => {


  const dispatch = useDispatch();
  const params = useParams();

  useEffect(() => {
    dispatch( startListProveedores(params.providerid) );
  }, [])

  const { services,isOpenModal,active } = useSelector( state => state.servicios );
	const proveedor = useSelector((state) => state.proveedor.selected)

  return (
    <Main
      header={<Header />}
      footer={<Footer />}
    >
      <ServModal isOpen={ isOpenModal } {...active} />

      <List>
        {
        proveedor && (
          <Item
            key= {proveedor._id}
            id= {proveedor._id}
            empresa= {proveedor.first_name}
            puntaje= {proveedor.avgRating}
            image= {proveedor.picture}
            categoria = {null}
            servicios= {proveedor.services}
            recomendado={proveedor.recommendedServices}
          />

        )
        }
      </List>

    </Main>
  )
}

export default Servicios
