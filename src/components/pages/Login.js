import Main from "../templates/Main";
import Header from "../organisms/Header";
import Footer from "../organisms/Footer";
import Modal from '../molecules/Modal';
import Login from '../organisms/Login';

const Inicio = () => {

  return (
    <Main 
      header={<Header/>}
      footer={<Footer />}
    >
      <Modal showBack={1}>
        <Login/>
      </Modal>
    </Main>
  )
}

export default Inicio