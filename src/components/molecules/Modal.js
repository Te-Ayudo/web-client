import React, {useEffect, useRef} from "react";
import Button from "../atoms/Button";
import { BiChevronLeft } from "react-icons/bi";

function Modal({children, isModalOpen, closeModal, showBack}) {

  let modalRef = useRef();

  const checkClickOutside = (e) => {
    if (isModalOpen && modalRef.current && !modalRef.current.contains(e.target)) {
      closeModal();
    }
  }

  useEffect(() => {
    document.addEventListener('click', checkClickOutside);
    return () => document.removeEventListener('click', checkClickOutside);
  });

  const currentSlug = window.location.pathname.split('/')[1];

  return (
    <div ref={modalRef}
      className="news-modal-overlay topV"
    >
      <div className="news-modal-body">
        {children}
        {showBack ? 
          <Button 
            className = "absolute left-18 top-0 w-[30px]" 
            href = {`/${currentSlug}/login`} 
            onClick = {closeModal}
            decoration = {<BiChevronLeft size="3rem" className="text-primary !p-0" />}>
          </Button>
          : null }
      </div>
    </div>
  );
}

export default Modal;
