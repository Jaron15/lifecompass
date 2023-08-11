import React from "react";

const DayViewModal = ({ isOpen, onClose, items }) => {
  if (!isOpen) return null;

  function handleClose(params) {
    console.log("button clicked");
    onClose();
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 ">
      <div className="bg-white w-5/6 h-5/6 overflow-y-scroll rounded-lg p-6">
        <button
          onClick={(event) => {
            event.stopPropagation();
            onClose();
          }}
          className="mb-4 bg-red-500"
        >
          Close
        </button>
        {items.map((item, index) => (
          <div key={index} className="mb-4">
            <div className="flex justify-between items-center bg-gray-200 p-4 rounded-lg">
              <span>{item.name}</span>
              <button>Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DayViewModal;
