import React from "react";

const DayViewModal = ({ isOpen, onClose, items }) => {
  if (!isOpen) return null;
  console.log(items);

  function getClassNameForCategory(category) {
    switch (category) {
      case "Event":
        return "border border-blue-400";
      case "Hobby":
        return "border border-green-400";
      case "Task":
        return "border border-yellow-600";
      default:
        return "border border-gray-200";
    }
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
            <div
              className={`flex justify-between items-center p-4 rounded-lg ${getClassNameForCategory(
                item.category
              )}`}
            >
              <span className="text-black">{item.name}</span>
              <button className="text-black">Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DayViewModal;
