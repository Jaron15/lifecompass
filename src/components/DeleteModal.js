
import React from 'react';

const DeleteModal = ({ isOpen, type, item, onDelete, onCancel }) => {
  if (!isOpen) return null;
console.log(item);
  let message = '';

  switch (type) {
    case 'hobby':
      message = 'Are you sure you want to delete this hobby? All of your progress and scheduled days will be permanently removed.';
      break;
    case 'event':
      message = 'Are you sure you want to delete this event? Your event and its details will be removed permanently.';
      break;
    case 'task':
      if (item.type === 'recurring') {
        message = 'Are you sure you want to delete this task from your schedule? All upcoming tasks will be permanently removed from your calendar.';
      } else {
        message = 'Are you sure you want to delete this task? The calendar item and its details will be permanently deleted.';
      }
      break;
      case 'note':
      message = 'Are you sure you want to delete this note? It will be permanently removed.';
      break;
    default:
      break;
  }

  return (
    <div className="fixed top-0 left-0 w-full text-black z-50 h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-md shadow-lg w-96">
        <p>{message}</p>
        <div className="mt-4 flex justify-end">
          <button className="mr-4 px-4 py-2 bg-gray-300 rounded-md" onClick={onCancel}>Cancel</button>
          <button className="px-4 py-2 bg-red-500 text-white rounded-md" onClick={() => onDelete(item)}>Delete</button>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;
