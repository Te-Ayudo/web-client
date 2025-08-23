import Main from "../templates/Main";
import Header from "../organisms/Header";
import Footer from "../organisms/Footer";
import Modal from "../molecules/Modal";
import RegistroUbicacion from "../organisms/RegistroUbicacion";

const RegistrarUbicacion = () => {
  return (
    <Main header={<Header />} footer={<Footer />}>
      <Modal showBack={1}>
        <RegistroUbicacion />
      </Modal>
    </Main>
  );
};

export default RegistrarUbicacion;
