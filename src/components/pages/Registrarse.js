import Main from "../templates/Main";
import Footer from "../organisms/Footer";
import Modal from "../molecules/Modal";
import Registro from "../organisms/Registro";
import Header from "../organisms/HeaderInit";

const Registrarse = () => {
  return (
    <Main header={<Header />}>
      <Modal showBack={1}>
        <Registro />
      </Modal>
    </Main>
  );
};

export default Registrarse;
