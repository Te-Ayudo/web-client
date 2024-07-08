import React from 'react'
import Modal from 'react-modal'
import { useDispatch } from 'react-redux';
import { BOOKING_SET_ERROR, setNotActiveModalAddress } from '../store';
import { MapComponent } from './map/MapComponent';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
  },
};

Modal.setAppElement('#root');

export const AddressModal = ({ isOpen=true  }) => {

  const dispatch = useDispatch();

  const onCloseModal = () => {
    dispatch(setNotActiveModalAddress());
    dispatch( BOOKING_SET_ERROR(null) );
    dispatch( BOOKING_SET_ERROR(null) );
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onCloseModal}
      overlayClassName="modal-fondo"
      closeTimeoutMS={200}
      style={customStyles}
      className="modal"
    >

      <MapComponent  />
    </Modal>
  )
}
