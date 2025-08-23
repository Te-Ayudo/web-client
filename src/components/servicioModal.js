import Modal from "react-modal";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

Modal.setAppElement("#root");

export const servicioModal = () => {
  const onCloseModal = () => {};

  return (
    <Modal isOpen={true} onRequestClose={onCloseModal} style={customStyles}>
      <h1>Hola mundo</h1>
    </Modal>
  );
};
