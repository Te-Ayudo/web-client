import useModal from "../useModal";
import Main from "../templates/Main";
import Header from "../organisms/Header";
import Footer from "../organisms/Footer";
import Modal from '../molecules/Modal';
import Service from '../organisms/Inicio';

const Home = () => {

  const {isShowing, toggle} = useModal();

  return (
    <Main
      header={<Header/>}
      footer={<Footer />}
    >
      <Modal >
        <Service />
      </Modal>
    </Main>
  )
}

export default Home
