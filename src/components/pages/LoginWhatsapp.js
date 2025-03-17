import Main from "../templates/Main";
import Header from "../organisms/Header";
import Footer from "../organisms/Footer";
import Modal from "../molecules/Modal";
import LoginWhatsapp from "../organisms/LoginWhatsapp";

const LoginWhatsappPage = () => {  
  return (
    <Main header={<Header />} footer={<Footer />}>
      <Modal>
        <LoginWhatsapp />
      </Modal>
    </Main>
  );
};

export default LoginWhatsappPage;
