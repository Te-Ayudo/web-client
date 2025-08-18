import React from 'react';
import { HiQuestionMarkCircle } from 'react-icons/hi';

const TourFloatingButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="
        fixed bottom-6 right-6 z-50
        bg-orange-500 hover:bg-orange-600
        text-white rounded-full
        w-12 h-12 flex items-center justify-center
        shadow-lg hover:shadow-xl
        transition-all duration-300
        transform hover:scale-110
      "
      title="¿Necesitas ayuda? Haz clic para un tour guiado"
    >
      <HiQuestionMarkCircle size={24} />
    </button>
  );
};

export default TourFloatingButton;
