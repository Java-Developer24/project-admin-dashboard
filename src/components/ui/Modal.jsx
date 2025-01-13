// components/ui/Modal.js
import React from "react";

const Modal = ({ children, isOpen, onClose, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray bg-opacity-60 ">
      <div className="bg-black w-[90%] max-w-md rounded-lg shadow-xl overflow-hidden transform transition-all duration-300 scale-95 hover:scale-100 border-2 border-gray-400">
        <div className="flex justify-between items-center p-4 border-b border-gray-700 bg-black">
          <h3 className="text-white text-lg font">{title}</h3>
          <button
            onClick={onClose}
            className="text-white hover:text-green-500 transition"
          >
            <span className="sr-only">Close</span>
            &#x2715;
          </button>
        </div>
        <div className="p-6 text-white">
          {children}
        </div>
        <div className="p-4 bg-black rounded-b-lg">
          
        </div>
      </div>
    </div>
  );
};

export default Modal;
