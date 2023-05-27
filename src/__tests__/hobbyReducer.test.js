import hobbiesReducer, { addHobby, updateHobby, deleteHobby, logPractice, deletePracticeLogEntry } from '../redux/hobbies/hobbiesSlice';

describe('hobbies reducer', () => {
  const initialState = [];

  const sampleHobby = {
    id: '1',
    hobbyName: 'Piano',
    practiceTimeGoal: 60,
    daysOfWeek: ['Monday', 'Wednesday', 'Friday'],
    practiceLog: []
  };

  test('should handle addHobby', () => {
    const actual = hobbiesReducer(initialState, addHobby(sampleHobby));
    expect(actual[0]).toEqual(sampleHobby);
  });
  
  
  test('should handle addHobby', () => {
    const actual = hobbiesReducer(initialState, addHobby(sampleHobby));
    expect(actual[0]).toEqual(sampleHobby);
  });

  test('should not add a hobby with an existing id', () => {
    const stateWithHobby = hobbiesReducer(initialState, addHobby(sampleHobby));
    const actual = hobbiesReducer(stateWithHobby, addHobby(sampleHobby));
    expect(actual.length).toEqual(1);
  });

  test('should handle deleteHobby', () => {
    const stateWithHobby = hobbiesReducer(initialState, addHobby(sampleHobby));
    const actual = hobbiesReducer(stateWithHobby, deleteHobby({ id: sampleHobby.id }));
    expect(actual).toEqual([]);
  });

  test('should handle updateHobby', () => {
    const stateWithHobby = hobbiesReducer(initialState, addHobby(sampleHobby));
    const actual = hobbiesReducer(stateWithHobby, updateHobby({
      id: sampleHobby.id,
      hobbyName: 'Guitar'
    }));
    expect(actual[0].hobbyName).toEqual('Guitar');
  });

  test('should handle logPractice', () => {
    const stateWithHobby = hobbiesReducer(initialState, addHobby(sampleHobby));
    const actual = hobbiesReducer(stateWithHobby, logPractice({
      hobbyId: sampleHobby.id,
      date: '2023-01-01',
      timeSpent: 120
    }));
    expect(actual[0].practiceLog[0]).toEqual({
      id: expect.any(String),
      date: '2023-01-01',
      timeSpent: 120
    });
  });

  test('should handle deletePracticeLogEntry', () => {
    const stateWithHobby = hobbiesReducer(initialState, addHobby(sampleHobby));
    const stateWithLog = hobbiesReducer(stateWithHobby, logPractice({
      hobbyId: sampleHobby.id,
      date: '2023-01-01',
      timeSpent: 120
    }));
    const actual = hobbiesReducer(stateWithLog, deletePracticeLogEntry({
      hobbyId: sampleHobby.id,
      logId: stateWithLog[0].practiceLog[0].id
    }));
    expect(actual[0].practiceLog).toEqual([]);
  });
});
