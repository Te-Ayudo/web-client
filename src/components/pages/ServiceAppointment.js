import { useDispatch, useSelector } from "react-redux";
import Main from "../templates/Main";
import Header from "../organisms/Header";
import Appointment from "../organisms/Appointment";
import List from "../molecules/List";
import { AddressModal } from "../AddressModal";

const ServiceAppointment = (props) => {

  const { isOpenModalAddress } = useSelector( state => state.booking );

  return (
    <Main
      header={<Header />}

    >
      <AddressModal isOpen={ isOpenModalAddress } />
      <List>
        <Appointment />
      </List>

    </Main>
  )
}

export default ServiceAppointment
