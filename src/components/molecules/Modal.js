import React, { useEffect, useRef } from "react";
import Button from "../atoms/Button";
import { BiChevronLeft } from "react-icons/bi";

function Modal({ children, isModalOpen, closeModal, showBack }) {
  const modalRef = useRef();

  const checkClickOutside = (e) => {
    if (isModalOpen && modalRef.current && !modalRef.current.contains(e.target)) {
      closeModal();
    }
  };

  useEffect(() => {
    document.addEventListener("click", checkClickOutside);
    return () => document.removeEventListener("click", checkClickOutside);
  });

  const currentSlug = window.location.pathname.split("/")[1];

  return (
    <div ref={modalRef} className="news-modal-overlay topV">
      <div className="news-modal-body">
        {children}
        {showBack ? (
          <Button
            className="absolute sm:left-5 sm:top-6 left-5 top-17 w-[30px]"
            href={`/${currentSlug}/`}
            onClick={closeModal}
            decoration={<BiChevronLeft size="3rem" className="text-primary !p-0" />}
          ></Button>
        ) : null}
      </div>
    </div>
  );
}

export default Modal;
