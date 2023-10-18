import React from 'react';
import MobileNotes from '@/src/components/THE/hobbyComponents/notebook/notes/MobileNotes';
import Notes from '@/src/components/THE/hobbyComponents/notebook/notes/Notes';

function NotesTab({ hobby }) {

  return (
    <div className='h-[70%] sm:h-[73%] md:h-[74%] lg:h-[75%] 2xl:h-[76%] '>
        <div className='h-full sm:hidden'>
            <MobileNotes hobby={hobby} />
        </div>
        <div className=' -m-4 md:-m-6 2xl:-m-7 h-full hidden sm:block'>
            <Notes hobby={hobby}  />
        </div>
    </div>
  );
}

export default NotesTab;
