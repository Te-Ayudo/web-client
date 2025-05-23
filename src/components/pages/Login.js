import Main from "../templates/Main";
import Footer from "../organisms/Footer";
import Modal from '../molecules/Modal';
import Login from '../organisms/Login';
import Header from "../organisms/HeaderInit";

const Inicio = () => {

  return (
    <Main 
      header={<Header/>}
      // footer={<Footer />}
    >
      <Modal showBack={1}>
        <Login/>
      </Modal>
    </Main>
  )
}

export default Inicio