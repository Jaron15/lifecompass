import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  addNote, 
  deleteNote, 
  updateNote 
} from '../../../../../redux/hobbies/hobbiesSlice';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';
import DeleteModal from '@/src/components/DeleteModal';

function Notes({ hobby }) {
  const dispatch = useDispatch();
  const allNotes = useSelector((state) => {
    const notes =
      state.hobbies.hobbies.find((h) => h.refId === hobby.refId)?.notes || [];
    return [...notes].sort((a, b) => b.id - a.id);
  });

  const { user } = useSelector((state) => state.user);
  const [noteHeader, setNoteHeader] = useState("");
  const [noteBody, setNoteBody] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editing, setEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [viewNote, setViewNote] = useState(null);

  const handleAddNote = () => {
    if (noteHeader.trim() || noteBody.trim()) {
      const newNote = {
        id: Date.now().toString(),
        header: noteHeader.trim() || "Header",
        body: noteBody.trim() || "Body...",
      };
      dispatch(
        addNote({
          user,
          hobbyId: hobby.refId,
          note: newNote,
        })
      );
      setNoteHeader("");
      setNoteBody("");
    }
  };

  const confirmRemoveNote = (noteId) => {
    dispatch(
      deleteNote({
        user,
        hobbyId: hobby.refId,
        noteId,
      })
    );
    setShowDeleteModal(false);
    setNoteHeader("");
    setNoteBody("");
    setViewNote(null);
    setEditing(false);
  };

  const handleEditClick = (noteId, header, body) => {
    setEditingNoteId(noteId);
    setNoteHeader(header);
    setNoteBody(body);
  };

  const handleConfirmEdit = (noteId) => {
    if (noteHeader.trim() || noteBody.trim()) {
      const updatedNote = {
        id: noteId,
        header: noteHeader.trim() || "Header",
        body: noteBody.trim() || "Body...",
      };
      dispatch(
        updateNote({
          user,
          hobbyId: hobby.refId,
          updatedNote: updatedNote,
          noteId: noteId,
        })
      );
      setViewNote(updatedNote);
      setNoteHeader("");
      setNoteBody("");
      setEditingNoteId(null);
      setEditing(false);
    }
  };

  const handleNoteClick = (note) => {
    setViewNote(note);
  };

  const handleCreateNew = () => {
    setNoteHeader("");
    setNoteBody("");
    setCreating(true);
    setEditing(false);
    setViewNote(null);
  };

  const handleSaveNewNote = () => {
    handleAddNote();
    setCreating(false);
  };

  return (
    <div className="rounded h-full flex flex-col">
      {/* Top Bar with Notes title and Add button */}
      <div className="flex justify-between items-center bg-transparent sm:mx-2 lg:mx-4 2xl:mx-0 ">
        <h2 className="text-2xl font-bold">Notes</h2>
        <button
          onClick={handleCreateNew}
          className="text-highlight text-3xl rounded"
        >
          +
        </button>
      </div>

      <div className="flex space-x-2 h-full lg:mx-2 2xl:mx-0">
        {/* Left Side - List of Notes */}
        <div className="w-1/3 overflow-y-scroll hide-scrollbar h-full ">
          {allNotes.length > 0 ? (
            <ul>
              {allNotes.map((note) => (
                <li
                  key={note.id}
                  onClick={() => handleNoteClick(note)}
                  className="flex justify-between items-start bg-white p-4 rounded mb-2 shadow cursor-pointer dark:bg-boxdark text-black dark:text-current"
                >
                  <div className="felx flex-col w-full">
                    <h3 className="text-2xl font-bold truncate w-full">
                      {note.header}
                    </h3>
                    <p className="truncate">{note.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="h-full flex flex-col justify-center items-center dark:bg-boxdark bg-white text-black dark:text-current">
              <div
                className="text-4xl mb-4 cursor-pointer"
                onClick={handleCreateNew}
              >
                +
              </div>
              <p>Create your first note</p>
            </div>
          )}
        </div>

        {/* Right Side - Note Content */}
        <div className="w-2/3 bg-white p-4 rounded shadow h-full dark:bg-boxdark text-black dark:text-current">
          {creating ? (
            <div className="h-full flex-col flex">
              <div className="flex justify-between items-center mb-4">
                <button onClick={() => setCreating(false)}>&larr; Back</button>
              </div>
              <textarea
                type="text"
                value={noteHeader}
                onChange={(e) => setNoteHeader(e.target.value)}
                placeholder="Header"
                className="w-full p-2 bg-transparent text-3xl font-bold mb-4 focus:border-none outline-none resize-none"
              />
              <textarea
                value={noteBody}
                onChange={(e) => setNoteBody(e.target.value)}
                placeholder="Body..."
                className="w-full p-2 rounded mb-4 bg-transparent border-none outline-none resize-none"
              />
              <div className="w-full h-full flex justify-center items-end">
                <button
                  className="h-15 w-35 rounded p-2 bg-highlight hover:bg-primary text-white"
                  onClick={handleSaveNewNote}
                >
                  Save
                </button>
              </div>
            </div>
          ) : viewNote ? (
            <div className="h-full">
              <div className="flex justify-between items-center mb-4">
                <button
                  onClick={() => {
                    setViewNote(null);
                    setEditing(false);
                  }}
                >
                  &larr; Back
                </button>
                {!editing ? (
                  <button
                    onClick={() => {
                      handleEditClick(
                        viewNote.id,
                        viewNote.header,
                        viewNote.body
                      );
                      setEditing(true);
                    }}
                  >
                    <FaPencilAlt />
                  </button>
                ) : (
                  <button onClick={() => setShowDeleteModal(true)}>
                    <FaTrash />
                  </button>
                )}
              </div>
              {editing ? (
                <div className="h-full overflow-clip">
                  <div className="h-[80%] overflow-y-scroll overflow-x-clip ">
                    <div
                      className="text-3xl font-bold focus:outline-none"
                      contentEditable={true}
                      suppressContentEditableWarning={true}
                      onBlur={(e) => setNoteHeader(e.target.innerText)}
                    >
                      {viewNote.header}
                    </div>
                    <div
                      className="mt-4 focus:outline-none"
                      contentEditable={true}
                      suppressContentEditableWarning={true}
                      onBlur={(e) => setNoteBody(e.target.innerText)}
                    >
                      {viewNote.body}
                    </div>
                  </div>
                  <div className="flex w-full justify-center space-x-6 mt-6 text-white">
                    <button
                      className=" rounded p-2 bg-highlight hover:bg-primary"
                      onClick={() => handleConfirmEdit(viewNote.id)}
                    >
                      Confirm
                    </button>
                    <button
                      className="bg-red-500 rounded p-2 hover:bg-red-600"
                      onClick={() => setEditing(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="overflow-y-scroll hide-scrollbar h-[95%]">
                    <h3 className="text-3xl font-bold">{viewNote.header}</h3>
                    <p className="mt-4">{viewNote.body}</p>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col justify-center items-center  text-black dark:text-current">
              <h3 className="text-3xl font-bold">Select a note</h3>
              <p className=" mt-4">
                ...or create a new one using the + button.
              </p>
            </div>
          )}
        </div>

        <DeleteModal
          isOpen={showDeleteModal}
          type={"note"}
          onDelete={() => confirmRemoveNote(viewNote.id)}
          onCancel={() => setShowDeleteModal(false)}
        />
      </div>
    </div>
  );
}

export default Notes;
