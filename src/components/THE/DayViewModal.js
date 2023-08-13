import React, {  useState } from "react";

import { useDispatch, useSelector } from 'react-redux';
import {  deleteTask} from '../../redux/tasks/tasksSlice';
import {ImCancelCircle} from 'react-icons/Im';
import DeleteModal from '../DeleteModal';  
import { deleteEvent } from "@/src/redux/events/eventsSlice";
import { deleteHobby } from "@/src/redux/hobbies/hobbiesSlice";
import EditItemModal from "./eventComponents/EditItemModal";
import DayItem from "./DayItem";

const DayViewModal = ({ isOpen, onClose, items, date }) => {
  const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user)
  //delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  //edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
const [itemToEdit, setItemToEdit] = useState(null);

//delete
  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  }

  const confirmDelete = (item) => {
    switch(itemToDelete.category) {
    case 'Task':
      dispatch(deleteTask({userId:user.uid, taskId:itemToDelete.refId}))
      break;
    case 'Event':
      dispatch(deleteEvent({userId:user.uid, eventId:itemToDelete.refId}))
      break;
    case 'Hobby':
      dispatch(deleteHobby({user:user, hobbyId:itemToDelete.refId}))
      break;
      default:
       
        break;
    }

    setShowDeleteModal(false);
    setItemToDelete(null);
  }

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  }
//delete
//edit
const handleEditClick = (item) => {
  setItemToEdit(item);
  setIsEditModalOpen(true);
};

  if (!isOpen) return null;

function formatDateToMonthDay(dateString) {
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const options = { weekday: 'long', month: 'long', day: 'numeric' };
  return date.toLocaleDateString(undefined, options);
}

const formattedDate = formatDateToMonthDay(date);



  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 w-full lg:w-768px mx-auto">
       <DeleteModal 
        isOpen={showDeleteModal} 
        type={itemToDelete?.category.toLowerCase()} 
        item={itemToDelete}
        onDelete={confirmDelete}
        onCancel={cancelDelete}
      />
  <div className="relative bg-white w-5/6 h-5/6 sm:w-3/5 sm:h-4/6 md:w-4/6 md:h-4/6 lg:w-1/2 2xl:w-2/5 lg:ml-72 lg:mt-14 mt-12 overflow-y-scroll rounded-lg p-6 bg-white dark:bg-boxdark border border-primary hide-scrollbar">
    <div className="w-full flex mb-12">
    <h2 className="text-center text-xl font-bold  text-black dark:text-current w-full">
        {formattedDate}
      </h2>
        <div 
           onClick={(event) => {
            event.stopPropagation();
            onClose();
            setIsEditModalOpen(false)
          }}
            className="absolute top-5 right-6 cursor-pointer cursor-pointer text-black dark:text-current"
            title="Close"
        >
            <ImCancelCircle size={24} />
        </div>
        </div>

        {items.map((item, index) => {
     

          return (
              <DayItem
              item={item}
              index={index}
              isEditModalOpen={isEditModalOpen}
            handleDeleteClick={handleDeleteClick} 
            handleEditClick={handleEditClick}
            date={date} />

        )})}
        {
        isEditModalOpen && (
          <EditItemModal
            item={itemToEdit}
            onClose={() => {
              setIsEditModalOpen(false);
              setItemToEdit(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default DayViewModal;
