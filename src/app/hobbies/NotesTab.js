import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  addNote, 
  deleteNote, 
  updateNote 
} from '../../redux/hobbies/hobbiesSlice';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';
import DeleteModal from '@/src/components/DeleteModal';

function NotesTab({ hobby }) {
  const dispatch = useDispatch();
  const allNotes = useSelector(state => 
    state.hobbies.hobbies.find(h => h.refId === hobby.refId)?.notes || []
  );

  const { user } = useSelector(state => state.user);
  const [noteHeader, setNoteHeader] = useState('');
  const [noteBody, setNoteBody] = useState('');
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editing, setEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [creating, setCreating] = useState(false);

  const handleAddNote = () => {
    if (noteHeader.trim() && noteBody.trim()) {
      const newNote = {
        id: Date.now().toString(),  
        header: noteHeader.trim(),
        body: noteBody.trim()
      };
      dispatch(addNote({ 
        user, 
        hobbyId: hobby.refId, 
        note: newNote 
      }));
      setNoteHeader('');
      setNoteBody('');
    }
  };
  

  const handleCreateNew = () => {
    setCreating(true);
    setEditing(false);
    setViewNote(null);
  };

  const handleSaveNewNote = () => {
    handleAddNote();
    setCreating(false);
  };


  const confirmRemoveNote = (noteId) => {
    dispatch(deleteNote({
      user,
      hobbyId: hobby.refId,
      noteId
    }));
  };

  const handleEditClick = (noteId, header, body) => {
    setEditingNoteId(noteId);
    setNoteHeader(header);
    setNoteBody(body);
  };

  const handleConfirmEdit = (noteId) => {
    if (noteHeader.trim() && noteBody.trim()) {
      const updatedNote = {
        id: noteId,
        header: noteHeader.trim(),
        body: noteBody.trim()
      };
      console.log(updateNote);
      dispatch(updateNote({
        user,
        hobbyId: hobby.refId,
        updatedNote: updatedNote,
        noteId: noteId
      }));
      setViewNote(updatedNote);
      setNoteHeader('');
      setNoteBody('');
      setEditingNoteId(null);
      setEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setNoteHeader('');
    setNoteBody('');
    setEditingNoteId(null);
  };

  const [viewNote, setViewNote] = useState(null); 

  // This function sets the note that should be viewed.
  const handleNoteClick = (note) => {
    setViewNote(note);
  }
  return (
    <div className="bg-gray-100 p-6 rounded shadow-md h-[70%] w-full">
        <DeleteModal 
        isOpen={showDeleteModal} 
        type={'note'} 
        onDelete={confirmRemoveNote}
        onCancel={() => setShowDeleteModal(false)}
        />
        
      {/* If we're viewing an individual note */}
      {viewNote ? (
  <div className='h-full'>
    <div className="flex justify-between items-center mb-4">
    <button className='mb-4' onClick={() => {
      setViewNote(null);
      setEditing(false); 
    }}>
      &larr; Back
    </button>
  { !editing ? 
  <button className='mb-4' onClick={() => {
          handleEditClick(viewNote.id, viewNote.header, viewNote.body);
          setEditing(true);
        }}>
            <FaPencilAlt /> 
            </button> 
            :
    <button className='mb-4' onClick={() => {setShowDeleteModal(true);
        }}>
            <FaTrash />
            </button>
            }
        </div>
    
    {editing ? (
  <div className='h-full'>
    <div 
      className="text-3xl font-bold focus:outline-none" 
      contentEditable={true} 
      suppressContentEditableWarning={true} 
      onBlur={e => setNoteHeader(e.target.innerText)}
    >
      {viewNote.header}
    </div>
    <div 
      className="text-black mt-4 focus:outline-none" 
      contentEditable={true} 
      suppressContentEditableWarning={true} 
      onBlur={e => setNoteBody(e.target.innerText)}
    >
      {viewNote.body}
    </div>
    <div className='flex w-full justify-center space-x-6 mt-6'>
    <button className='bg-blue-500 rounded p-2' onClick={() => handleConfirmEdit(viewNote.id)}>
        Confirm 
    </button>
    <button className='bg-red-500 rounded p-2' onClick={() => setEditing(false)}>
        Cancel 
    </button>
    </div>
    
  </div>
) : (
      <>
        <h3 className="text-3xl font-bold">{viewNote.header}</h3>
        <p className="text-black mt-4">{viewNote.body}</p>
       
   
      </>
    )}
  </div>
) : (
        // Otherwise, display the list of notes
        <>
          {/* <button onClick={handleAddNote} className="bg-blue-500 text-white px-4 py-2 rounded">+</button> */}
          <ul>
            {allNotes.map(note => (
              <li key={note.id} className="flex justify-between items-start bg-white p-4 rounded mb-2 shadow" >
                <div className='w-[85%]' onClick={() => handleNoteClick(note)} >
                  <h3 className="text-2xl font-bold truncate">{note.header}</h3>
                  <p className="text-black truncate">{note.body}</p>
                </div>
                <button onClick={() => handleRemoveNote(note.id)} className="text-red-600">Delete</button>
              </li>
            ))}
          </ul>
          <div className="fixed bottom-0 left-0 right-0 bg-black bg-opacity-50 p-4 rounded-t flex justify-between items-center z-10">
            <div className="text-white">{allNotes.length} Notes</div>
            <button onClick={handleAddNote} className="bg-blue-500 text-white px-4 py-2 rounded">+</button>
        </div>
        </>
      )}
    </div>
  );
}


export default NotesTab;
