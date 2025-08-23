import { useDispatch, useSelector } from "react-redux";
import Main from "../templates/Main";
import Appointment from "../organisms/Appointment";
import List from "../molecules/List";
import { AddressModal } from "../AddressModal";
import Header from "../organisms/HeaderInit";

const ServiceAppointment = (props) => {
  const { isOpenModalAddress } = useSelector((state) => state.booking);

  return (
    <Main header={<Header back={true} />}>
      <AddressModal isOpen={isOpenModalAddress} />
      <div className="flexCenter py-4 pb-16">
        <div className="container">
          <Appointment />
        </div>
      </div>
    </Main>
  );
};

export default ServiceAppointment;
