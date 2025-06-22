import { useEffect } from "react";
import { startListProveedores} from '../../store';
import { useDispatch, useSelector } from "react-redux";

import Main from "../templates/Main";
import Modal from '../molecules/Modal';
import Service from '../organisms/Inicio';
import { useParams } from 'react-router-dom';
import LoginWhatsappPage from "../pages/LoginWhatsapp";
import Header from "../organisms/HeaderInit";

const Home = () => {
  const {providerid} = useParams();
  const estado = useSelector((state) => state.auth.status);  
  // const {isShowing, toggle} = useModal();
  
  const is_logeado = (estado === "authenticated" )

  const user = localStorage.getItem("user");

  let userJson = null;

  if (user) {
    try {
      userJson = JSON.parse(user);
    } catch (error) {
      console.error("Error al parsear el usuario desde localStorage:", error);
    }
  }

  if (userJson) {
    console.log("Usuario parseado correctamente:", userJson);
  } else {
    console.log("No se pudo obtener o parsear el usuario desde localStorage.");
  }


  const dispatch = useDispatch();

  useEffect(() => {
     dispatch( startListProveedores(providerid) )
  }, [])
  
  return (
    <Main
      header={<Header/>}
    >
      <Modal>
        {
          is_logeado
          ? ( !userJson?.status ? <Service /> : <Service /> )
          : ( <LoginWhatsappPage /> )
        }
      </Modal>
    </Main>
  )
}

export default Home
