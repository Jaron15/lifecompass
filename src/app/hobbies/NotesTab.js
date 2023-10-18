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
  const [viewNote, setViewNote] = useState(null); 

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

  const confirmRemoveNote = (noteId) => {
    dispatch(deleteNote({
      user,
      hobbyId: hobby.refId,
      noteId
    }));
    setShowDeleteModal(false)
    setNoteHeader('');
      setNoteBody('');
      setViewNote(null);
      setEditing(false);
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

  

  const handleNoteClick = (note) => {
    setViewNote(note);
  }

  const handleCreateNew = () => {
    setCreating(true);
    setEditing(false);
    setViewNote(null);
  };

  const handleSaveNewNote = () => {
    handleAddNote();
    setCreating(false);
  };

  return (
    <div className="bg-gray-100 p-6 rounded shadow-md h-[70%] w-full">
      <DeleteModal 
        isOpen={showDeleteModal} 
        type={'note'} 
        onDelete={() => confirmRemoveNote(viewNote.id)}
        onCancel={() => setShowDeleteModal(false)}
      />
      
      {creating ? (
        <div className='h-full'>
          <div className="flex justify-between items-center mb-4">
            <button onClick={() => setCreating(false)}>&larr; Back</button>
          </div>
          <input 
            type="text" 
            value={noteHeader}
            onChange={(e) => setNoteHeader(e.target.value)} 
            placeholder="Header" 
            className="w-full p-2 bg-transparent text-3xl font-bold mb-4 focus:border-none"
          />
          <textarea 
            value={noteBody}
            onChange={(e) => setNoteBody(e.target.value)}
            placeholder="Body..."
            className="w-full p-2 border rounded mb-4"
          />
          <button className='bg-blue-500 rounded p-2' onClick={handleSaveNewNote}>
            Save
          </button>
        </div>
      ) : viewNote ? (
        <div className='h-full'>
          <div className="flex justify-between items-center mb-4">
            <button onClick={() => {
              setViewNote(null);
              setEditing(false); 
            }}>
              &larr; Back
            </button>
            { !editing ? 
              <button onClick={() => {
                handleEditClick(viewNote.id, viewNote.header, viewNote.body);
                setEditing(true);
              }}>
                <FaPencilAlt /> 
              </button>
              :
              <button onClick={() => setShowDeleteModal(true)}>
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
        <>
          <ul>
            {allNotes.map(note => (
              <li key={note.id} className="flex justify-between items-start bg-white p-4 rounded mb-2 shadow " >
                <div className='w-[95%]' onClick={() => handleNoteClick(note)} >
                  <h3 className="text-2xl font-bold truncate">{note.header}</h3>
                  <p className="text-black truncate">{note.body}</p>
                </div>
             
              </li>
            ))}
          </ul>
          <div className="fixed bottom-0 left-0 right-0 bg-black bg-opacity-50 p-4 rounded-t flex justify-between items-center z-10">
            <div className="text-white">{allNotes.length} Notes</div>
            <button onClick={handleCreateNew} className="bg-blue-500 text-white px-4 py-2 rounded">+</button>
          </div>
        </>
      )}
    </div>
  );
}

export default NotesTab;
