import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { logPractice } from '../redux/hobbies/hobbiesSlice';
import { useSelector } from 'react-redux';


const LogPracticeForm = ({ date, hobbyId, }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [minutes, setMinutes] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);
  const dispatch = useDispatch();
 


  const { user } = useSelector((state) => state.user);

  const isButtonDisabled = isFormOpen && (!minutes || parseInt(minutes) <= 0);


  const handleLogClick = () => {
    if (isFormOpen) {
        console.log(date);
        const logEntry = {
            date: date,
            timeSpent: parseInt(minutes, 10)
          };
    console.log(logEntry);
      dispatch(logPractice({ user: user, hobbyId: hobbyId, logEntry: logEntry}));
      
      setMinutes('');
      setIsFormOpen(false);
    } else {
      setIsFormOpen(true);
    }
  };

  useEffect(() => {
    if (minutes && parseInt(minutes) > 0) {
        setIsEnabled(true);
    } else {
        setIsEnabled(false);
    }
  }, [minutes]);



  return (
    <div>
      {isFormOpen ? (
        <div>
            
            <label  className='font-bold underline'>How long did you practice in minutes? </label>
            <br />
          <input 
          className='text-black text-center sm:w-1/5 h-9 mt-2'
            type="number" 
            value={minutes}
            onChange={e => setMinutes(e.target.value)}
            placeholder="0"
          />
        </div>
      ) : null}
      <button className={`border ${isButtonDisabled ? 'border-gray-300' : 'border-green-600'} rounded p-2 mt-2 ${isButtonDisabled ? 'opacity-50' : ''} hover:shadow hover:shadow-green-600`} disabled={isButtonDisabled} onClick={handleLogClick}>
        {isFormOpen ? 'Submit Log' : 'Log Practice'}
      </button>
    </div>
  );
}

export default LogPracticeForm;
