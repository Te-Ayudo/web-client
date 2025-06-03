import { useEffect } from "react";
import { startListProveedores, startListServicios } from '../../store';
import { useDispatch, useSelector } from "react-redux";

import useModal from "../useModal";
import Main from "../templates/Main";
import Modal from '../molecules/Modal';
import { useParams } from 'react-router-dom';
import LoginWhatsappPage from "./LoginWhatsapp";
import Header from "../organisms/HeaderInit";

const LoginHome = () => {
  const {providerid} = useParams();
  

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
        <LoginWhatsappPage />
      </Modal>
    </Main>
  )
}

export default LoginHome
