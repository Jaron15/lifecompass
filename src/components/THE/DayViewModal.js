import React, {  useState } from "react";

import { useDispatch, useSelector } from 'react-redux';
import {  deleteTask} from '../../redux/tasks/tasksSlice';
import {ImCancelCircle} from 'react-icons/Im';
import DeleteModal from '../DeleteModal';  
import { deleteEvent } from "@/src/redux/events/eventsSlice";
import { deleteHobby } from "@/src/redux/hobbies/hobbiesSlice";
import EditItemModal from "./EditItemModal";
import DayItem from "./DayItem";

const DayViewModal = ({ isOpen, onClose, items, date, fromHomepage }) => {
  const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user)
  //delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  //edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
const [itemToEdit, setItemToEdit] = useState(null);
const [expandedItem, setExpandedItem] = useState(null); 

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

const toggleDetails = (index) => {
  if (expandedItem === index) {
    setExpandedItem(null);
  } else {
    setExpandedItem(index);
  }
};
const formattedDate = formatDateToMonthDay(date);

const HomePageHeader = <div className="w-full flex mb-12">
<h2 className="text-center text-xl font-bold text-black dark:text-current w-full">
   Your Day At A Glance
  </h2>
    </div>;

const homeClass1 = 'relative col-span-12 rounded border border-stroke bg-white px-5 pt-7.5 pb-5 shadow drop-shadow-2xl dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8';
const homeClass2 = '';

  return (
    <div className={`${fromHomepage ? homeClass1 : 'fixed inset-0 cursor-default flex items-center justify-center z-50 w-full lg:w-768px mx-auto '}`}>
       <DeleteModal 
        isOpen={showDeleteModal} 
        type={itemToDelete?.category.toLowerCase()} 
        item={itemToDelete}
        onDelete={confirmDelete}
        onCancel={cancelDelete}
      />
  <div className={`${fromHomepage ? homeClass2 : 'relative shadow drop-shadow-2xl bg-white w-5/6 h-5/6 sm:w-3/5 sm:h-4/6 md:w-4/6 md:h-4/6 lg:w-1/2 2xl:w-2/5 lg:ml-72 lg:mt-14 mt-12 overflow-y-scroll rounded-lg p-6 bg-white dark:bg-boxdark border border-primary hide-scrollbar'}`}>

    {!fromHomepage ? <div className="w-full flex mb-12">
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
        </div> : HomePageHeader}

        {items.map((item, index) => {
     

          return (
              <DayItem
              item={item}
              index={index}
              isEditModalOpen={isEditModalOpen}
            handleDeleteClick={handleDeleteClick} 
            handleEditClick={handleEditClick}
            date={date}
            fromHomepage={fromHomepage} 
            expandedItem={expandedItem}
        toggleDetails={toggleDetails}

            />
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
