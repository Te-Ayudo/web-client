import { useEffect } from "react";
import { startListProveedores, startListServicios } from '../../store';
import { useDispatch, useSelector } from "react-redux";

import useModal from "../useModal";
import Main from "../templates/Main";
import Header from "../organisms/Header";
import Footer from "../organisms/Footer";
import Modal from '../molecules/Modal';
import Service from '../organisms/Inicio';
import Login from "../organisms/Login";
import { useParams } from 'react-router-dom';

const Home = () => {
  const {providerid} = useParams();
  const estado = useSelector((state) => state.auth.status);
  const {isShowing, toggle} = useModal();
  const is_logeado = (estado === "authenticated" )

  const dispatch = useDispatch();

  useEffect(() => {
     dispatch( startListProveedores(providerid) )
  }, [])

  return (
    <Main
      header={<Header/>}
      footer={<Footer />}
    >
      <Modal >
        {
          is_logeado
          ? ( <Service /> )
          : ( <Login /> )
        }
      </Modal>
    </Main>
  )
}

export default Home
