import Main from "../templates/Main";
import Header from "../organisms/Header";
import Footer from "../organisms/Footer";
import Modal from "../molecules/Modal";
import UpdateCustomer from "../organisms/UpdateCustomer";

const UpdateCustomerPage = () => {
  return (
    <Main header={<Header />} footer={<Footer />}>
      <Modal>
        <UpdateCustomer />
      </Modal>
    </Main>
  );
};

export default UpdateCustomerPage;
