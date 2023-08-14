import React from 'react';
import EventEditForm from './eventComponents/EventEditForm';
import TaskEditForm from './taskComponents/TaskEditForm';
import HobbyEditForm from './hobbyComponents/HobbyEditForm';


const EditItemModal = ({ isOpen, item, onClose }) => {
  // if (!isOpen) return null;

  let formComponent;
  switch (item.category) {
    case 'Event':
      formComponent = <EventEditForm item={item} onClose={onClose} />;
      break;
    case 'Hobby':
      formComponent = <HobbyEditForm item={item} onClose={onClose} />;
      break;
    case 'Task':
      formComponent = <TaskEditForm item={item} onClose={onClose} />;
      break;
    default:
      break;
  }

  return (
    <div className="absolute top-0 left-0 flex w-full h-full items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white w-5/6 h-5/6 overflow-y-scroll rounded-lg p-6 bg-white dark:bg-boxdark border border-primary hide-scrollbar">
      <h2 className="text-2xl text-center font-bold underline mb-1 text-black dark:text-current">Edit {item.name}</h2> 
        {formComponent}
      </div>
    </div>
  );
}

export default EditItemModal;
