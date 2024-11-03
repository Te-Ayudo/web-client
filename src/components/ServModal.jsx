import { useEffect, useState } from "react";
import Modal from "react-modal";
import Button from "./atoms/Button";
import { useDispatch } from "react-redux";
import { setNotActiveModal } from "../store/servicios";
import { useNavigate, useParams } from "react-router-dom";
import { BOOKING_ADD_TO_CART } from "../store";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    maxHeight: "80vh",
    overflowY: "auto",
  },
};

Modal.setAppElement("#root");

export const ServModal = ({ _id, name, unitPrice, description = "", imageURL = "", unitEstimatedWorkMinutes, variablePrice, isOpen = false, availableAfterHours }) => {
  const { providerid } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [cant, setCant] = useState(1);

  const [isReadMore, setIsReadMore] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsReadMore(false);
    }
  }, [isOpen]);

  const onCloseModal = () => {
    setCant(1);
    dispatch(setNotActiveModal());
  };

  const onIncrement = () => {
    const newvalor = cant + 1;
    if (newvalor < 1) return;
    setCant(cant + 1);
  };
  const onDecrement = () => {
    const newvalor = cant - 1;
    if (newvalor < 1) return;
    setCant(cant - 1);
  };

  const onCarrito = () => {
    console.log("agregar al carrito");
    //dispatch( addNewItem( { _id,name,unitPrice,description,imageURL,cant } ) );
    if (cant < 1) {
      return setCant(1);
    }

    const price = cant * unitPrice;
    const quantity = cant;
    const estimatedWorkMinutes = cant * unitEstimatedWorkMinutes;
    const serv = { _id, name, unitPrice, description, imageURL, unitEstimatedWorkMinutes, variablePrice, availableAfterHours };
    dispatch(
      BOOKING_ADD_TO_CART({
        quantity,
        service: serv,
        price,
        estimatedWorkMinutes,
      })
    );

    dispatch(setNotActiveModal());
    navigate(`/${providerid}/carrito`);
  };

  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };

  const descriptionLines = description.split("\n");

  return (
    <Modal isOpen={isOpen} onRequestClose={onCloseModal} style={customStyles} className="modal" overlayClassName="modal-fondo" closeTimeoutMS={200}>
      <div className="container w-full">
        <div className="flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center border-b border-slate-200 py-3 px-2 border-l-4  border-l-transparent mb-2">
            <div className="w-full sm:w-2/3 bg-white flex flex-col basis-3/4 space-y-2 p-3 inline-flex items-start space-x-2 text-wrap">
              <div className="text-slate-500 ">
                {" "}
                <strong>{name}</strong>{" "}
              </div>
              <div className={`text-slate-500 text-wrap break-words text-justify overflow-hidden ${isReadMore ? "" : "line-clamp-5"}`}>
                {descriptionLines.map((line, index) => (
                  <span key={index}>
                    {line}
                    <br />
                  </span>
                ))}
              </div>
              {descriptionLines.length > 5 && (
                <button onClick={toggleReadMore} className="text-blue-500 cursor-pointer mt-0">
                  {isReadMore ? "Leer menos" : "Leer más"}
                </button>
              )}
              <div className="text-slate-500">
                {variablePrice ? <span className="text-primary">Desde</span> : ""}
                <strong> Bs. {unitPrice} </strong>
              </div>
            </div>
            <div className="w-full sm:w-auto flex flex-col basis-1/4 justify-center items-center mt-4 sm:mt-0">
              <img src={imageURL} alt="" width="70" height="70" className="flex-col rounded-md bg-slate-100" />

              <div className="mt-2 flex flex-row items-center">
                <button type="button" className={`btn-icon  `} onClick={onDecrement}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="0.8em" height="0.8em" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M18 11H6a2 2 0 0 0 0 4h12a2 2 0 0 0 0-4" />
                  </svg>
                  <span className="sr-only">Icon description</span>
                </button>
                <span className={` mr-1.5  `}> {cant} </span>
                <button type="button" className="btn-icon" onClick={onIncrement}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="0.8em" height="0.8em" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M21 13h-8v8h-2v-8H3v-2h8V3h2v8h8z" />
                  </svg>
                  <span className="sr-only">Icon description</span>
                </button>
              </div>
            </div>
          </div>

          <div className="container flexCenter mx-auto my-auto sm:my-0">
            <Button className="" onClick={onCarrito}>
              Agregar
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
