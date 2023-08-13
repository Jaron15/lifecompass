import React from 'react';
import EventEditForm from './EventEditForm';
import TaskEditForm from './TaskEditForm'
// ... (import the other two edit forms here) ...

const EditItemModal = ({ isOpen, item, onClose }) => {
  // if (!isOpen) return null;
console.log('teh edit modal ');
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
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white w-5/6 h-5/6 sm:w-3/5 sm:h-4/6 md:w-4/6 md:h-4/6 lg:w-1/2 2xl:w-2/5 lg:ml-72 lg:mt-14 mt-12 overflow-y-scroll rounded-lg p-6 bg-white dark:bg-boxdark border border-primary hide-scrollbar">
      <h2 className="text-2xl text-center font-bold underline mb-1 text-black dark:text-current">Edit {item.name}</h2> {/* This is the added title */}
        {formComponent}
      </div>
    </div>
  );
}

export default EditItemModal;
