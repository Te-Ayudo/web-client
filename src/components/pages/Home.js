import { useSelector } from "react-redux";
import useModal from "../useModal";
import Main from "../templates/Main";
import Header from "../organisms/Header";
import Footer from "../organisms/Footer";
import Modal from '../molecules/Modal';
import Service from '../organisms/Inicio';
import Login from "../organisms/Login";

const Home = () => {

  const estado = useSelector((state) => state.auth.status);
  const {isShowing, toggle} = useModal();
  const is_logeado = (estado === "authenticated" )

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
