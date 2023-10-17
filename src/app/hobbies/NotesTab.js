import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  addNote, 
  deleteNote, 
  updateNote 
} from '../../redux/hobbies/hobbiesSlice';

function NotesTab({ hobby }) {
  const dispatch = useDispatch();
  const allNotes = useSelector(state => 
    state.hobbies.hobbies.find(h => h.refId === hobby.refId)?.notes || []
  );

  const { user } = useSelector(state => state.user);
  const [noteHeader, setNoteHeader] = useState('');
  const [noteBody, setNoteBody] = useState('');
  const [editingNoteId, setEditingNoteId] = useState(null);

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
  

  const handleRemoveNote = (noteId) => {
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
      setNoteHeader('');
      setNoteBody('');
      setEditingNoteId(null);
    }
  };

  const handleCancelEdit = () => {
    setNoteHeader('');
    setNoteBody('');
    setEditingNoteId(null);
  };

  return (
    <div className="bg-gray-100 p-6 rounded shadow-md">
      <h2 className="text-2xl mb-4">NotesTab</h2>
      <div className="mb-6">
        <input 
          type="text" 
          value={noteHeader} 
          onChange={(e) => setNoteHeader(e.target.value)} 
          placeholder="Note Header..." 
          className="w-full p-2 border rounded mb-4"
        />
        <textarea
          value={noteBody}
          onChange={(e) => setNoteBody(e.target.value)}
          placeholder="Note Body..."
          className="w-full p-2 border rounded mb-4"
        />
        {editingNoteId ? (
          <>
            <button onClick={() => handleConfirmEdit(editingNoteId)} className="bg-green-500 text-white px-4 py-2 rounded mr-2">Confirm</button>
            <button onClick={handleCancelEdit} className="bg-red-500 text-white px-4 py-2 rounded">Cancel</button>
          </>
        ) : (
          <button onClick={handleAddNote} className="bg-blue-500 text-white px-4 py-2 rounded">Add</button>
        )}
      </div>
      <ul>
        {allNotes.map(note => (
          <li key={note.id} className="flex justify-between items-start bg-white p-4 rounded mb-2 shadow">
            <div>
              <h3 className="text-xl font-bold">{note.header}</h3>
              <p className="text-black">{note.body}</p>
            </div>
            <div>
              <button 
                onClick={() => handleEditClick(note.id, note.header, note.body)}
                className="text-yellow-600 mr-4"
              >
                Edit
              </button>
              <button onClick={() => handleRemoveNote(note.id)} className="text-red-600">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NotesTab;
